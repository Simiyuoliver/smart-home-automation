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
import { PersonAddOutlined as PersonAddOutlinedIcon } from '@mui/icons-material';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/auth/signup', 
        {
          username,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if (response.data.access_token) {
        // Store token
        localStorage.setItem('token', response.data.access_token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError(
        error.response?.data?.detail || 
        'Signup failed. Please try again.'
      );
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
            Welcome
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
            Join us to manage your smart home
          </Typography>
        </Box>
      </Box>

      {/* Right side - Signup form */}
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
            <PersonAddOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Sign Up
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Create your smart home account
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
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
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  href="/login"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
