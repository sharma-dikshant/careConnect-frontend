# CareConnect Frontend

A modern, comprehensive React frontend for CareConnect - a complete Medical CRM system. Built with Material UI and Vite, this application supports dynamic role-based access for both **Doctors** and **Patients**, fully integrated with a real backend API.

## 🚀 Key Features

### Role-Based Access
- **Doctor Dashboard**: Manage patients, handle global/local medical contexts, view notifications, and communicate via chat.
- **Patient Dashboard**: View appointments, medical details, updates, and engage in real-time chats with doctors.

### Authentication & Profiles
- **Secure Access**: Genuine JWT-based authentication integrated directly with the backend.
- **Profile Management**: Manage professional information, avatars, and contact details with real-time API syncing.

### Patient & Appointment Management
- **Patient Roster**: Doctors can view all patients with search and filtering capabilities.
- **CRUD Operations**: Complete management lifecycle for patient records.
- **Medical Records**: Track diagnosis, status, visit history, and individual patient files.
- **Appointments**: Patients and doctors can view robust appointment data (e.g., `/appointment/:appointmentId`).

### Context Management (Files & Documents)
- **Global Context**: Upload and manage files (e.g., medical guidelines, PDFs, CSVs) shared across all patients.
- **Local Context**: Manage individual patient-specific files tied to appointments.
- **File Operations**: Comprehensive support for upload, download, edit, and deletion.

### Chat & Notifications
- **Real-time Chat**: Patient-doctor conversation threading tied to appointments.
- **Alert System**: Real-time notifications for emergencies, patient updates, and system alerts.
- **Notification Management**: Mark as read/unread, clear all, and categorized viewing.

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with Vite
- **UI Library**: Material UI (MUI) v7
- **Routing**: React Router v7
- **HTTP Client**: Axios (with custom interceptors for token management)
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Data Grid**: MUI X Data Grid

## 📁 Project Structure

```
careConnect-frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # App images and SVGs
│   ├── components/          # Reusable UI components (ErrorBoundary, Hardware, etc.)
│   ├── contexts/            # Context API files (AuthContext.jsx)
│   ├── pages/               # Route components (Dashboard, PatientDetails, Login, etc.)
│   ├── services/            # API integration (apiClient, apiService, endpoints)
│   ├── App.jsx              # Main routing and theme configuration
│   ├── index.css            # Global CSS styling
│   └── main.jsx             # Application entry point
├── .env.example             # Example environment variables
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── API_INTEGRATION_GUIDE.md # Detailed backend API docs
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careConnect-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and define the backend API base URL:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:4000/api
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📱 Available Routes

- `/` - Role-based Main Dashboard (redirects based on Doctor/Patient role)
- `/login` - Authentication Page
- `/signup` - Registration Page
- `/patients` - Patient Management (Doctor only)
- `/patient/:id` - Detailed Patient View (Doctor only)
- `/global-context` - Global File Management (Doctor only)
- `/appointment/:appointmentId` - Appointment View (Patient only)
- `/notifications` - Notification Center
- `/profile` - User Profile
- `/hardware` - Hardware integration testing

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## 🌟 API Integration
This frontend is entirely decoupled from dummy data. It uses a robust, modular service structure (`src/services/`) for complete backend interaction, implementing auto-token refresh mechanisms, comprehensive error handlers, and loading states for an optimal user experience. For specific endpoints and payload shapes, see the included `API_INTEGRATION_GUIDE.md`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
