import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { profileService } from '../services/apiService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await profileService.getProfile();
      setProfile(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setError("");
      const response = await profileService.updateProfile(editForm);
      setProfile(editForm);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const profileFields = [
    { label: 'Name', value: profile?.name || '', icon: <PersonIcon />, field: 'name' },
    { label: 'Email', value: profile?.email || '', icon: <EmailIcon />, field: 'email' },
    { label: 'Phone', value: profile?.phone || '', icon: <PhoneIcon />, field: 'phone' },
    { label: 'License', value: profile?.license || '', icon: <BadgeIcon />, field: 'license' },
    { label: 'Specialization', value: profile?.specialization || '', icon: <WorkIcon />, field: 'specialization' },
    { label: 'Experience', value: profile?.experience || 0, icon: <AccessTimeIcon />, field: 'experience' },
    { label: 'Hospital', value: profile?.hospital || '', icon: <SchoolIcon />, field: 'hospital' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Profile not found</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your professional information and account settings
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 80, sm: 100, md: 120 }, 
                        height: { xs: 80, sm: 100, md: 120 }, 
                        bgcolor: 'primary.main',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        mr: 3,
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                      }}
                    >
                      {profile?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                        Dr. {profile?.name || 'N/A'}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                        {profile?.specialization || 'Medical Professional'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${profile?.experience || 0} Years Experience`} 
                          color="secondary" 
                          size="medium"
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip 
                          label={profile?.hospital || 'Medical Center'} 
                          color="info" 
                          size="medium"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={editMode ? handleCancel : handleEdit}
                    sx={{ 
                      minWidth: { xs: '100%', sm: 140 },
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: editMode ? 'none' : '0 4px 12px rgba(46, 125, 50, 0.3)',
                    }}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Profile Information */}
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {profileFields.map((field) => (
                    <Grid item xs={12} sm={6} lg={4} key={field.field}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        backgroundColor: 'grey.50',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                          transform: 'translateY(-1px)',
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            color: 'primary.main', 
                            mr: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            p: 0.5,
                            borderRadius: 1,
                            backgroundColor: 'primary.light',
                          }}>
                            {field.icon}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {field.label}
                          </Typography>
                        </Box>
                        {editMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            value={editForm[field.field] || ''}
                            onChange={handleInputChange}
                            name={field.field}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                backgroundColor: 'white',
                              }
                            }}
                          />
                        ) : (
                          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {field.value || 'Not specified'}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Bio Section */}
                <Box sx={{ 
                  mt: 4, 
                  p: 3, 
                  borderRadius: 2, 
                  backgroundColor: 'grey.50',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Professional Biography
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editForm.bio || ''}
                      onChange={handleInputChange}
                      name="bio"
                      variant="outlined"
                      placeholder="Tell us about your medical background and expertise..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white',
                        }
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                      {profile?.bio || 'No biography available. Click "Edit Profile" to add your professional background.'}
                    </Typography>
                  )}
                </Box>

                {/* Save Button */}
                {editMode && (
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    gap: 2
                  }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="large"
                      sx={{ 
                        borderRadius: 2, 
                        px: 3, 
                        py: 1.5,
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information Cards */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                  Professional Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Specialization"
                      secondary={profile?.specialization || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={profile?.experience || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Hospital"
                      secondary={profile?.hospital || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="License Number"
                      secondary={profile?.license || 'N/A'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Address"
                      secondary={profile?.email || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number"
                      secondary={profile?.phone || 'N/A'}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                  Practice Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                      border: '1px solid rgba(25, 118, 210, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                      }
                    }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                        150+
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Patients Treated
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
                      border: '1px solid rgba(46, 125, 50, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                      }
                    }}>
                      <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, mb: 1 }}>
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Success Rate
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Profile; 