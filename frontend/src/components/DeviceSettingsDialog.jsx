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
  Switch,
  FormControlLabel,
} from '@mui/material';

const DeviceSettingsDialog = ({ open, onClose, device, onSave }) => {
  const [settings, setSettings] = useState({
    name: device?.name || '',
    type: device?.type || 'light',
    autoOff: device?.settings?.autoOff || false,
    autoOffDuration: device?.settings?.autoOffDuration || 60,
    notifyOnState: device?.settings?.notifyOnState || false,
    brightness: device?.settings?.brightness || 100,
    color: device?.settings?.color || '#ffffff',
  });

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    onSave(device.id, settings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Device Settings</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Configure device preferences and behavior
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Basic Settings */}
          <TextField
            label="Device Name"
            value={settings.name}
            onChange={handleChange('name')}
            fullWidth
            variant="outlined"
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Device Type</InputLabel>
            <Select
              value={settings.type}
              onChange={handleChange('type')}
              label="Device Type"
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="thermostat">Thermostat</MenuItem>
              <MenuItem value="lock">Lock</MenuItem>
            </Select>
          </FormControl>

          {/* Auto-off Settings */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Auto-Off Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoOff}
                  onChange={handleChange('autoOff')}
                  color="primary"
                />
              }
              label="Enable Auto-Off"
            />
            {settings.autoOff && (
              <TextField
                label="Auto-Off Duration (minutes)"
                type="number"
                value={settings.autoOffDuration}
                onChange={handleChange('autoOffDuration')}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                InputProps={{ inputProps: { min: 1, max: 1440 } }}
              />
            )}
          </Box>

          {/* Notifications */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Notifications</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnState}
                  onChange={handleChange('notifyOnState')}
                  color="primary"
                />
              }
              label="Notify on state change"
            />
          </Box>

          {/* Device-specific settings */}
          {settings.type === 'light' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Light Settings</Typography>
              <TextField
                label="Brightness (%)"
                type="number"
                value={settings.brightness}
                onChange={handleChange('brightness')}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                sx={{ mb: 1 }}
              />
              <TextField
                label="Color"
                type="color"
                value={settings.color}
                onChange={handleChange('color')}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceSettingsDialog;
