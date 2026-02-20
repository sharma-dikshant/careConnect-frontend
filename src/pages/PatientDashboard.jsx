import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService, userService } from '../services/apiService';

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load patient profile
      const profileResponse = await userService.getProfile();
      setPatientInfo(profileResponse.data);

      // Load appointments with type=patient
      const appointmentsResponse = await appointmentService.getAppointments('patient');
      setAppointments(appointmentsResponse.data || []);
    } catch (error) {
      console.error('Error loading patient data:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>
            Welcome, {patientInfo?.name || user?.name || 'Patient'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your appointments and view your medical information
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Patient Info Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mr: 2,
                    }}
                  >
                    {patientInfo?.name?.charAt(0) || user?.name?.charAt(0) || 'P'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {patientInfo?.name || user?.name || 'Patient'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patientInfo?.email || user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Patient Information
                  </Typography>
                  {patientInfo?.phone && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {patientInfo.phone}
                    </Typography>
                  )}
                  {patientInfo?.age && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Age:</strong> {patientInfo.age}
                    </Typography>
                  )}
                  {patientInfo?.gender && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Gender:</strong> {patientInfo.gender}
                    </Typography>
                  )}
                  {patientInfo?.medicalId && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Medical ID:</strong> {patientInfo.medicalId}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointments List */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CalendarIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    My Appointments
                  </Typography>
                </Box>

                {appointments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No appointments scheduled
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {appointments.map((appointment, index) => (
                      <React.Fragment key={appointment.id}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleAppointmentClick(appointment.id)}
                            sx={{
                              borderRadius: 2,
                              mb: 1,
                              '&:hover': {
                                backgroundColor: 'grey.50',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <HospitalIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Appointment #{appointment.id}
                                  </Typography>
                                  <Chip
                                    label={appointment.status || 'Active'}
                                    color={getStatusColor(appointment.status)}
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  {appointment.date && (
                                    <Typography variant="caption" display="block">
                                      <TimeIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                      {new Date(appointment.date).toLocaleDateString()}
                                    </Typography>
                                  )}
                                  {appointment.doctorName && (
                                    <Typography variant="caption" display="block">
                                      <PersonIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                      Dr. {appointment.doctorName}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                        {index < appointments.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        backgroundColor: 'primary.50',
                        mr: 1.5
                      }}>
                        <CalendarIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {appointments.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        backgroundColor: 'success.50',
                        mr: 1.5
                      }}>
                        <TimeIcon sx={{ fontSize: 20, color: 'success.main' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Active
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {appointments.filter(a => a.status?.toLowerCase() === 'active').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        backgroundColor: 'info.50',
                        mr: 1.5
                      }}>
                        <FolderIcon sx={{ fontSize: 20, color: 'info.main' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Completed
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {appointments.filter(a => a.status?.toLowerCase() === 'completed').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1.5, 
                        backgroundColor: 'warning.50',
                        mr: 1.5
                      }}>
                        <CalendarIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Scheduled
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {appointments.filter(a => a.status?.toLowerCase() === 'scheduled').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default PatientDashboard;
