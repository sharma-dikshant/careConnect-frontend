import API from './apiClient';
import ENDPOINTS from './endpoints';

// Auth Services
export const authService = {
  login: async (email, password, userType = 'doctor') => {
    const response = await API.post(ENDPOINTS.auth.login, { type: userType, email, password });
    console.log(response.data);
    return response.data;
  },

  signup: async (userData, userType = 'doctor') => {
    const endpoint = userType === 'doctor' ? ENDPOINTS.auth.signup_doctor : ENDPOINTS.auth.signup_patient;
    const response = await API.post(endpoint, userData);
    return response.data;
  },

  logout: async () => {
    const response = await API.post(ENDPOINTS.auth.logout);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get(ENDPOINTS.auth.profile);
    return response.data;
  }
};

// Patient Services
export const patientService = {
  getAllPatients: async () => {
    const response = await API.get(ENDPOINTS.patients.get_all_patients);
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
  }
};

// Care Protocol Services (formerly Context Services)
export const careProtocolService = {
  getAllCareProtocols: async () => {
    const response = await API.get(ENDPOINTS.care_protocols.get_all);
    return response.data;
  },

  getCareProtocolById: async (id) => {
    const response = await API.get(ENDPOINTS.care_protocols.get_by_id(id));
    return response.data;
  },

  addGlobalCareProtocol: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post(ENDPOINTS.care_protocols.add_global, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  addAppointmentCareProtocol: async (appointmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post(ENDPOINTS.care_protocols.add_appointment(appointmentId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  deleteGlobalCareProtocol: async (contextId) => {
    const response = await API.delete(ENDPOINTS.care_protocols.delete_global(contextId));
    return response.data;
  },

  deleteAppointmentCareProtocol: async (contextId) => {
    const response = await API.delete(ENDPOINTS.care_protocols.delete_appointment(contextId));
    return response.data;
  },

  getAppointmentCareProtocols: async (appointmentId) => {
    const response = await API.get(`/care-protocols/appointments/${appointmentId}`);
    return response.data;
  }
};

// Message Services (formerly Chat Services)
export const messageService = {
  getMessages: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.messages.get_messages(appointmentId));
    return response.data;
  },

  sendMessage: async (appointmentId, messageData) => {
    const response = await API.post(ENDPOINTS.messages.send_message(appointmentId), messageData);
    return response.data;
  }
};

// User/Profile Services
export const userService = {
  getProfile: async () => {
    const response = await API.get(ENDPOINTS.users.get_profile);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.patch(ENDPOINTS.users.update_profile, profileData);
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  getAppointments: async (type = 'doctor') => {
    const response = await API.get(ENDPOINTS.appointments.get_appointments, {
      params: { type }
    });
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await API.post(ENDPOINTS.appointments.create_appointment, appointmentData);
    return response.data;
  },

  getAppointmentById: async (appointmentId) => {
    const response = await API.get(`${ENDPOINTS.appointments.get_appointments}/${appointmentId}`);
    return response.data;
  },

  getAppointmentMessages: async (appointmentId) => {
    const response = await API.get(ENDPOINTS.appointments.get_appointment_messages(appointmentId));
    return response.data;
  }
};

// Export all services
export default {
  authService,
  patientService,
  careProtocolService,
  messageService,
  userService,
  appointmentService
};
