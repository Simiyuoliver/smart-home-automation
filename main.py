from datetime import timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status, Query, Body
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict, EmailStr
import uvicorn
import logging
import random
from datetime import datetime

from database import get_db, Device as DBDevice, User as DBUser
from auth import (
    get_current_user,
    create_access_token,
    get_password_hash,
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Home Automation System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class DeviceProperties(BaseModel):
    brightness: Optional[int] = None  # 0-100 for lights
    temperature: Optional[float] = None  # for thermostats
    locked: Optional[bool] = None  # for locks
    color: Optional[str] = None  # for RGB lights
    schedule: Optional[dict] = None  # for scheduled operations
    mode: Optional[str] = None  # for different device modes
    stats: Optional[dict] = None  # for device stats

class Device(BaseModel):
    device_id: str
    name: str
    type: str
    status: str
    properties: DeviceProperties
    model_config = ConfigDict(from_attributes=True)

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    properties: Optional[DeviceProperties] = None

class SignupResponse(BaseModel):
    user: User
    access_token: str
    token_type: str

class Schedule(BaseModel):
    enabled: bool
    time: str
    days: List[str]
    action: str

class DeviceSettings(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    autoOff: Optional[bool] = None
    autoOffDelay: Optional[int] = None
    notifications: Optional[bool] = None
    motionSensor: Optional[bool] = None
    energySaving: Optional[bool] = None

@app.post("/auth/login", response_model=LoginResponse)
async def login_for_access_token(
    form_data: dict,
    db: Session = Depends(get_db)
):
    try:
        username = form_data.get("username")
        password = form_data.get("password")
        
        logger.info(f"Login attempt for username: {username}")
        
        if not username or not password:
            logger.warning("Missing username or password in login request")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username and password are required"
            )
            
        user = authenticate_user(db, username, password)
        if not user:
            logger.warning(f"Failed login attempt for username: {username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        # Create a response that matches the LoginResponse model
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }
        
        logger.info(f"Successful login for user: {username}")
        logger.debug(f"Login response data: {response_data}")
        return response_data
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@app.post("/auth/signup", response_model=SignupResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Attempting to create user with username: {user.username}")
        
        # Validate username format
        if not user.username or len(user.username) < 3:
            logger.warning(f"Invalid username length: {len(user.username) if user.username else 0}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username must be at least 3 characters long"
            )
        
        # Validate email format
        if not user.email:
            logger.warning("Missing email")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )
        
        # Validate password strength
        if not user.password or len(user.password) < 6:
            logger.warning("Invalid password length")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters long"
            )
        
        # Check if username exists
        db_user = db.query(DBUser).filter(DBUser.username == user.username).first()
        if db_user:
            logger.warning(f"Username already exists: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email exists
        db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
        if db_user:
            logger.warning(f"Email already exists: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = DBUser(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        logger.info(f"Successfully created user: {user.username}")
        return {
            "user": db_user,
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {str(e)}"
        )

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: DBUser = Depends(get_current_user)):
    return current_user

@app.get("/devices", response_model=List[Device])
async def get_devices(
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(DBDevice).filter(DBDevice.owner_id == current_user.id).all()

@app.get("/devices/{device_id}", response_model=Device)
async def get_device(
    device_id: str,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(DBDevice).filter(
        DBDevice.device_id == device_id,
        DBDevice.owner_id == current_user.id
    ).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@app.post("/devices", response_model=Device)
async def add_device(
    device: Device,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_device = DBDevice(
        device_id=device.device_id,
        name=device.name,
        type=device.type,
        status=device.status,
        properties=device.properties,
        owner_id=current_user.id
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@app.put("/devices/{device_id}/status")
async def update_device_status(
    device_id: str,
    status: str = Query(...),
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(DBDevice).filter(
        DBDevice.device_id == device_id,
        DBDevice.owner_id == current_user.id
    ).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.status = status
    db.commit()
    return device

@app.put("/devices/{device_id}", response_model=Device)
async def update_device(
    device_id: str,
    device_update: DeviceUpdate,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
            
        if device_update.name is not None:
            device.name = device_update.name
        if device_update.type is not None:
            device.type = device_update.type
        if device_update.status is not None:
            device.status = device_update.status
        if device_update.properties is not None:
            device.properties.update(device_update.properties.dict(exclude_unset=True))
            
        db.commit()
        db.refresh(device)
        return device
    except Exception as e:
        logger.error(f"Error updating device: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update device")

@app.put("/devices/{device_id}/brightness")
async def set_brightness(
    device_id: str,
    brightness: int = Body(..., ge=0, le=100),
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        if device.type != "light":
            raise HTTPException(status_code=400, detail="Device is not a light")
            
        device.properties["brightness"] = brightness
        db.commit()
        return {"message": "Brightness updated successfully"}
    except Exception as e:
        logger.error(f"Error setting brightness: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to set brightness")

@app.put("/devices/{device_id}/temperature")
async def set_temperature(
    device_id: str,
    temperature: float = Body(..., ge=10, le=32),
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        if device.type != "thermostat":
            raise HTTPException(status_code=400, detail="Device is not a thermostat")
            
        device.properties["temperature"] = temperature
        db.commit()
        return {"message": "Temperature updated successfully"}
    except Exception as e:
        logger.error(f"Error setting temperature: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to set temperature")

@app.put("/devices/{device_id}/color")
async def set_color(
    device_id: str,
    color: str = Body(..., regex="^#[0-9A-Fa-f]{6}$"),
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        if device.type != "light":
            raise HTTPException(status_code=400, detail="Device is not a light")
            
        device.properties["color"] = color
        db.commit()
        return {"message": "Color updated successfully"}
    except Exception as e:
        logger.error(f"Error setting color: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to set color")

@app.put("/devices/{device_id}/lock")
async def toggle_lock(
    device_id: str,
    locked: bool = Body(...),
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        if device.type != "lock":
            raise HTTPException(status_code=400, detail="Device is not a lock")
            
        device.properties["locked"] = locked
        device.status = "locked" if locked else "unlocked"
        db.commit()
        return {"message": f"Lock {'locked' if locked else 'unlocked'} successfully"}
    except Exception as e:
        logger.error(f"Error toggling lock: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to toggle lock")

@app.put("/devices/{device_id}/schedule")
async def update_device_schedule(
    device_id: str,
    schedule: Schedule,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
            
        if "schedule" not in device.properties:
            device.properties["schedule"] = {}
            
        device.properties["schedule"].update(schedule.dict())
        db.commit()
        
        logger.info(f"Updated schedule for device {device_id}")
        return {"message": "Schedule updated successfully"}
    except Exception as e:
        logger.error(f"Error updating device schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update device schedule")

@app.put("/devices/{device_id}/settings")
async def update_device_settings(
    device_id: str,
    settings: DeviceSettings,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
            
        if settings.name is not None:
            device.name = settings.name
            
        settings_dict = settings.dict(exclude_unset=True)
        device.properties.update(settings_dict)
        
        db.commit()
        logger.info(f"Updated settings for device {device_id}")
        return {"message": "Settings updated successfully"}
    except Exception as e:
        logger.error(f"Error updating device settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update device settings")

@app.get("/devices/{device_id}/stats")
async def get_device_stats(
    device_id: str,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        device = db.query(DBDevice).filter(DBDevice.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
            
        # Simulate power usage and runtime calculations
        power_usage = random.randint(5, 100) if device.status == "on" else 0
        runtime = random.randint(1, 24) if device.status == "on" else 0
        
        stats = {
            "powerUsage": power_usage,
            "runtime": runtime,
            "lastUpdated": datetime.now().isoformat()
        }
        
        device.properties["stats"] = stats
        db.commit()
        
        return stats
    except Exception as e:
        logger.error(f"Error fetching device stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch device stats")

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail)},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
