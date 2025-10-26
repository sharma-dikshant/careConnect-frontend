import API from './apiClient';
import ENDPOINTS from './endpoints';

// Auth Services
export const authService = {
  login: async (email, password) => {
    const response = await API.post(ENDPOINTS.auth.login, { type: "doctor", email, password });
    console.log(response.data)
    return response.data;
  },

  signup: async (userData) => {
    const response = await API.post(ENDPOINTS.auth.signup, userData);
    return response.data;
  },

  logout: async () => {
    const response = await API.post(ENDPOINTS.auth.logout);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get(ENDPOINTS.auth.profile);
    return response.data;
  },

  refreshToken: async () => {
    const response = await API.post(ENDPOINTS.auth.refresh);
    return response.data;
  }
};

// Patient Services
export const patientService = {
  getAllPatients: async (doctorId) => {
    const response = await API.get(ENDPOINTS.patients.get_all_patients_of_doctor(doctorId));
    return response.data;
  },

  getPatient: async (patientId) => {
    const response = await API.get(ENDPOINTS.patients.get_patient(patientId));
    return response.data;
  },

  addPatient: async (patientData) => {
    const response = await API.post(ENDPOINTS.patients.add_patient, patientData);
    return response.data;
  },

  updatePatient: async (patientId, patientData) => {
    const response = await API.put(ENDPOINTS.patients.update_patient(patientId), patientData);
    return response.data;
  },

  deletePatient: async (patientId) => {
    const response = await API.delete(ENDPOINTS.patients.delete_patient(patientId));
    return response.data;
  },

  deactivatePatient: async (patientId) => {
    const response = await API.patch(ENDPOINTS.patients.inactive_patient(patientId));
    return response.data;
  },

  searchPatients: async (searchTerm) => {
    const response = await API.get(ENDPOINTS.patients.search_patients, {
      params: { q: searchTerm }
    });
    return response.data;
  }
};

// Context Services
export const contextService = {
  getGlobalContexts: async () => {
    const response = await API.get(ENDPOINTS.contexts.get_global_context);
    return response.data;
  },

  getLocalContexts: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.contexts.get_local_context(appointmentId));
    return response.data;
  },

  addGlobalContext: async (contextData) => {
    const response = await API.post(ENDPOINTS.contexts.add_global_context, contextData);
    return response.data;
  },

  addLocalContext: async (appointmentId, contextData) => {
    const response = await API.post(ENDPOINTS.contexts.add_appointment_context(appointmentId), contextData);
    return response.data;
  },

  updateGlobalContext: async (contextId, contextData) => {
    const response = await API.put(ENDPOINTS.contexts.update_global_context(contextId), contextData);
    return response.data;
  },

  updateLocalContext: async (contextId, contextData) => {
    const response = await API.put(ENDPOINTS.contexts.update_local_context(contextId), contextData);
    return response.data;
  },

  deleteGlobalContext: async (contextId) => {
    const response = await API.delete(ENDPOINTS.contexts.delete_global_context(contextId));
    return response.data;
  },

  deleteLocalContext: async (contextId) => {
    const response = await API.delete(ENDPOINTS.contexts.delete_local_context(contextId));
    return response.data;
  },

  uploadFile: async (file, contextType = 'global', appointmentId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', contextType);
    if (appointmentId) {
      formData.append('appointmentId', appointmentId);
    }

    const response = await API.post(ENDPOINTS.contexts.upload_file, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }
};

// Chat Services
export const chatService = {
  getChatHistory: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.chats.get_chat_history(appointmentId));
    return response.data;
  },

  sendMessage: async (appointmentId, messageData) => {
    const response = await API.post(ENDPOINTS.chats.send_message(appointmentId), messageData);
    return response.data;
  },

  getChats: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.chats.get_chats(appointmentId));
    return response.data;
  },

  createChat: async (appointmentId, chatData) => {
    const response = await API.post(ENDPOINTS.chats.add_chat(appointmentId), chatData);
    return response.data;
  }
};

// Notification Services
export const notificationService = {
  getNotifications: async () => {
    const response = await API.get(ENDPOINTS.notifications.get_notifications);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await API.patch(ENDPOINTS.notifications.mark_as_read(notificationId));
    return response.data;
  },

  markAsUnread: async (notificationId) => {
    const response = await API.patch(ENDPOINTS.notifications.mark_as_unread(notificationId));
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await API.delete(ENDPOINTS.notifications.delete_notification(notificationId));
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await API.patch(ENDPOINTS.notifications.mark_all_read);
    return response.data;
  },

  clearAll: async () => {
    const response = await API.delete(ENDPOINTS.notifications.clear_all);
    return response.data;
  }
};

// Profile Services
export const profileService = {
  getProfile: async () => {
    const response = await API.get(ENDPOINTS.profile.get_profile);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.patch(ENDPOINTS.profile.update_profile, profileData);
    return response.data;
  },

  uploadAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await API.post(ENDPOINTS.profile.upload_avatar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  getAppointments: async () => {
    const response = await API.get(ENDPOINTS.appointments.get_appointments);
    return response.data;
  },

  getAppointment: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.appointments.get_appointment(appointmentId));
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await API.post(ENDPOINTS.appointments.create_appointment, appointmentData);
    return response.data;
  },

  updateAppointment: async (appointmentId, appointmentData) => {
    const response = await API.put(ENDPOINTS.appointments.update_appointment(appointmentId), appointmentData);
    return response.data;
  },

  deleteAppointment: async (appointmentId) => {
    const response = await API.delete(ENDPOINTS.appointments.delete_appointment(appointmentId));
    return response.data;
  }
};

// Export all services
export default {
  authService,
  patientService,
  contextService,
  chatService,
  notificationService,
  profileService,
  appointmentService
};
