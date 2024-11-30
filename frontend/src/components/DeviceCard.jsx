import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Switch,
  Slider,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  AccessTime as ScheduleIcon,
  Delete as DeleteIcon,
  BarChart as StatsIcon,
  ChildCare as ParentalControlIcon,
  Block as BlockIcon,
  Visibility as MonitorIcon,
  SupervisorAccount as SupervisedIcon,
} from '@mui/icons-material';

const DeviceCard = ({
  device,
  onToggle,
  onTemperatureChange,
  onSettingsClick,
  onScheduleClick,
  onDeleteClick,
  onStatsClick,
  onUpdate,
}) => {
  const [temperature, setTemperature] = useState(device.temperature || 20);
  const [anchorEl, setAnchorEl] = useState(null);
  const [parentalControlOpen, setParentalControlOpen] = useState(false);

  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue);
    onTemperatureChange(device.id, newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleParentalControlSave = (updatedDevice) => {
    onUpdate(updatedDevice);
  };

  const getParentalControlIcon = () => {
    if (!device.parentalControls?.enabled) return null;
    
    switch (device.parentalControls.accessLevel) {
      case 'blocked':
        return <BlockIcon fontSize="small" />;
      case 'supervised':
        return <SupervisedIcon fontSize="small" />;
      case 'monitored':
        return <MonitorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getParentalControlLabel = () => {
    if (!device.parentalControls?.enabled) return null;
    
    switch (device.parentalControls.accessLevel) {
      case 'blocked':
        return 'Blocked';
      case 'supervised':
        return 'Supervised';
      case 'monitored':
        return 'Monitored';
      default:
        return null;
    }
  };

  return (
    <Card 
      sx={{ 
        width: '280px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '18px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              {device.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Switch
                checked={device.status === 'on'}
                onChange={() => onToggle(device.id)}
                disabled={device.parentalControls?.enabled && device.parentalControls?.accessLevel === 'blocked'}
              />
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography 
            sx={{ 
              fontSize: '14px',
              color: '#666',
              textTransform: 'lowercase',
            }}
          >
            {device.type}
          </Typography>
        </Box>

        {device.type === 'thermostat' && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography 
              sx={{ 
                fontSize: '14px',
                color: '#666',
                mb: 1,
              }}
            >
              Temperature (°C)
            </Typography>
            <Slider
              value={temperature}
              onChange={handleTemperatureChange}
              min={16}
              max={30}
              step={1}
              disabled={device.status !== 'on'}
              sx={{
                color: device.status === 'on' ? '#1976d2' : '#ccc',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: '#e0e0e0',
                },
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                textAlign: 'center',
                mt: 2,
                color: device.status === 'on' ? '#333' : '#999',
                fontSize: '28px',
                fontWeight: 500,
              }}
            >
              {temperature}°C
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={device.type}
            size="small"
            variant="outlined"
          />
          {device.parentalControls?.enabled && (
            <Tooltip title={`Parental Control: ${getParentalControlLabel()}`}>
              <Chip
                icon={getParentalControlIcon()}
                label={getParentalControlLabel()}
                size="small"
                color={device.parentalControls.accessLevel === 'blocked' ? 'error' : 'primary'}
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>

        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            mt: 2,
          }}
        >
          <Tooltip title="Statistics">
            <IconButton 
              size="small"
              sx={{ 
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
              onClick={() => onStatsClick(device.id)}
            >
              <StatsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Schedule">
            <IconButton 
              size="small"
              sx={{ 
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
              onClick={() => onScheduleClick(device.id)}
            >
              <ScheduleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton 
              size="small"
              sx={{ 
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
              onClick={() => onSettingsClick(device.id)}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton 
              size="small"
              sx={{ 
                color: '#f44336',
                '&:hover': {
                  backgroundColor: 'rgba(244,67,54,0.04)',
                },
              }}
              onClick={() => onDeleteClick(device.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            boxShadow: (theme) => theme.shadows[3],
          },
        }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          setParentalControlOpen(true);
        }}>
          <ListItemIcon>
            <ParentalControlIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Parental Controls</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          onDeleteClick(device.id);
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Device</ListItemText>
        </MenuItem>
      </Menu>
    </Card>

    {/* Assuming ParentalControlDialog is defined elsewhere */}
    {/* <ParentalControlDialog
      open={parentalControlOpen}
      onClose={() => setParentalControlOpen(false)}
      device={device}
      onSave={handleParentalControlSave}
    /> */}
  );
};

export default DeviceCard;
