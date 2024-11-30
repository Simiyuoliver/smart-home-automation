import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  BoltOutlined as PowerIcon,
  AccessTimeOutlined as RuntimeIcon,
  UpdateOutlined as LastUpdateIcon,
} from '@mui/icons-material';

const DeviceStatsDialog = ({ open, onClose, device, stats }) => {
  if (!stats) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Device Statistics
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {device.name} ({device.type})
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Power Usage */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <PowerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 500 }}>
                {stats.powerUsage}W
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Power Usage
              </Typography>
            </Box>
          </Grid>

          {/* Runtime */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <RuntimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 500 }}>
                {stats.runtime}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Runtime Today
              </Typography>
            </Box>
          </Grid>

          {/* Last Updated */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LastUpdateIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 500 }}>
                {new Date(stats.lastUpdated).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceStatsDialog;
