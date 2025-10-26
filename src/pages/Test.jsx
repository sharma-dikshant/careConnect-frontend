import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

const Test = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      p: 3
    }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            🎉 Frontend is Working!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The React application is successfully rendering. This means:
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ React is working
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ Material-UI is working
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ Routing is working
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ Components are rendering
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/login'}
            size="large"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Test;
