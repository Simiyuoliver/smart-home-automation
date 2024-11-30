from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
import jwt
from datetime import datetime, timedelta
import sqlite3
import json

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "your-secret-key"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
def get_db():
    conn = sqlite3.connect('smart_home.db')
    conn.row_factory = sqlite3.Row
    return conn

# Settings Models
class UserSettings(BaseModel):
    notifications: bool
    emailAlerts: bool
    darkMode: bool
    temperature: str
    autoLock: bool
    energyReports: str
    quietHours: dict

# Initialize database tables
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create settings table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        settings_json TEXT NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# User authentication middleware
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# Settings endpoints
@app.get("/settings")
async def get_settings(current_user: str = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT settings_json FROM user_settings WHERE user_id = ?", (current_user,))
    result = cursor.fetchone()
    
    if result:
        settings = json.loads(result[0])
    else:
        # Default settings
        settings = {
            "notifications": True,
            "emailAlerts": True,
            "darkMode": False,
            "temperature": "celsius",
            "autoLock": True,
            "energyReports": "weekly",
            "quietHours": {
                "enabled": False,
                "start": "22:00",
                "end": "07:00"
            }
        }
        # Save default settings
        cursor.execute(
            "INSERT INTO user_settings (user_id, settings_json) VALUES (?, ?)",
            (current_user, json.dumps(settings))
        )
        conn.commit()
    
    conn.close()
    return settings

@app.put("/settings")
async def update_settings(settings: UserSettings, current_user: str = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT OR REPLACE INTO user_settings (user_id, settings_json) VALUES (?, ?)",
            (current_user, json.dumps(settings.dict()))
        )
        conn.commit()
        return {"message": "Settings updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Existing routes and configurations...
