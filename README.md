# CareConnect Doctor Dashboard

A comprehensive React frontend for the CareConnect Doctor Dashboard built with Material UI and Vite. This dashboard allows doctors to manage patients, view chats, upload context files, and handle account/profile features.

## 🚀 Features

### Authentication
- **Login/Logout**: Secure authentication with dummy JWT token simulation
- **Signup**: User registration with form validation
- **Protected Routes**: Automatic redirection for unauthenticated users

### Dashboard Layout
- **Responsive Sidebar**: Navigation drawer with Material UI components
- **Topbar**: Search functionality, notifications, and user profile menu
- **Mobile-Friendly**: Responsive design for desktop and tablet devices

### Patient Management
- **Patient List**: View all patients with search and filtering
- **Add/Edit Patients**: CRUD operations for patient information
- **Patient Details**: Comprehensive patient view with tabs
- **Medical Records**: Track diagnosis, status, and visit history

### Chat & Communication
- **Chat History**: View patient-doctor conversations
- **Message Threads**: Organized chat interface with timestamps
- **Real-time Updates**: Simulated chat functionality

### Context Management
- **Global Context**: Upload and manage files shared across all patients
- **Patient-Specific Files**: Individual patient context and medical records
- **File Support**: PDF and CSV file uploads
- **File Operations**: Upload, download, edit, and delete functionality

### Notifications
- **Alert System**: Emergency alerts, patient updates, and reminders
- **Read/Unread Status**: Mark notifications as read or unread
- **Category Organization**: Grouped by notification type
- **Bulk Actions**: Mark all as read or clear all notifications

### Profile Management
- **Doctor Profile**: Comprehensive professional information
- **Edit Profile**: Inline editing with form validation
- **Professional Stats**: Experience, specialization, and credentials
- **Contact Information**: Email, phone, and license details

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Vite
- **UI Library**: Material UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Data Grid**: MUI X Data Grid

## 🎨 Design Features

- **Medical Theme**: Professional medical color palette (blues, greens, whites)
- **Responsive Layout**: Mobile-first design approach
- **Material Design**: Google Material Design principles
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark/Light Mode Ready**: Theme system prepared for future enhancements

## 📁 Project Structure

```
careConnect/
├── src/
│   ├── components/
│   │   └── DashboardLayout.jsx      # Main layout with sidebar and topbar
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── data/
│   │   └── dummyData.js             # Mock data for development
│   ├── pages/
│   │   ├── Dashboard.jsx            # Main dashboard page
│   │   ├── Login.jsx                # Authentication page
│   │   ├── Signup.jsx               # Registration page
│   │   ├── PatientDetails.jsx       # Individual patient view
│   │   ├── GlobalContext.jsx        # Global file management
│   │   ├── Notifications.jsx        # Notification center
│   │   └── Profile.jsx              # User profile management
│   ├── App.jsx                      # Main app component with routing
│   └── main.jsx                     # Application entry point
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Email**: `doctor@careconnect.com`
- **Password**: `password123`

## 📱 Available Routes

- `/` - Main Dashboard
- `/login` - Authentication
- `/signup` - User Registration
- `/patient/:id` - Patient Details
- `/global-context` - Global File Management
- `/notifications` - Notification Center
- `/profile` - User Profile

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Create new components** in the `src/components/` directory
2. **Add new pages** in the `src/pages/` directory
3. **Update routing** in `src/App.jsx`
4. **Add mock data** in `src/data/dummyData.js`

### Styling Guidelines

- Use Material UI components for consistency
- Follow the established color palette
- Implement responsive design patterns
- Use the theme system for customization

## 🌟 Key Features Implementation

### Authentication Flow
- Context-based state management
- LocalStorage for token persistence
- Protected route components
- Automatic redirects

### Data Management
- Dummy data simulation
- Local state management
- CRUD operations
- File upload handling

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive navigation

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket integration
- **File Storage**: Backend API integration
- **User Management**: Role-based access control
- **Analytics Dashboard**: Patient statistics and reports
- **Mobile App**: React Native version
- **Dark Mode**: Theme switching capability
- **Internationalization**: Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the medical community**
