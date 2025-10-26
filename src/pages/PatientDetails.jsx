import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Folder as FolderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { patientService, chatService, contextService } from '../services/apiService';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [contextFiles, setContextFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load patient details
      const patientData = await patientService.getPatient(id);
      setPatient(patientData.patient);
      setEditForm(patientData.patient);
      
      // Load chat history (assuming appointment ID is same as patient ID for now)
      const chatData = await chatService.getChatHistory(id);
      setChatHistory(chatData.messages || []);
      
      // Load context files
      const contextData = await contextService.getLocalContexts(id);
      setContextFiles(contextData.contexts || []);
      
    } catch (error) {
      console.error('Error loading patient data:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditSubmit = async () => {
    try {
      setError('');
      await patientService.updatePatient(id, editForm);
      setPatient(prev => ({ ...prev, ...editForm }));
      setSuccess('Patient information updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      setError(error.response?.data?.message || 'Failed to update patient');
    }
  };

  const handleUploadSubmit = async () => {
    try {
      setError('');
      if (uploadForm.name && uploadForm.description && uploadForm.file) {
        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('name', uploadForm.name);
        formData.append('description', uploadForm.description);
        formData.append('appointmentId', id);
        
        await contextService.uploadFile(uploadForm.file, 'local', id);
        setSuccess('File uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
        setUploadDialog(false);
        setUploadForm({ name: '', description: '', file: null });
        // Reload context files
        await loadPatientData();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      setError('');
      await contextService.deleteLocalContext(fileId);
      setSuccess('File deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      // Reload context files
      await loadPatientData();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(error.response?.data?.message || 'Failed to delete file');
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

  if (!patient) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Patient not found</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'error';
      case 'CSV': return 'success';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            Patient Details
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

        {/* Patient Info Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                  {patient.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {patient.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Medical ID: {patient.medicalId}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditDialog(true)}
              >
                Edit
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">Age</Typography>
                </Box>
                <Typography variant="body1">{patient.age} years</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">Contact</Typography>
                </Box>
                <Typography variant="body1">{patient.contact}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                </Box>
                <Typography variant="body1">{patient.email}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                </Box>
                <Chip 
                  label={patient.status} 
                  color={patient.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Diagnosis</Typography>
              <Typography variant="body1">{patient.diagnosis}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Chat History" icon={<ChatIcon />} iconPosition="start" />
              <Tab label="Context Management" icon={<FolderIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <CardContent>
            {/* Chat History Tab */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Chat History</Typography>
                  <Button variant="contained" size="small">
                    Start New Chat
                  </Button>
                </Box>
                
                <List>
                  {chatHistory.map((message, index) => (
                    <ListItem key={message.id} sx={{ 
                      flexDirection: 'column', 
                      alignItems: message.sender === 'doctor' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}>
                      <Box sx={{ 
                        maxWidth: '70%',
                        backgroundColor: message.sender === 'doctor' ? 'primary.main' : 'grey.100',
                        color: message.sender === 'doctor' ? 'white' : 'text.primary',
                        borderRadius: 2,
                        p: 2,
                        alignSelf: message.sender === 'doctor' ? 'flex-end' : 'flex-start'
                      }}>
                        <Typography variant="body1">{message.message}</Typography>
                        <Typography variant="caption" sx={{ 
                          color: message.sender === 'doctor' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                          mt: 1,
                          display: 'block'
                        }}>
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Context Management Tab */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Patient Context Files</Typography>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => setUploadDialog(true)}
                  >
                    Upload File
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Upload Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contextFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={file.type} 
                              color={getTypeColor(file.type)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{file.uploadDate}</TableCell>
                          <TableCell>{file.description}</TableCell>
                          <TableCell>
                            <Tooltip title="Download">
                              <IconButton size="small" color="primary">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteFile(file.id)}
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
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Edit Patient Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Patient Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact"
                value={editForm.contact}
                onChange={(e) => setEditForm(prev => ({ ...prev, contact: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                value={editForm.diagnosis}
                onChange={(e) => setEditForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Context File</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="File Name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Choose File (PDF/CSV)
                <input
                  type="file"
                  hidden
                  accept=".pdf,.csv"
                  onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files[0] }))}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PatientDetails; 