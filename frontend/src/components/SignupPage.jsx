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
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
  PersonAdd as SignUpIcon,
} from '@mui/icons-material';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle signup logic here
    console.log('Signup submitted:', formData);
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
          Sign Up
        </Typography>
      </Box>

      {/* Signup Form */}
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
            maxWidth: 500,
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(0, 127, 255, 0.02) 0%, rgba(0, 89, 178, 0.02) 100%)',
            border: 1,
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join our smart home community
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="/terms" underline="hover" sx={{ color: 'primary.main' }}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" underline="hover" sx={{ color: 'primary.main' }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              startIcon={<SignUpIcon />}
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
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignupPage;
