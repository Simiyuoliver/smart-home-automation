import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Chip,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  Menu,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  LightbulbOutlined,
  Thermostat as ThermostatIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Delete as DeleteIcon,
  Videocam as VideocamIcon,
  Lock as LockIcon,
  Sensors as SensorsIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  Router as NetworkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddDeviceDialog from './AddDeviceDialog';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsPage from './SettingsPage';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedSubView, setSelectedSubView] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [devices, setDevices] = useState(() => {
    // Load devices from localStorage on component mount
    const savedDevices = localStorage.getItem('smartHomeDevices');
    return savedDevices ? JSON.parse(savedDevices) : [];
  });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'light',
    room: '',
    status: 'off',
    parentalControls: {
      enabled: false,
      accessLevel: 'unrestricted',
      blockedDays: [],
      timeRestrictions: []
    }
  });
  const [quickActionData, setQuickActionData] = useState({
    security: {
      status: 'Armed',
      lastArmed: new Date().toLocaleTimeString(),
      activeSensors: 4,
    },
    lights: {
      activeLights: 3,
      totalLights: 8,
      energyUsage: '120W',
    },
    temperature: {
      current: 72,
      target: 70,
      humidity: 45,
      mode: 'cooling',
    },
    notifications: {
      unread: 3,
      priority: 1,
      latest: 'Motion detected in Garage',
    },
  });

  useEffect(() => {
    // Load user info from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUserInfo(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  }, []);

  const deviceTypes = [
    { value: 'light', label: 'Light', icon: <LightbulbOutlined /> },
    { value: 'thermostat', label: 'Thermostat', icon: <ThermostatIcon /> },
    { value: 'security', label: 'Security Device', icon: <SecurityIcon /> },
    { value: 'camera', label: 'Camera', icon: <VideocamIcon /> },
    { value: 'lock', label: 'Smart Lock', icon: <LockIcon /> },
    { value: 'sensor', label: 'Sensor', icon: <SensorsIcon /> }
  ];

  const rooms = [
    'Living Room',
    'Kitchen',
    'Bedroom',
    'Bathroom',
    'Office',
    'Garage',
    'Outdoor'
  ];

  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: <DashboardIcon />,
      color: theme.palette.primary.main
    },
    {
      id: 'devices',
      text: 'Devices',
      icon: <DevicesIcon />,
      color: theme.palette.info.main
    },
    {
      id: 'analytics',
      text: 'Analytics',
      icon: <BarChartIcon />,
      color: theme.palette.success.main
    },
    {
      id: 'settings',
      text: 'Settings',
      icon: <SettingsIcon />,
      color: theme.palette.warning.main
    }
  ];

  const quickActions = [
    {
      id: 'security',
      text: 'Security System',
      icon: <SecurityIcon />,
      color: 'error',
      status: (
        <Box>
          <Typography variant="h6" color="error">
            {quickActionData.security.status}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {quickActionData.security.activeSensors} Active Sensors
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Last updated: {quickActionData.security.lastArmed}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'lights',
      text: 'All Lights',
      icon: <LightbulbOutlined />,
      color: 'warning',
      status: (
        <Box>
          <Typography variant="h6" color="warning.main">
            {quickActionData.lights.activeLights}/{quickActionData.lights.totalLights}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Active Lights
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Energy: {quickActionData.lights.energyUsage}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'temperature',
      text: 'Temperature',
      icon: <ThermostatIcon />,
      color: 'info',
      status: (
        <Box>
          <Typography variant="h6" color="info.main">
            {quickActionData.temperature.current}°F
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Target: {quickActionData.temperature.target}°F
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Humidity: {quickActionData.temperature.humidity}% | Mode: {quickActionData.temperature.mode}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'notifications',
      text: 'Notifications',
      icon: <NotificationsIcon />,
      color: 'success',
      status: (
        <Box>
          <Typography variant="h6" color="success.main">
            {quickActionData.notifications.unread}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {quickActionData.notifications.priority} Priority
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            display="block"
            sx={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            Latest: {quickActionData.notifications.latest}
          </Typography>
        </Box>
      ),
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (viewId, subViewId = null) => {
    setSelectedView(viewId);
    setSelectedSubView(subViewId);
    setDrawerOpen(false);
  };

  const getBreadcrumbPath = () => {
    const currentMenu = menuItems.find(item => item.id === selectedView);
    const currentSubMenu = currentMenu?.subItems?.find(item => item.id === selectedSubView);
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={() => handleMenuItemClick('dashboard')}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        {currentMenu && (
          <Link
            color="inherit"
            href="#"
            onClick={() => handleMenuItemClick(currentMenu.id)}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {currentMenu.icon}
            <Typography sx={{ ml: 0.5 }}>{currentMenu.text}</Typography>
          </Link>
        )}
        {currentSubMenu && (
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {currentSubMenu.icon}
            <span style={{ marginLeft: '4px' }}>{currentSubMenu.text}</span>
          </Typography>
        )}
      </Breadcrumbs>
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'security':
        // Toggle security system
        setQuickActionData(prev => ({
          ...prev,
          security: {
            ...prev.security,
            status: prev.security.status === 'Armed' ? 'Disarmed' : 'Armed',
            lastArmed: new Date().toLocaleTimeString(),
          }
        }));
        break;
      case 'lights':
        // Toggle all lights
        setQuickActionData(prev => ({
          ...prev,
          lights: {
            ...prev.lights,
            activeLights: prev.lights.activeLights === 0 ? prev.lights.totalLights : 0,
          }
        }));
        break;
      case 'temperature':
        // Cycle through modes
        const modes = ['cooling', 'heating', 'auto', 'off'];
        setQuickActionData(prev => ({
          ...prev,
          temperature: {
            ...prev.temperature,
            mode: modes[(modes.indexOf(prev.temperature.mode) + 1) % modes.length],
          }
        }));
        break;
      case 'notifications':
        // Clear notifications
        setQuickActionData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            unread: 0,
            priority: 0,
          }
        }));
        break;
    }
  };

  const handleAddDevice = (newDevice) => {
    const updatedDevices = [...devices, { ...newDevice, id: Date.now() }];
    setDevices(updatedDevices);
    // Save to localStorage whenever devices are updated
    localStorage.setItem('smartHomeDevices', JSON.stringify(updatedDevices));
    setAddDeviceDialogOpen(false);
  };

  const handleDeviceUpdate = (updatedDevice) => {
    const updatedDevices = devices.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    );
    setDevices(updatedDevices);
    // Save to localStorage whenever devices are updated
    localStorage.setItem('smartHomeDevices', JSON.stringify(updatedDevices));
  };

  const handleDeviceToggle = (deviceId) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        // Check parental controls before toggling
        if (device.parentalControls?.enabled) {
          if (device.parentalControls.accessLevel === 'blocked') {
            // Device is blocked, don't allow toggle
            return device;
          }
          
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

          // Check if current day is blocked
          if (device.parentalControls.blockedDays.includes(currentDay)) {
            return device;
          }

          // Check time restrictions
          const isWithinRestriction = device.parentalControls.timeRestrictions.some(restriction => {
            const startTime = restriction.start.getHours() * 60 + restriction.start.getMinutes();
            const endTime = restriction.end.getHours() * 60 + restriction.end.getMinutes();
            return currentTime >= startTime && currentTime <= endTime;
          });

          if (isWithinRestriction) {
            return device;
          }
        }

        // If no restrictions or restrictions allow, toggle the device
        return {
          ...device,
          status: device.status === 'on' ? 'off' : 'on'
        };
      }
      return device;
    }));
    // Save to localStorage whenever devices are updated
    localStorage.setItem('smartHomeDevices', JSON.stringify(devices));
  };

  const handleDeleteDevice = (deviceId) => {
    const updatedDevices = devices.filter(device => device.id !== deviceId);
    setDevices(updatedDevices);
    // Save to localStorage whenever devices are updated
    localStorage.setItem('smartHomeDevices', JSON.stringify(updatedDevices));
  };

  const renderDeviceGrid = () => (
    <Grid container spacing={3}>
      {devices.map((device) => (
        <Grid item xs={12} sm={6} md={4} key={device.id}>
          <Card 
            sx={{ 
              position: 'relative',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease',
              borderLeft: `6px solid ${
                device.status === 'on' ? theme.palette.success.main : theme.palette.grey[400]
              }`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    {deviceTypes.find(type => type.value === device.type)?.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {device.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {device.room}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Chip 
                    label={device.status.toUpperCase()} 
                    color={device.status === 'on' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {deviceTypes.find(type => type.value === device.type)?.label}
                </Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeviceToggle(device.id)}
                    color={device.status === 'on' ? 'success' : 'default'}
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteDevice(device.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMainContent = () => {
    if (selectedView === 'dashboard') {
      return (
        <Box>
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action) => (
                    <Grid item xs={12} sm={6} md={3} key={action.id}>
                      <Paper
                        sx={{
                          p: 2,
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                        onClick={() => handleQuickAction(action.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              bgcolor: `${action.color}.main`,
                              color: 'white',
                              p: 1,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {action.icon}
                          </Box>
                          <Typography variant="subtitle1">
                            {action.text}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          {action.status}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Device Overview */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6">
                    Devices Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quick overview of your connected devices
                  </Typography>
                </Box>
                {renderDeviceGrid()}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      );
    }
    
    if (selectedView === 'devices') {
      return (
        <Box>
          <Paper sx={{ p: 3 }}>
            {/* Header with Add Device */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Devices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and monitor all your connected devices
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDeviceDialogOpen(true)}
                sx={{ height: 'fit-content' }}
              >
                Add Device
              </Button>
            </Box>

            {/* Device Categories */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                {[
                  { label: 'All Devices', count: devices.length, color: 'primary.main' },
                  { label: 'Online', count: devices.filter(d => d.status === 'on').length, color: 'success.main' },
                  { label: 'Offline', count: devices.filter(d => d.status === 'off').length, color: 'error.main' },
                  { label: 'Restricted', count: devices.filter(d => d.parentalControls?.enabled).length, color: 'warning.main' },
                ].map((category, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderTop: 3,
                        borderColor: category.color,
                      }}
                    >
                      <Typography variant="h4" sx={{ mb: 1, color: category.color }}>
                        {category.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Devices Grid */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                All Devices
              </Typography>
              {renderDeviceGrid()}
            </Box>
          </Paper>
        </Box>
      );
    }

    if (selectedView === 'analytics') {
      return <AnalyticsDashboard devices={devices} />;
    }

    if (selectedView === 'settings') {
      return <SettingsPage />;
    }
    
    return (
      <Typography variant="body1" color="text.secondary">
        Select a view from the menu
      </Typography>
    );
  };

  const handleLogout = () => {
    try {
      // Clear all auth-related data
      localStorage.clear(); // Clear all localStorage data
      
      // Reset all state
      setDevices([]);
      setSelectedView('dashboard');
      setSelectedSubView(null);
      
      // Close dialogs
      setLogoutDialogOpen(false);
      setAddDeviceDialogOpen(false);
      
      // Force navigation to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    handleMenuItemClick('settings', 'profile');
  };

  const renderUserMenu = () => (
    <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
      onClick={handleUserMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 180,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleProfileClick}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderLogoutDialog = () => (
    <Dialog
      open={logoutDialogOpen}
      onClose={() => setLogoutDialogOpen(false)}
    >
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout? You will need to login again to access your smart home.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleLogout} color="primary" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Home Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<SecurityIcon />}
              label="System Armed"
              color="success"
              variant="outlined"
              size="small"
            />
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                }}
              >
                {userInfo?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          {renderUserMenu()}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Smart Home
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                button
                onClick={() => handleMenuItemClick(item.id)}
                selected={selectedView === item.id}
              >
                <ListItemIcon sx={{ color: item.color }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
              {selectedView === item.id && item.subItems && (
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.id}
                      sx={{ pl: 4 }}
                      selected={selectedSubView === subItem.id}
                      onClick={() => handleMenuItemClick(item.id, subItem.id)}
                    >
                      <ListItemIcon>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8,
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          {getBreadcrumbPath()}
          <Paper sx={{ p: 3 }}>
            {renderMainContent()}
          </Paper>
        </Container>
      </Box>
      <AddDeviceDialog
        open={addDeviceDialogOpen}
        onClose={() => setAddDeviceDialogOpen(false)}
        onAdd={handleAddDevice}
      />
      {renderLogoutDialog()}
    </Box>
  );
};

export default Dashboard;
