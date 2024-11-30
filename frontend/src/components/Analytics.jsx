import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [energyData, setEnergyData] = useState([]);
  const [deviceUsage, setDeviceUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalDevices: 0,
    activeDevices: 0,
    totalEnergy: 0,
    averageUsage: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Simulated data - replace with actual API calls
      const mockEnergyData = generateMockEnergyData(timeRange);
      const mockDeviceUsage = generateMockDeviceUsage();
      const mockSummary = {
        totalDevices: 12,
        activeDevices: 8,
        totalEnergy: 450,
        averageUsage: 37.5,
      };

      setEnergyData(mockEnergyData);
      setDeviceUsage(mockDeviceUsage);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockEnergyData = (range) => {
    const data = [];
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 12;
    
    for (let i = 0; i < days; i++) {
      data.push({
        name: range === 'year' ? `Month ${i + 1}` : `Day ${i + 1}`,
        energy: Math.floor(Math.random() * 50) + 20,
        cost: Math.floor(Math.random() * 30) + 10,
      });
    }
    return data;
  };

  const generateMockDeviceUsage = () => {
    return [
      { name: 'Smart Lights', usage: 35 },
      { name: 'Thermostat', usage: 25 },
      { name: 'Security Cameras', usage: 20 },
      { name: 'Smart Plugs', usage: 15 },
      { name: 'Other Devices', usage: 5 },
    ];
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analytics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Devices
              </Typography>
              <Typography variant="h4">{summary.totalDevices}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Devices
              </Typography>
              <Typography variant="h4">{summary.activeDevices}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Energy (kWh)
              </Typography>
              <Typography variant="h4">{summary.totalEnergy}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Usage (kWh)
              </Typography>
              <Typography variant="h4">{summary.averageUsage}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Time Range Selector */}
      <FormControl sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel>Time Range</InputLabel>
        <Select
          value={timeRange}
          label="Time Range"
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
          <MenuItem value="year">Last Year</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Energy Usage Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Energy Usage Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="energy"
                    stroke="#8884d8"
                    name="Energy (kWh)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#82ca9d"
                    name="Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Device Usage Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Device Usage Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={deviceUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#8884d8" name="Usage %" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Additional Analytics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Energy Saving Tips
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Schedule your devices to turn off during non-peak hours
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Optimize thermostat settings based on occupancy patterns
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Use motion sensors to automatically control lighting
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Monitor and adjust device settings for optimal efficiency
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
