import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      console.log('Attempting login...');
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      console.log('Server response:', response.data);

      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        console.error('Invalid response format:', response.data);
        setError('Invalid server response');
        return;
      }

      // Store authentication data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      console.log('Authentication successful, redirecting to dashboard...');
      
      // Force a page reload to ensure all auth state is updated
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* Left side - Welcome text */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 45%',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/pattern.svg")',
            opacity: 0.1,
          },
        }}
      >
        <Box 
          sx={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome Back
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
            Your smart home is waiting for you
          </Typography>
        </Box>
      </Box>

      {/* Right side - Login form */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: '0 0 55%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              mb: 2,
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Access your smart home dashboard
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
              <Typography
                color="error"
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'error.light',
                  borderRadius: 2,
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'error.dark',
                  border: '1px solid',
                  borderColor: 'error.main',
                }}
              >
                {error}
              </Typography>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 3,
                height: '48px',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
