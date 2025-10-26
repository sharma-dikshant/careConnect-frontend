import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { patientService, notificationService, contextService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    diagnosis: "",
    status: "Active",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [contextFiles, setContextFiles] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load patients
      if (user?.id) {
        const patientsData = await patientService.getAllPatients(user.id);
        setPatients(patientsData.patients || []);
      }
      
      // Load notifications
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData.notifications || []);
      
      // Load context files
      const contextData = await contextService.getGlobalContexts();
      setContextFiles(contextData.contexts || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({
        name: "",
        age: "",
        contact: "",
        email: "",
        diagnosis: "",
        status: "Active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPatient(null);
    setFormData({
      name: "",
      age: "",
      contact: "",
      email: "",
      diagnosis: "",
      status: "Active",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      
      if (editingPatient) {
        // Edit existing patient
        await patientService.updatePatient(editingPatient.id, formData);
        setSuccess("Patient updated successfully!");
        // Reload patients
        await loadDashboardData();
      } else {
        // Add new patient
        const newPatientData = {
          ...formData,
          doctorId: user.id,
          medicalId: `MED${String(patients.length + 1).padStart(3, "0")}`,
          lastVisit: new Date().toISOString().split("T")[0],
        };
        await patientService.addPatient(newPatientData);
        setSuccess("Patient added successfully!");
        // Reload patients
        await loadDashboardData();
      }

      setTimeout(() => setSuccess(""), 3000);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving patient:', error);
      setError(error.response?.data?.message || 'Failed to save patient');
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      setError("");
      await patientService.deletePatient(patientId);
      setSuccess("Patient removed successfully!");
      // Reload patients
      await loadDashboardData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(error.response?.data?.message || 'Failed to delete patient');
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary.main",
    },
    {
      title: "Active Cases",
      value: patients.filter((p) => p.status === "Active").length,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      color: "secondary.main",
    },
    {
      title: "Notifications",
      value: notifications.filter((n) => !n.isRead).length,
      icon: <NotificationsIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning.main",
    },
    {
      title: "Context Files",
      value: contextFiles.length,
      icon: <FolderIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info.main",
    },
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

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, color: "primary.main", fontWeight: 700 }}>
            Medical Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Dr. {user?.name || 'User'}. Here's your practice overview.
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: "100%",
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: `${stat.color}15`,
                      mr: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h3"
                        sx={{ 
                          fontWeight: 700, 
                          color: stat.color,
                          lineHeight: 1.2,
                          mb: 0.5
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Patients Table */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid #E0E0E0',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 600, mb: 0.5 }}>
                    Recent Patients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest patient activity and records
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate('/patients')}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Manage Patients
                </Button>
              </Box>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Medical ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Diagnosis</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Last Visit</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.slice(0, 5).map((patient) => (
                    <TableRow 
                      key={patient.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          '& .MuiTableCell-root': {
                            color: 'white',
                          }
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2, 
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem'
                          }}>
                            {patient.name?.charAt(0) || 'P'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {patient.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {patient.age} years
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {patient.medicalId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {patient.diagnosis || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={patient.status}
                          color={patient.status === "Active" ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {patient.lastVisit || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewPatient(patient.id)}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(patient)}
                              sx={{ 
                                color: 'secondary.main',
                                '&:hover': { backgroundColor: 'secondary.light', color: 'white' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePatient(patient.id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'error.light', color: 'white' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Add/Edit Patient Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPatient ? "Edit Patient" : "Add New Patient"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Discharged">Discharged</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;
