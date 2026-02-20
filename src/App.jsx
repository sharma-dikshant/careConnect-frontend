import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PatientDetails from './pages/PatientDetails';
import GlobalContext from './pages/GlobalContext';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Hardware from './components/Hardware';
import Test from './pages/Test';
import PatientManagement from './pages/PatientManagement';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointmentView from './pages/PatientAppointmentView';

// Minimal, Modern Medical CRM Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#0284C7',
      light: '#0EA5E9',
      dark: '#0369A1',
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#999999',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E5E5E5',
      400: '#CCCCCC',
      500: '#999999',
      600: '#666666',
      700: '#4D4D4D',
      800: '#333333',
      900: '#1A1A1A',
    },
    divider: '#E5E5E5',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    fontSize: 16,
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#1A1A1A',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#1A1A1A',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#1A1A1A',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1A1A1A',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1A1A1A',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#1A1A1A',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#1A1A1A',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#666666',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#1A1A1A',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#666666',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#999999',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.04)',
    '0 1px 3px rgba(0, 0, 0, 0.06)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.10)',
    '0 4px 16px rgba(0, 0, 0, 0.10)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 8px 32px rgba(0, 0, 0, 0.14)',
    '0 12px 40px rgba(0, 0, 0, 0.16)',
    '0 16px 48px rgba(0, 0, 0, 0.18)',
    '0 20px 56px rgba(0, 0, 0, 0.20)',
    '0 24px 64px rgba(0, 0, 0, 0.22)',
    '0 28px 72px rgba(0, 0, 0, 0.24)',
    '0 32px 80px rgba(0, 0, 0, 0.26)',
    '0 36px 88px rgba(0, 0, 0, 0.28)',
    '0 40px 96px rgba(0, 0, 0, 0.30)',
    '0 44px 104px rgba(0, 0, 0, 0.32)',
    '0 48px 112px rgba(0, 0, 0, 0.34)',
    '0 52px 120px rgba(0, 0, 0, 0.36)',
    '0 56px 128px rgba(0, 0, 0, 0.38)',
    '0 60px 136px rgba(0, 0, 0, 0.40)',
    '0 64px 144px rgba(0, 0, 0, 0.42)',
    '0 68px 152px rgba(0, 0, 0, 0.44)',
    '0 72px 160px rgba(0, 0, 0, 0.46)',
    '0 76px 168px rgba(0, 0, 0, 0.48)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#E5E5E5 #FAFAFA',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#E5E5E5',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#CCCCCC',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          borderRadius: 8,
          border: '1px solid #F0F0F0',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '10px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.24)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: '#E5E5E5',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#CCCCCC',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D32',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            '&.Mui-focused': {
              color: '#2E7D32',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        input: {
          padding: '12px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '12px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F0F0F0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #F0F0F0',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem',
          height: 24,
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#FAFAFA',
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#666666',
            borderBottom: '1px solid #E5E5E5',
            padding: '12px 16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: '#FAFAFA',
            },
            '&:last-child .MuiTableCell-root': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F0F0F0',
          padding: '16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '24px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
        },
        standardSuccess: {
          backgroundColor: '#F0FDF4',
          color: '#15803D',
          border: '1px solid #BBF7D0',
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          color: '#D97706',
          border: '1px solid #FDE68A',
        },
        standardInfo: {
          backgroundColor: '#F0F9FF',
          color: '#0369A1',
          border: '1px solid #BAE6FD',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 16px',
          border: '1px solid #E5E5E5',
          color: '#666666',
          '&.Mui-selected': {
            backgroundColor: '#2E7D32',
            color: '#FFFFFF',
            borderColor: '#2E7D32',
            '&:hover': {
              backgroundColor: '#1B5E20',
              borderColor: '#1B5E20',
            },
          },
          '&:hover': {
            backgroundColor: '#FAFAFA',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 8,
        },
        grouped: {
          '&:not(:first-of-type)': {
            marginLeft: 0,
            borderLeft: '1px solid #E5E5E5',
          },
          '&:not(:last-of-type)': {
            borderRight: '1px solid #E5E5E5',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.6875rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A1A1A',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: 6,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">
          Loading...
        </Typography>
      </Box>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Role-based Dashboard Component
const RoleDashboard = () => {
  const { userRole } = useAuth();
  
  console.log('RoleDashboard: Rendering for role:', userRole);
  
  // Show different dashboard based on role
  if (userRole === 'patient') {
    return <PatientDashboard />;
  }
  
  // Default to doctor dashboard
  return <Dashboard />;
};

// Role-Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  
  console.log('RoleProtectedRoute check:', { user: !!user, userRole, allowedRoles, loading });
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">
          Loading...
        </Typography>
      </Box>
    );
  }
  
  if (!user) {
    console.log('RoleProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('RoleProtectedRoute: Role not allowed, redirecting to home', { userRole, allowedRoles });
    return <Navigate to="/" replace />;
  }
  
  console.log('RoleProtectedRoute: Access granted');
  return children;
};

function AppRoutes() {
  const { user, userRole, loading } = useAuth();
  
  console.log('AppRoutes: Current auth state', { user: !!user, userRole, loading });
  
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/hardware" element={<Hardware />} />
      <Route path="/" element={
        <ProtectedRoute>
          <RoleDashboard />
        </ProtectedRoute>
      } />
      
      {/* Doctor-only routes */}
      <Route path="/patients" element={
        <RoleProtectedRoute allowedRoles={['doctor']}>
          <PatientManagement />
        </RoleProtectedRoute>
      } />
      <Route path="/patient/:id" element={
        <RoleProtectedRoute allowedRoles={['doctor']}>
          <PatientDetails />
        </RoleProtectedRoute>
      } />
      <Route path="/global-context" element={
        <RoleProtectedRoute allowedRoles={['doctor']}>
          <GlobalContext />
        </RoleProtectedRoute>
      } />
      
      {/* Shared routes (both doctor and patient) */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Patient-only routes */}
      <Route path="/appointment/:appointmentId" element={
        <RoleProtectedRoute allowedRoles={['patient']}>
          <PatientAppointmentView />
        </RoleProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
