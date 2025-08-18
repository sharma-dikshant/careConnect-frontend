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
import { dummyPatients } from "../data/dummyData";

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
  const navigate = useNavigate();

  useEffect(() => {
    setPatients(dummyPatients);
  }, []);

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

  const handleSubmit = () => {
    if (editingPatient) {
      // Edit existing patient
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editingPatient.id ? { ...p, ...formData } : p
        )
      );
      setSuccess("Patient updated successfully!");
    } else {
      // Add new patient
      const newPatient = {
        id: Date.now(),
        ...formData,
        medicalId: `MED${String(patients.length + 1).padStart(3, "0")}`,
        lastVisit: new Date().toISOString().split("T")[0],
      };
      setPatients((prev) => [...prev, newPatient]);
      setSuccess("Patient added successfully!");
    }

    setTimeout(() => setSuccess(""), 3000);
    handleCloseDialog();
  };

  const handleDeletePatient = (patientId) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    setSuccess("Patient removed successfully!");
    setTimeout(() => setSuccess(""), 3000);
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
      value: 4,
      icon: <NotificationsIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning.main",
    },
    {
      title: "Context Files",
      value: 8,
      icon: <FolderIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info.main",
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, color: "primary.main" }}>
          Dashboard
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  {stat.icon}
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, fontWeight: "bold", color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Patients Table */}
        <Box>
          <Typography variant="h5" sx={{ color: "primary.main", mb: 2 }}>
            Recent Patients
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Medical ID</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.slice(0, 5).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.medicalId}</TableCell>
                    <TableCell>{patient.diagnosis}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        color={
                          patient.status === "Active" ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPatient(patient.id)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(patient)}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePatient(patient.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
