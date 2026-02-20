const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        signup_doctor: '/auth/signup/doctor',
        signup_patient: '/auth/signup/patient',
        profile: '/users'
    },
    patients: {
        add_patient: '/patients',
        get_all_patients: '/patients/all',
        get_patient: (patient_id) => `/patients/${patient_id}`,
        update_patient: (patient_id) => `/patients/${patient_id}`,
        delete_patient: (patient_id) => `/patients/${patient_id}`,
        inactive_patient: (patient_id) => `/patients/inactive/${patient_id}`
    },
    care_protocols: {
        add_global: '/care-protocols',
        add_appointment: (appointment_id) => `/care-protocols/locals/${appointment_id}`,
        get_all: '/care-protocols',
        get_by_id: (id) => `/care-protocols/${id}`,
        delete_global: (context_id) => `/care-protocols/appointments/${context_id}`,
        delete_appointment: (context_id) => `/care-protocols/appointments/${context_id}`
    },
    messages: {
        send_message: (appointment_id) => `/messages/appointments/${appointment_id}`,
        get_messages: (appointment_id) => `/messages/${appointment_id}`
    },
    appointments: {
        get_appointments: '/appointments',
        create_appointment: '/appointments',
        get_appointment_messages: (appointment_id) => `/appointments/${appointment_id}/messages`
    },
    users: {
        get_profile: '/users',
        update_profile: '/users'
    }
}

export default ENDPOINTS;