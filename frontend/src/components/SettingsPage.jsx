import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  useTheme,
  Divider,
  Stack,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SystemIcon,
  Language as LanguageIcon,
  Schedule as TimezoneIcon,
  VolumeUp as SoundIcon,
  Backup as BackupIcon,
  Storage as StorageIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('smartHomeSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      profile: {
        name: '',
        email: '',
        language: 'en',
        timezone: 'UTC',
      },
      security: {
        twoFactorAuth: false,
        autoLock: true,
        deviceApproval: false,
        dataCollection: true,
      },
      notifications: {
        pushNotifications: true,
        emailAlerts: true,
        deviceAlerts: true,
        updateNotifications: true,
        soundAlerts: true,
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        colorScheme: 'blue',
        animations: true,
        compactMode: false,
      },
      system: {
        autoUpdate: true,
        backupEnabled: true,
        dataSync: true,
        storageOptimization: false,
        debugMode: false,
      }
    };
  });

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('smartHomeSettings', JSON.stringify(settings));
      // Show success notification
      alert('Settings saved successfully!');
    } catch (error) {
      // Show error notification
      alert('Error saving settings: ' + error.message);
    }
  };

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: <PersonIcon />,
      color: theme.palette.primary.main,
      gridSize: { xs: 12 },
      priority: 1,
      content: (
        <Stack spacing={1}>
          <TextField
            fullWidth
            size="small"
            label="Name"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.profile.language}
              label="Language"
              onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Timezone</InputLabel>
            <Select
              value={settings.profile.timezone}
              label="Timezone"
              onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="EST">EST</MenuItem>
              <MenuItem value="PST">PST</MenuItem>
              <MenuItem value="GMT">GMT</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )
    },
    {
      title: 'Security Settings',
      icon: <SecurityIcon />,
      color: theme.palette.error.main,
      gridSize: { xs: 12 },
      priority: 2,
      content: (
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              />
            }
            label="Two-Factor Authentication"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.security.autoLock}
                onChange={(e) => handleSettingChange('security', 'autoLock', e.target.checked)}
              />
            }
            label="Auto-Lock"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.security.deviceApproval}
                onChange={(e) => handleSettingChange('security', 'deviceApproval', e.target.checked)}
              />
            }
            label="Device Approval"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.security.dataCollection}
                onChange={(e) => handleSettingChange('security', 'dataCollection', e.target.checked)}
              />
            }
            label="Data Collection"
          />
        </Stack>
      )
    },
    {
      title: 'Notification Settings',
      icon: <NotificationsIcon />,
      color: theme.palette.secondary.main,
      gridSize: { xs: 12 },
      priority: 3,
      content: (
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              />
            }
            label="Push Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.notifications.emailAlerts}
                onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
              />
            }
            label="Email Alerts"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.notifications.deviceAlerts}
                onChange={(e) => handleSettingChange('notifications', 'deviceAlerts', e.target.checked)}
              />
            }
            label="Device Alerts"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.notifications.updateNotifications}
                onChange={(e) => handleSettingChange('notifications', 'updateNotifications', e.target.checked)}
              />
            }
            label="Update Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.notifications.soundAlerts}
                onChange={(e) => handleSettingChange('notifications', 'soundAlerts', e.target.checked)}
              />
            }
            label="Sound Alerts"
          />
        </Stack>
      )
    },
    {
      title: 'Appearance Settings',
      icon: <PaletteIcon />,
      color: theme.palette.warning.main,
      gridSize: { xs: 12 },
      priority: 4,
      content: (
        <Stack spacing={1}>
          <FormControl fullWidth size="small">
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.appearance.theme}
              label="Theme"
              onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Font Size</InputLabel>
            <Select
              value={settings.appearance.fontSize}
              label="Font Size"
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Color Scheme</InputLabel>
            <Select
              value={settings.appearance.colorScheme}
              label="Color Scheme"
              onChange={(e) => handleSettingChange('appearance', 'colorScheme', e.target.value)}
            >
              <MenuItem value="blue">Blue</MenuItem>
              <MenuItem value="green">Green</MenuItem>
              <MenuItem value="purple">Purple</MenuItem>
              <MenuItem value="orange">Orange</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.appearance.animations}
                onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
              />
            }
            label="Animations"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.appearance.compactMode}
                onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
              />
            }
            label="Compact Mode"
          />
        </Stack>
      )
    },
    {
      title: 'System Settings',
      icon: <SystemIcon />,
      color: theme.palette.success.main,
      gridSize: { xs: 12 },
      priority: 5,
      content: (
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.system.autoUpdate}
                onChange={(e) => handleSettingChange('system', 'autoUpdate', e.target.checked)}
              />
            }
            label="Auto Update"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.system.backupEnabled}
                onChange={(e) => handleSettingChange('system', 'backupEnabled', e.target.checked)}
              />
            }
            label="Backup Enabled"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.system.dataSync}
                onChange={(e) => handleSettingChange('system', 'dataSync', e.target.checked)}
              />
            }
            label="Data Sync"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.system.storageOptimization}
                onChange={(e) => handleSettingChange('system', 'storageOptimization', e.target.checked)}
              />
            }
            label="Storage Optimization"
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.system.debugMode}
                onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
              />
            }
            label="Debug Mode"
          />
        </Stack>
      )
    }
  ];

  return (
    <Box 
      sx={{ 
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        maxWidth: 800,
        mx: 'auto',
        boxShadow: 'rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px'
      }}>
        {/* Breadcrumb Navigation */}
        <Box 
          sx={{ 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            '& a': {
              color: 'text.secondary',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              '&:hover': {
                color: 'primary.main',
              }
            }
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
            Home
          </Link>
          <Box component="span" sx={{ color: 'text.disabled' }}>/</Box>
          <Typography 
            component="span" 
            sx={{ 
              fontSize: '0.875rem',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Settings
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ 
              mb: 0.5,
              background: 'linear-gradient(45deg, #007FFF 0%, #0059B2 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}>
              Settings Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Quick overview of your system settings
            </Typography>
          </Box>
        </Box>

        <Grid 
          container 
          spacing={2}
          direction="column"
          sx={{ 
            '& > .MuiGrid-item': {
              display: 'flex',
              width: '100%'
            }
          }}
        >
          {[...settingsSections]
            .sort((a, b) => a.priority - b.priority)
            .map((section, index) => (
            <Grid item {...section.gridSize} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${section.color}08 0%, ${theme.palette.background.paper} 100%)`,
                  border: 1,
                  borderColor: `${section.color}20`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 0 0 1px ${section.color}30, ${theme.shadows[8]}`,
                    '& .section-icon': {
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <Box sx={{ 
                  p: 0.75, 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: 1,
                  borderColor: `${section.color}20`,
                  bgcolor: `${section.color}05`
                }}>
                  <Box
                    className="section-icon"
                    sx={{
                      bgcolor: `${section.color}12`,
                      color: section.color,
                      p: 0.4,
                      borderRadius: 0.75,
                      display: 'flex',
                      mr: 0.75,
                      transition: 'transform 0.3s ease-in-out',
                      '& > svg': {
                        fontSize: '1rem'
                      }
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'text.primary', 
                      fontWeight: 600,
                      letterSpacing: '0.015em',
                      fontSize: '0.75rem'
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    p: 0.75,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiStack-root': {
                      height: '100%',
                      justifyContent: 'space-between'
                    },
                    '& .MuiFormControl-root': {
                      minWidth: 0,
                      '& .MuiInputBase-root': {
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': {
                          py: 0.75,
                        },
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem',
                        transform: 'translate(14px, 6px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        }
                      }
                    },
                    '& .MuiFormControlLabel-root': {
                      mx: 0,
                      '& .MuiTypography-root': {
                        fontSize: '0.75rem'
                      }
                    },
                    '& .MuiSwitch-root': {
                      '& .MuiSwitch-switchBase': {
                        padding: 0.5,
                        '&.Mui-checked': {
                          color: section.color,
                          transform: 'translateX(12px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: `${section.color}50`
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 12,
                        height: 12,
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 16,
                        height: 'auto'
                      }
                    }
                  }}
                >
                  {section.content}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ 
        position: 'fixed',
        bottom: 16,
        right: 24,
        zIndex: 1000
      }}>
        <Button 
          variant="contained" 
          color="primary"
          size="medium"
          onClick={saveSettings}
          sx={{
            borderRadius: 1.5,
            px: 2.5,
            py: 0.75,
            fontSize: '0.875rem',
            background: 'linear-gradient(45deg, #007FFF 0%, #0059B2 100%)',
            boxShadow: 'rgba(0, 127, 255, 0.24) 0px 8px 16px 0px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #0059B2 0%, #003A75 100%)',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 127, 255, 0.32) 0px 12px 20px 0px',
            }
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
