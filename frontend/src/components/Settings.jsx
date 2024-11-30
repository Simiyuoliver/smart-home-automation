import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    temperature: 'celsius',
    autoLock: true,
    energyReports: 'weekly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load settings. Please try again.');
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
    setError(null);
  };

  const handleQuietHoursChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSaved(false);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/settings',
        settings,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSaved(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleChange('notifications')}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailAlerts}
                      onChange={handleChange('emailAlerts')}
                    />
                  }
                  label="Email Alerts"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Display
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={handleChange('darkMode')}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControl fullWidth>
                  <InputLabel>Temperature Unit</InputLabel>
                  <Select
                    value={settings.temperature}
                    label="Temperature Unit"
                    onChange={handleChange('temperature')}
                  >
                    <MenuItem value="celsius">Celsius</MenuItem>
                    <MenuItem value="fahrenheit">Fahrenheit</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Security
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoLock}
                    onChange={handleChange('autoLock')}
                  />
                }
                label="Auto-Lock Devices"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Reports */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Reports
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Energy Reports</InputLabel>
                <Select
                  value={settings.energyReports}
                  label="Energy Reports"
                  onChange={handleChange('energyReports')}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Quiet Hours */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quiet Hours
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.quietHours.enabled}
                      onChange={handleQuietHoursChange('enabled')}
                    />
                  }
                  label="Enable Quiet Hours"
                />
                {settings.quietHours.enabled && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={settings.quietHours.start}
                        onChange={handleQuietHoursChange('start')}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="End Time"
                        type="time"
                        value={settings.quietHours.end}
                        onChange={handleQuietHoursChange('end')}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
