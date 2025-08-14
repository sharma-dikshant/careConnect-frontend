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
  Paper
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
import { dummyProfile } from '../data/dummyData';

const Profile = () => {
  const [profile, setProfile] = useState(dummyProfile);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(dummyProfile);
  const [success, setSuccess] = useState('');

  const handleEdit = () => {
    setEditForm(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditMode(false);
  };

  const handleSave = () => {
    setProfile(editForm);
    setEditMode(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const profileFields = [
    { label: 'Name', value: profile.name, icon: <PersonIcon />, field: 'name' },
    { label: 'Email', value: profile.email, icon: <EmailIcon />, field: 'email' },
    { label: 'Phone', value: profile.phone, icon: <PhoneIcon />, field: 'phone' },
    { label: 'License', value: profile.license, icon: <BadgeIcon />, field: 'license' },
    { label: 'Specialization', value: profile.specialization, icon: <WorkIcon />, field: 'specialization' },
    { label: 'Experience', value: profile.experience, icon: <AccessTimeIcon />, field: 'experience' },
    { label: 'Education', value: profile.education, icon: <SchoolIcon />, field: 'education' }
  ];

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
          Profile
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                      mr: 3
                    }}
                  >
                    {profile.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {profile.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      {profile.specialization}
                    </Typography>
                    <Chip 
                      label={`${profile.experience} Experience`} 
                      color="secondary" 
                      size="medium"
                    />
                  </Box>
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={editMode ? handleCancel : handleEdit}
                    sx={{ minWidth: 120 }}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Profile Information */}
                <Grid container spacing={3}>
                  {profileFields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.field}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          color: 'primary.main', 
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {field.icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {field.label}
                        </Typography>
                      </Box>
                      {editMode ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editForm[field.field]}
                          onChange={handleInputChange}
                          name={field.field}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {field.value}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>

                {/* Bio Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Biography
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editForm.bio}
                      onChange={handleInputChange}
                      name="bio"
                      variant="outlined"
                      placeholder="Tell us about your medical background and expertise..."
                    />
                  ) : (
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {profile.bio}
                    </Typography>
                  )}
                </Box>

                {/* Save Button */}
                {editMode && (
                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="large"
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information Cards */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Professional Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Specialization"
                      secondary={profile.specialization}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={profile.experience}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Medical School"
                      secondary={profile.education}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="License Number"
                      secondary={profile.license}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Address"
                      secondary={profile.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number"
                      secondary={profile.phone}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        150+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patients Treated
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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