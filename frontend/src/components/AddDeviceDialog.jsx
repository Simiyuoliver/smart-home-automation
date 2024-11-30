import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import {
  LightbulbOutlined as LightIcon,
  Thermostat as ThermostatIcon,
  Security as SecurityIcon,
  Videocam as CameraIcon,
  Lock as LockIcon,
  Sensors as SensorIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const deviceTypes = [
  { value: 'light', label: 'Light', icon: <LightIcon />, description: 'Smart lights, lamps, and switches' },
  { value: 'thermostat', label: 'Thermostat', icon: <ThermostatIcon />, description: 'Temperature control devices' },
  { value: 'security', label: 'Security Device', icon: <SecurityIcon />, description: 'Motion sensors, alarms' },
  { value: 'camera', label: 'Camera', icon: <CameraIcon />, description: 'Security cameras, doorbells' },
  { value: 'lock', label: 'Smart Lock', icon: <LockIcon />, description: 'Door locks, garage doors' },
  { value: 'sensor', label: 'Sensor', icon: <SensorIcon />, description: 'Environmental sensors' },
];

const rooms = [
  { value: 'living_room', label: 'Living Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'office', label: 'Office' },
  { value: 'garage', label: 'Garage' },
  { value: 'outdoor', label: 'Outdoor' },
];

const AddDeviceDialog = ({ open, onClose, onAdd }) => {
  const [device, setDevice] = useState({
    name: '',
    type: '',
    room: '',
    status: 'off',
    id: Date.now(),
    addedAt: new Date().toISOString(),
    powerConsumption: 0,
    schedule: [],
    notifications: true,
    parentalControl: {
      enabled: false,
      restrictions: [],
      timeRestrictions: []
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!device.name.trim()) newErrors.name = 'Name is required';
    if (!device.type) newErrors.type = 'Device type is required';
    if (!device.room) newErrors.room = 'Room is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd({
        ...device,
        id: Date.now().toString(),
        status: 'off',
        parentalControls: {
          enabled: false,
          accessLevel: 'unrestricted',
          timeRestrictions: [],
          blockedDays: [],
          maxUsageHours: 24,
          notifications: true,
          override: {
            enabled: false,
            password: '',
          },
        },
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setDevice({
      name: '',
      type: '',
      room: '',
      status: 'off',
      id: Date.now(),
      addedAt: new Date().toISOString(),
      powerConsumption: 0,
      schedule: [],
      notifications: true,
      parentalControl: {
        enabled: false,
        restrictions: [],
        timeRestrictions: []
      }
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add New Device</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Device Name"
                  value={device.name}
                  onChange={(e) => setDevice({ ...device, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.type} required>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={device.type}
                    label="Device Type"
                    onChange={(e) => setDevice({ ...device, type: e.target.value })}
                  >
                    {deviceTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {React.cloneElement(type.icon, { sx: { mr: 1 } })}
                          <Box>
                            <Typography variant="body1">{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
              Location
            </Typography>
            <FormControl fullWidth error={!!errors.room} required>
              <InputLabel>Room</InputLabel>
              <Select
                value={device.room}
                label="Room"
                onChange={(e) => setDevice({ ...device, room: e.target.value })}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.value} value={room.value}>
                    {room.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.room && <FormHelperText>{errors.room}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Device Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
              Device Details (Optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={device.manufacturer}
                  onChange={(e) => setDevice({ ...device, manufacturer: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={device.model}
                  onChange={(e) => setDevice({ ...device, model: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={device.description}
                  onChange={(e) => setDevice({ ...device, description: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Add any additional details about the device..."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<AddIcon />}
        >
          Add Device
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceDialog;
