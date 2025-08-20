export const dummyPatients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    medicalId: "MED001",
    contact: "+1-555-0123",
    email: "john.smith@email.com",
    diagnosis: "Hypertension",
    lastVisit: "2024-01-15",
    status: "Active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 32,
    medicalId: "MED002",
    contact: "+1-555-0124",
    email: "sarah.johnson@email.com",
    diagnosis: "Diabetes Type 2",
    lastVisit: "2024-01-10",
    status: "Active"
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 58,
    medicalId: "MED003",
    contact: "+1-555-0125",
    email: "michael.brown@email.com",
    diagnosis: "Heart Disease",
    lastVisit: "2024-01-08",
    status: "Active"
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 28,
    medicalId: "MED004",
    contact: "+1-555-0126",
    email: "emily.davis@email.com",
    diagnosis: "Asthma",
    lastVisit: "2024-01-12",
    status: "Active"
  },
  {
    id: 5,
    name: "Robert Wilson",
    age: 67,
    medicalId: "MED005",
    contact: "+1-555-0127",
    email: "robert.wilson@email.com",
    diagnosis: "Arthritis",
    lastVisit: "2024-01-05",
    status: "Active"
  }
];

export const dummyNotifications = [
  {
    id: 1,
    title: "Emergency Alert",
    message: "Patient John Smith reported severe chest pain",
    type: "emergency",
    timestamp: "2024-01-20T10:30:00Z",
    isRead: false
  },
  {
    id: 2,
    title: "Patient Update",
    message: "Sarah Johnson's blood sugar levels are stable",
    type: "update",
    timestamp: "2024-01-20T09:15:00Z",
    isRead: true
  },
  {
    id: 3,
    title: "Appointment Reminder",
    message: "Michael Brown has an appointment tomorrow at 2 PM",
    type: "reminder",
    timestamp: "2024-01-20T08:00:00Z",
    isRead: false
  },
  {
    id: 4,
    title: "Test Results",
    message: "Emily Davis's lung function test results are ready",
    type: "results",
    timestamp: "2024-01-19T16:45:00Z",
    isRead: true
  }
];

export const dummyProfile = {
  id: 1,
  name: "Jennifer Martinez",
  email: "martinez@careconnect.com",
  specialization: "Internal Medicine",
  phone: "+1-555-0100",
  license: "MD12345",
  experience: "15 years",
  education: "Harvard Medical School",
  bio: "Experienced internal medicine physician with expertise in chronic disease management and preventive care."
};

export const dummyChatHistory = {
  1: [
    {
      id: 1,
      sender: "patient",
      message: "Hello doctor, I've been experiencing some chest discomfort",
      timestamp: "2024-01-20T10:00:00Z"
    },
    {
      id: 2,
      sender: "doctor",
      message: "Hello John, I'm sorry to hear that. Can you describe the pain in more detail?",
      timestamp: "2024-01-20T10:05:00Z"
    },
    {
      id: 3,
      sender: "patient",
      message: "It's a dull ache in the center of my chest, worse when I move around",
      timestamp: "2024-01-20T10:10:00Z"
    }
  ],
  2: [
    {
      id: 1,
      sender: "patient",
      message: "Hi Dr. Martinez, my blood sugar readings have been good lately",
      timestamp: "2024-01-20T09:00:00Z"
    },
    {
      id: 2,
      sender: "doctor",
      message: "That's excellent news, Sarah! Keep up the good work with your diet and exercise",
      timestamp: "2024-01-20T09:05:00Z"
    }
  ]
};

export const dummyGlobalContext = [
  {
    id: 1,
    name: "General Medical Guidelines 2024",
    type: "PDF",
    size: "2.5 MB",
    uploadDate: "2024-01-01",
    description: "Updated medical guidelines for common conditions"
  },
  {
    id: 2,
    name: "Patient Care Protocols",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-01-05",
    description: "Standard protocols for patient care and treatment"
  },
  {
    id: 3,
    name: "Medication Database",
    type: "CSV",
    size: "500 KB",
    uploadDate: "2024-01-10",
    description: "Comprehensive medication information and interactions"
  }
];

export const dummyPatientContext = {
  1: [
    {
      id: 1,
      name: "John Smith - Medical History",
      type: "PDF",
      size: "1.2 MB",
      uploadDate: "2024-01-15",
      description: "Complete medical history and previous treatments"
    }
  ],
  2: [
    {
      id: 1,
      name: "Sarah Johnson - Diabetes Management",
      type: "PDF",
      size: "800 KB",
      uploadDate: "2024-01-10",
      description: "Diabetes care plan and monitoring guidelines"
    }
  ]
}; 