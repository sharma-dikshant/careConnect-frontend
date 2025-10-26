# API Integration Guide

This document outlines the complete API integration that has been implemented in the CareConnect frontend application.

## Overview

All dummy data has been replaced with real API calls throughout the application. The integration includes:

- Authentication services
- Patient management
- Context file management
- Chat functionality
- Notifications
- Profile management

## API Structure

### Services Created

1. **apiClient.js** - Axios configuration with interceptors
2. **endpoints.js** - Centralized endpoint definitions
3. **apiService.js** - Service functions for all API operations

### Key Features

- **Automatic token management** - Tokens are automatically included in requests
- **Error handling** - Comprehensive error handling with user-friendly messages
- **Loading states** - All components show loading indicators during API calls
- **Real-time updates** - Data is refreshed after successful operations

## Components Updated

### Authentication
- **AuthContext.jsx** - Real login/signup/logout with API calls
- **Login.jsx** - Integrated with AuthContext
- **Signup.jsx** - Real signup API integration

### Dashboard
- **Dashboard.jsx** - Real patient data, notifications, and context files
- **PatientDetails.jsx** - Real patient data, chat history, and context management
- **GlobalContext.jsx** - Real context file management
- **Notifications.jsx** - Real notification management
- **Profile.jsx** - Real profile data management

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh token

### Patients
- `GET /patients/all/{doctor_id}` - Get all patients for a doctor
- `GET /patients/{patient_id}` - Get specific patient
- `POST /patients` - Add new patient
- `PUT /patients/{patient_id}` - Update patient
- `DELETE /patients/{patient_id}` - Delete patient
- `PATCH /patients/inactive/{patient_id}` - Deactivate patient
- `GET /patients/search` - Search patients

### Context Management
- `GET /contexts/globals` - Get global context files
- `GET /contexts/locals/{appointment_id}` - Get local context files
- `POST /contexts/globals` - Add global context
- `POST /contexts/locals/{appointment_id}` - Add local context
- `PUT /contexts/globals/{context_id}` - Update global context
- `PUT /contexts/locals/{context_id}` - Update local context
- `DELETE /contexts/globals/{context_id}` - Delete global context
- `DELETE /contexts/locals/{context_id}` - Delete local context
- `POST /contexts/upload` - Upload file

### Chat
- `GET /chats/{appointment_id}/history` - Get chat history
- `POST /chats/{appointment_id}/message` - Send message
- `GET /chats/{appointment_id}` - Get chats
- `POST /chats/{appointment_id}` - Create chat

### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications/{notification_id}/read` - Mark as read
- `PATCH /notifications/{notification_id}/unread` - Mark as unread
- `DELETE /notifications/{notification_id}` - Delete notification
- `PATCH /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/clear-all` - Clear all notifications

### Profile
- `GET /profile` - Get profile
- `PUT /profile` - Update profile
- `POST /profile/avatar` - Upload avatar

### Appointments
- `GET /appointments` - Get appointments
- `GET /appointments/{appointment_id}` - Get specific appointment
- `POST /appointments` - Create appointment
- `PUT /appointments/{appointment_id}` - Update appointment
- `DELETE /appointments/{appointment_id}` - Delete appointment

## Environment Configuration

Create a `.env` file in the root directory with:

```
VITE_API_BASE_URL=http://127.0.0.1:4000/api
```

## Error Handling

All API calls include comprehensive error handling:

- Network errors are caught and displayed to users
- 401 errors automatically redirect to login
- Form validation errors are shown inline
- Success messages are displayed after operations

## Loading States

All components show loading indicators during API operations:

- Dashboard loading while fetching data
- Patient details loading
- Context file operations
- Profile loading

## Data Flow

1. **Initial Load** - Components fetch data on mount
2. **User Actions** - API calls are made on user interactions
3. **Real-time Updates** - Data is refreshed after successful operations
4. **Error Recovery** - Failed operations show error messages

## Testing

To test the integration:

1. Ensure the backend API is running on the configured URL
2. Start the frontend application
3. Test all CRUD operations
4. Verify error handling
5. Check loading states

## Notes

- All dummy data imports have been removed
- Components now use real API services
- Error boundaries could be added for better error handling
- Consider adding retry logic for failed requests
- Implement optimistic updates for better UX
