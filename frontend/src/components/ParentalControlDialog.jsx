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
  Divider,
  Chip,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  AccessTime as AccessTimeIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ParentalControlDialog = ({ open, onClose, device, onSave }) => {
  const [controls, setControls] = useState({
    enabled: device.parentalControls?.enabled || false,
    accessLevel: device.parentalControls?.accessLevel || 'supervised',
    timeRestrictions: device.parentalControls?.timeRestrictions || [],
    maxUsageHours: device.parentalControls?.maxUsageHours || 2,
    blockedDays: device.parentalControls?.blockedDays || [],
    notifications: device.parentalControls?.notifications || true,
    override: {
      enabled: device.parentalControls?.override?.enabled || false,
      password: device.parentalControls?.override?.password || '',
    },
  });

  const [newTimeRestriction, setNewTimeRestriction] = useState({
    start: null,
    end: null,
  });

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const accessLevels = [
    {
      value: 'blocked',
      label: 'Blocked',
      description: 'Device access is completely blocked',
    },
    {
      value: 'supervised',
      label: 'Supervised',
      description: 'Access allowed with time restrictions',
    },
    {
      value: 'monitored',
      label: 'Monitored',
      description: 'Full access with usage monitoring',
    },
  ];

  const handleTimeRestrictionAdd = () => {
    if (newTimeRestriction.start && newTimeRestriction.end) {
      setControls({
        ...controls,
        timeRestrictions: [
          ...controls.timeRestrictions,
          newTimeRestriction,
        ],
      });
      setNewTimeRestriction({ start: null, end: null });
    }
  };

  const handleTimeRestrictionDelete = (index) => {
    const updatedRestrictions = controls.timeRestrictions.filter((_, i) => i !== index);
    setControls({
      ...controls,
      timeRestrictions: updatedRestrictions,
    });
  };

  const handleDayToggle = (day) => {
    const updatedDays = controls.blockedDays.includes(day)
      ? controls.blockedDays.filter((d) => d !== day)
      : [...controls.blockedDays, day];
    setControls({
      ...controls,
      blockedDays: updatedDays,
    });
  };

  const handleSave = () => {
    onSave({ ...device, parentalControls: controls });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Parental Controls</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {device.name}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={controls.enabled}
                onChange={(e) => setControls({ ...controls, enabled: e.target.checked })}
                color="primary"
              />
            }
            label="Enable Parental Controls"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Access Level</InputLabel>
              <Select
                value={controls.accessLevel}
                label="Access Level"
                onChange={(e) => setControls({ ...controls, accessLevel: e.target.value })}
                disabled={!controls.enabled}
              >
                {accessLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box>
                      <Typography variant="body1">{level.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {level.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Usage Hours per Day"
              value={controls.maxUsageHours}
              onChange={(e) => setControls({ ...controls, maxUsageHours: Number(e.target.value) })}
              disabled={!controls.enabled}
              InputProps={{
                inputProps: { min: 0, max: 24 }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Time Restrictions</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TimePicker
                  label="Start Time"
                  value={newTimeRestriction.start}
                  onChange={(newValue) => setNewTimeRestriction({ ...newTimeRestriction, start: newValue })}
                  disabled={!controls.enabled}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="End Time"
                  value={newTimeRestriction.end}
                  onChange={(newValue) => setNewTimeRestriction({ ...newTimeRestriction, end: newValue })}
                  disabled={!controls.enabled}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleTimeRestrictionAdd}
                  disabled={!controls.enabled || !newTimeRestriction.start || !newTimeRestriction.end}
                >
                  Add
                </Button>
              </Box>
            </LocalizationProvider>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {controls.timeRestrictions.map((restriction, index) => (
                <Chip
                  key={index}
                  label={`${restriction.start.toLocaleTimeString()} - ${restriction.end.toLocaleTimeString()}`}
                  onDelete={() => handleTimeRestrictionDelete(index)}
                  disabled={!controls.enabled}
                  icon={<AccessTimeIcon />}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Blocked Days</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {daysOfWeek.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  onClick={() => handleDayToggle(day)}
                  disabled={!controls.enabled}
                  color={controls.blockedDays.includes(day) ? 'primary' : 'default'}
                  variant={controls.blockedDays.includes(day) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Override Settings</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={controls.override.enabled}
                    onChange={(e) => setControls({
                      ...controls,
                      override: { ...controls.override, enabled: e.target.checked }
                    })}
                    disabled={!controls.enabled}
                  />
                }
                label="Allow Override with Password"
              />
              {controls.override.enabled && (
                <TextField
                  type="password"
                  label="Override Password"
                  value={controls.override.password}
                  onChange={(e) => setControls({
                    ...controls,
                    override: { ...controls.override, password: e.target.value }
                  })}
                  disabled={!controls.enabled}
                  size="small"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={controls.notifications}
                  onChange={(e) => setControls({ ...controls, notifications: e.target.checked })}
                  disabled={!controls.enabled}
                />
              }
              label="Receive Notifications on Access Attempts"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={controls.enabled && controls.override.enabled && !controls.override.password}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentalControlDialog;
