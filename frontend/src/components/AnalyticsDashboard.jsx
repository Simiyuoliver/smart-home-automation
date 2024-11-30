import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { 
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  EmojiObjects as InsightIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AnalyticsDashboard = ({ devices = [] }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('24h');
  const [powerData, setPowerData] = useState({
    totalConsumption: 0,
    highestConsumer: null,
    abnormalDevices: [],
    costEstimate: 0,
    byType: {},
    hourly: {},
  });

  // Generate realistic power consumption data
  const generatePowerData = () => {
    const consumption = {};
    const hourlyData = {};
    let total = 0;

    // Generate base consumption patterns for 24 hours
    const basePattern = Array.from({ length: 24 }, (_, hour) => {
      // Higher consumption during day hours (7am-10pm)
      if (hour >= 7 && hour <= 22) {
        return 0.8 + Math.random() * 0.4; // 80-120% of base load
      }
      return 0.3 + Math.random() * 0.3; // 30-60% of base load during night
    });

    // Default consumption patterns if no devices
    if (devices.length === 0) {
      const defaultDevices = {
        light: { count: 5, baseLoad: 10 },
        thermostat: { count: 1, baseLoad: 1000 },
        security: { count: 2, baseLoad: 5 },
      };

      Object.entries(defaultDevices).forEach(([type, { count, baseLoad }]) => {
        const typeConsumption = baseLoad * count;
        consumption[type] = typeConsumption;
        total += typeConsumption;

        // Generate hourly data with realistic patterns
        basePattern.forEach((factor, hour) => {
          const hourlyConsumption = typeConsumption * factor;
          hourlyData[hour] = (hourlyData[hour] || 0) + hourlyConsumption;
        });
      });
    } else {
      // Generate data based on actual devices
      devices.forEach(device => {
        const baseConsumption = {
          'light': { base: 10, variance: 5 },
          'thermostat': { base: 1000, variance: 500 },
          'security': { base: 5, variance: 2 },
          'camera': { base: 15, variance: 5 },
          'lock': { base: 5, variance: 2 },
          'sensor': { base: 2, variance: 1 },
        }[device.type] || { base: 10, variance: 5 };

        const deviceBaseConsumption = 
          baseConsumption.base + (Math.random() - 0.5) * baseConsumption.variance;

        consumption[device.type] = (consumption[device.type] || 0) + deviceBaseConsumption;
        total += deviceBaseConsumption;

        // Apply hourly pattern
        basePattern.forEach((factor, hour) => {
          const hourlyConsumption = deviceBaseConsumption * factor;
          hourlyData[hour] = (hourlyData[hour] || 0) + hourlyConsumption;
        });
      });
    }

    return {
      byType: consumption,
      hourly: hourlyData,
      total,
    };
  };

  useEffect(() => {
    const data = generatePowerData();
    
    // Find highest consumer
    const highestType = Object.entries(data.byType)
      .sort(([,a], [,b]) => b - a)[0];

    // Find abnormal devices (20% above average)
    const average = data.total / Object.keys(data.byType).length;
    const abnormal = Object.entries(data.byType)
      .filter(([,consumption]) => consumption > average * 1.2)
      .map(([type]) => type);

    // Calculate cost estimate (assuming $0.12 per kWh)
    const costEstimate = (data.total * 24 * 0.12) / 1000; // Convert W to kWh

    setPowerData({
      ...data,
      totalConsumption: data.total,
      highestConsumer: highestType ? {
        type: highestType[0],
        consumption: highestType[1],
      } : null,
      abnormalDevices: abnormal,
      costEstimate,
    });
  }, [timeRange, devices]);

  // Pie chart data
  const pieChartData = {
    labels: Object.keys(powerData.byType || {}).map(type => 
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
    datasets: [{
      data: Object.values(powerData.byType || {}),
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.success.main,
      ],
      borderColor: theme.palette.background.paper,
      borderWidth: 1,
    }],
  };

  // Line chart data
  const lineChartData = {
    labels: Object.keys(powerData.hourly || {}).map(hour => 
      `${hour.toString().padStart(2, '0')}:00`
    ),
    datasets: [{
      label: 'Power Consumption (W)',
      data: Object.values(powerData.hourly || {}),
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main + '20',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hourly Power Consumption',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Watts',
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        grid: {
          color: theme.palette.divider,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Consumption',
      value: `${powerData.totalConsumption.toFixed(1)}W`,
      icon: <BoltIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Highest Consumer',
      value: powerData.highestConsumer ? 
        `${powerData.highestConsumer.type} (${powerData.highestConsumer.consumption.toFixed(1)}W)` : 
        'N/A',
      icon: <TrendingUpIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Abnormal Usage',
      value: `${powerData.abnormalDevices.length} devices`,
      icon: <WarningIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Daily Cost Estimate',
      value: `$${powerData.costEstimate.toFixed(2)}`,
      icon: <InsightIcon />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Time Range Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(45deg, ${card.color}15, ${theme.palette.background.paper})`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      color: card.color,
                      mr: 1,
                      display: 'flex',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: card.color + '15',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: card.color,
                    fontWeight: 'bold',
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}08, ${theme.palette.background.paper})`,
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              Power Consumption by Device Type
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Pie 
                data={pieChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}08, ${theme.palette.background.paper})`,
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              Hourly Power Consumption
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Line 
                data={lineChartData} 
                options={lineChartOptions} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
