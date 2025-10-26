const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        signup: '/auth/signup',
        refresh: '/auth/refresh',
        profile: '/users'
    },
    patients: {
        add_patient: '/patients',
        get_all_patients_of_doctor: (doctor_id) => `/patients/all/${doctor_id}`,
        get_patient: (patient_id) => `/patients/${patient_id}`,
        update_patient: (patient_id) => `/patients/${patient_id}`,
        delete_patient: (patient_id) => `/patients/${patient_id}`,
        inactive_patient: (patient_id) => `/patients/inactive/${patient_id}`,
        search_patients: '/patients/search'
    },
    contexts: {
        add_global_context: '/contexts/globals',
        add_appointment_context: (appointment_id) => `/contexts/locals/${appointment_id}`,
        get_global_context: '/contexts/globals',
        get_local_context: (appointment_id) => `/contexts/locals/${appointment_id}`,
        update_global_context: (context_id) => `/contexts/globals/${context_id}`,
        update_local_context: (context_id) => `/contexts/locals/${context_id}`,
        delete_global_context: (context_id) => `/contexts/globals/${context_id}`,
        delete_local_context: (context_id) => `/contexts/locals/${context_id}`,
        upload_file: '/contexts/upload'
    },
    chats: {
        add_chat: (appointment_id) => `/chats/${appointment_id}`,
        get_chats: (appointment_id) => `/chats/${appointment_id}`,
        send_message: (appointment_id) => `/chats/${appointment_id}/message`,
        get_chat_history: (appointment_id) => `/chats/${appointment_id}/history`
    },
    notifications: {
        get_notifications: '/notifications',
        mark_as_read: (notification_id) => `/notifications/${notification_id}/read`,
        mark_as_unread: (notification_id) => `/notifications/${notification_id}/unread`,
        delete_notification: (notification_id) => `/notifications/${notification_id}`,
        mark_all_read: '/notifications/mark-all-read',
        clear_all: '/notifications/clear-all'
    },
    profile: {
        get_profile: '/users',
        update_profile: '/users',
        upload_avatar: '/users/avatar'
    },
    appointments: {
        get_appointments: '/appointments',
        create_appointment: '/appointments',
        update_appointment: (appointment_id) => `/appointments/${appointment_id}`,
        delete_appointment: (appointment_id) => `/appointments/${appointment_id}`,
        get_appointment: (appointment_id) => `/appointments/${appointment_id}`
    }
}

export default ENDPOINTS;