import React, { useState, useEffect } from 'react';
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
  Alert,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { dummyGlobalContext } from '../data/dummyData';

const GlobalContext = () => {
  const [contextFiles, setContextFiles] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setContextFiles(dummyGlobalContext);
  }, []);

  const handleUploadSubmit = () => {
    if (uploadForm.name && uploadForm.description) {
      const newFile = {
        id: Date.now(),
        name: uploadForm.name,
        type: 'PDF',
        size: '2.1 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        description: uploadForm.description
      };
      setContextFiles(prev => [...prev, newFile]);
      setSuccess('File uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setUploadDialog(false);
      setUploadForm({ name: '', description: '', file: null });
    }
  };

  const handleEditSubmit = () => {
    setContextFiles(prev => prev.map(f => 
      f.id === editingFile.id ? { ...f, ...editForm } : f
    ));
    setSuccess('File updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
    setEditDialog(false);
    setEditingFile(null);
  };

  const handleDeleteFile = (fileId) => {
    setContextFiles(prev => prev.filter(f => f.id !== fileId));
    setSuccess('File deleted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleOpenEditDialog = (file) => {
    setEditingFile(file);
    setEditForm({
      name: file.name,
      description: file.description
    });
    setEditDialog(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'error';
      case 'CSV': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <DescriptionIcon />;
      case 'CSV': return <DescriptionIcon />;
      default: return <FolderIcon />;
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
          Global Context Management
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <FolderIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {contextFiles.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Files
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {contextFiles.filter(f => f.type === 'PDF').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF Files
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {contextFiles.filter(f => f.type === 'CSV').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CSV Files
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <UploadIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  Recent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest Uploads
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* File Management Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                Global Context Files
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialog(true)}
              >
                Upload New File
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These files are shared across all patients and provide general medical guidelines, protocols, and reference materials.
            </Typography>

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
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getTypeIcon(file.type)}
                          <Typography sx={{ ml: 1 }}>{file.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={file.type} 
                          color={getTypeColor(file.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {file.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Download">
                          <IconButton size="small" color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleOpenEditDialog(file)}
                          >
                            <EditIcon />
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
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Global Context File</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload files that will be available to all patients (PDF, CSV formats recommended)
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="File Name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  helperText="Enter a descriptive name for the file"
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
                  helperText="Describe the content and purpose of this file"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ py: 2 }}
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

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit File Information</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="File Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
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
      </Box>
    </DashboardLayout>
  );
};

export default GlobalContext; 