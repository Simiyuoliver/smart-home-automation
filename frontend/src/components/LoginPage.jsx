import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Breadcrumb Navigation */}
      <Box 
        sx={{ 
          p: 2,
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
          Login
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(0, 127, 255, 0.02) 0%, rgba(0, 89, 178, 0.02) 100%)',
            border: 1,
            borderColor: 'primary.main',
            borderColor: theme => `${theme.palette.primary.main}20`,
            boxShadow: 'rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                background: 'linear-gradient(45deg, #007FFF 0%, #0059B2 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 700,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your smart home dashboard
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  }
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                }
                label={
                  <Typography variant="body2">
                    Remember me
                  </Typography>
                }
              />
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  color: 'primary.main',
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                py: 1,
                mb: 2,
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
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
