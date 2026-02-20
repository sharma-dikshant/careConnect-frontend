import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { appointmentService, careProtocolService, messageService, userService } from '../services/apiService';

const PatientAppointmentView = () => {
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [careProtocols, setCareProtocols] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadAppointmentData();
  }, [appointmentId]);

  const loadAppointmentData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load appointment details
      const appointmentResponse = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(appointmentResponse.data);

      // Load care protocols for this appointment
      const protocolsResponse = await careProtocolService.getAppointmentCareProtocols(appointmentId);
      setCareProtocols(protocolsResponse.data || []);

      // Load messages
      const messagesResponse = await messageService.getMessages(appointmentId);
      setMessages(messagesResponse.data || []);

      // Load doctor info if available
      if (appointmentResponse.data?.doctorId) {
        try {
          const doctorResponse = await userService.getProfile();
          setDoctorInfo(doctorResponse.data);
        } catch (err) {
          console.log('Could not load doctor info:', err);
        }
      }
    } catch (error) {
      console.error('Error loading appointment data:', error);
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await messageService.sendMessage(appointmentId, { content: newMessage });
      setNewMessage('');
      
      // Reload messages
      const messagesResponse = await messageService.getMessages(appointmentId);
      setMessages(messagesResponse.data || []);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const extractFilenameFromUrl = (url) => {
    if (!url) return 'Unknown File';
    try {
      const urlParts = url.split('/');
      const filenameWithUUID = urlParts[urlParts.length - 1];
      const parts = filenameWithUUID.split('_');
      if (parts.length > 1) {
        return parts.slice(1).join('_');
      }
      return filenameWithUUID;
    } catch (e) {
      return 'Unknown File';
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
            Appointment Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Appointment #{appointmentId}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Section: Care Protocols & Doctor Details */}
          <Grid item xs={12} md={6}>
            {/* Doctor Information */}
            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Doctor Information
                </Typography>
                
                {doctorInfo ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: 'primary.main',
                          mr: 2,
                        }}
                      >
                        {doctorInfo.name?.charAt(0) || 'D'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          Dr. {doctorInfo.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctorInfo.specialization || 'Medical Professional'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {doctorInfo.email && (
                        <ListItem>
                          <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText primary={doctorInfo.email} />
                        </ListItem>
                      )}
                      {doctorInfo.phone && (
                        <ListItem>
                          <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText primary={doctorInfo.phone} />
                        </ListItem>
                      )}
                      {doctorInfo.hospital && (
                        <ListItem>
                          <WorkIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText primary={doctorInfo.hospital} />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Doctor information not available
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Care Protocols */}
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Care Protocols & Medical Records
                </Typography>

                {careProtocols.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No care protocols available for this appointment
                  </Typography>
                ) : (
                  <List>
                    {careProtocols.map((protocol, index) => (
                      <React.Fragment key={protocol.id}>
                        <ListItem
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => window.open(protocol.file, '_blank')}
                            >
                              <DownloadIcon />
                            </IconButton>
                          }
                        >
                          <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <ListItemText
                            primary={protocol.name || extractFilenameFromUrl(protocol.file)}
                            secondary={protocol.created_at ? new Date(protocol.created_at).toLocaleDateString() : ''}
                          />
                        </ListItem>
                        {index < careProtocols.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Section: Chat Interface */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Messages
                </Typography>

                {/* Messages List */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mb: 2,
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  {messages.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                      No messages yet. Start a conversation with your doctor.
                    </Typography>
                  ) : (
                    messages.map((message) => (
                      <Paper
                        key={message.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: message.sender === 'patient' ? 'primary.light' : 'white',
                          ml: message.sender === 'patient' ? 'auto' : 0,
                          mr: message.sender === 'patient' ? 0 : 'auto',
                          maxWidth: '80%',
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {message.content || message.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {message.created_at ? new Date(message.created_at).toLocaleString() : ''}
                        </Typography>
                      </Paper>
                    ))
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    multiline
                    maxRows={3}
                    disabled={sending}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    sx={{ minWidth: '100px' }}
                  >
                    {sending ? <CircularProgress size={24} /> : <SendIcon />}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default PatientAppointmentView;
