import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const DeviceScheduleDialog = ({ open, onClose, device, onSave }) => {
  const [schedules, setSchedules] = useState(device?.schedules || []);
  const [newSchedule, setNewSchedule] = useState({
    time: '12:00',
    action: 'on',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddSchedule = () => {
    setSchedules([...schedules, { ...newSchedule, id: Date.now() }]);
    setNewSchedule({
      time: '12:00',
      action: 'on',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    });
  };

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
  };

  const handleDayToggle = (day) => {
    const currentDays = newSchedule.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setNewSchedule({ ...newSchedule, days: newDays });
  };

  const handleSave = () => {
    onSave(device.id, schedules);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Device Schedule</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Set up automated schedules for {device?.name}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Existing Schedules */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Current Schedules</Typography>
          <List>
            {schedules.map((schedule) => (
              <ListItem
                key={schedule.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={`${schedule.time} - Turn ${schedule.action}`}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {schedule.days.map((day) => (
                        <Chip
                          key={day}
                          label={day}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Add New Schedule */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Add New Schedule</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Time"
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                size="small"
                sx={{ width: 150 }}
                InputLabelProps={{ shrink: true }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newSchedule.action === 'on'}
                    onChange={(e) => setNewSchedule({
                      ...newSchedule,
                      action: e.target.checked ? 'on' : 'off'
                    })}
                    color="primary"
                  />
                }
                label={`Turn ${newSchedule.action}`}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Repeat on</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    onClick={() => handleDayToggle(day)}
                    color={newSchedule.days.includes(day) ? 'primary' : 'default'}
                    variant={newSchedule.days.includes(day) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSchedule}
              fullWidth
            >
              Add Schedule
            </Button>
          </Box>
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

export default DeviceScheduleDialog;
