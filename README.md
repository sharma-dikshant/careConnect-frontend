# CareConnect Frontend

A modern, comprehensive web application acting as the patient and doctor portal for CareConnect. Built with React and Vite, the platform enables secure role-based access, appointment scheduling, and patient-doctor collaboration.

## 🚀 Features

### Authentication & Authorization
- **Role-Based Access**: Specialized portals for Doctors and Patients (`/doctor/*` and `/patient/*`).
- **Secure Registration**: Distinct signup flows for doctors and patients.
- **Protected Routes**: Automatic redirection of unauthenticated users and role validation.

### Doctor Portal
- **Doctor Dashboard**: At-a-glance metrics and overview of today's schedule.
- **Appointments Management**: View, track, and manage all upcoming and past patient appointments.
- **Appointment Details**: In-depth view of individual patient visits.
- **Protocols & Care Plans**: Doctors can manage standardized care protocols.
- **Profile Management**: Manage professional credentials, specialization, and details.

### Patient Portal
- **Patient Dashboard**: Overview of health metrics, upcoming appointments, and notifications.
- **Appointments Management**: Browse available slots, schedule visits, and review past interactions.
- **Profile & Health Records**: Manage personal data, contact details, and basic medical information.

### Shared & General Features
- **Public Homepage**: Landing page with platform overview and navigation.
- **Appointment Details**: Shared view interface depending on user role.
- **Modern UI**: Clean, accessible, and responsive interface designed for both mobile and desktop.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 7
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v3
- **UI Components**: Radix UI + shadcn/ui
- **State/Data Management**: React Query (TanStack Query) + Axios
- **Code Quality**: ESLint

## 🎨 Design Features

- **Tailwind Ecosystem**: Streamlined styling using Tailwind utilities and `tailwind-merge` with `clsx` for conditional classes.
- **Accessible Components**: Radix primitives ensure screen-reader compatibility, keyboard navigation, and ARIA attributes out of the box.
- **Responsive Layout**: Designed with a mobile-first philosophy ensuring seamless usage across desktop and tablets.

## 📁 Project Structure

```
careConnect-frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                 # Axios configuration and API clients
│   ├── components/
│   │   ├── appointments/    # Appointment-specific UI
│   │   ├── chat/            # Chat and messaging components
│   │   ├── layout/          # AppShell, AuthLayout, etc.
│   │   ├── protocols/       # Protocols logic and UI
│   │   └── ui/              # Reusable UI components (shadcn ui)
│   ├── context/             # Global React Contexts (e.g., Auth)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and constants
│   ├── pages/
│   │   ├── auth/            # Login, Signup (Doctor/Patient)
│   │   ├── doctor/          # Doctor dashboard, appointments, protocols
│   │   ├── patient/         # Patient dashboard, appointments
│   │   └── shared/          # Homepage, generic profiles, error pages
│   ├── routes/              # Route definition (AppRouter, ProtectedRoute)
│   ├── App.jsx              # Main App wrapper
│   ├── index.css            # Global CSS (Tailwind imports)
│   └── main.jsx             # Entry point
├── docker-compose.yml       # Docker environment configuration
├── Dockerfile               # Production image configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite development settings
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or bun

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

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in the required API endpoints or configuration.
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Using Docker
You can also run the application using Docker Compose with the provided container configurations:
```bash
docker-compose up -d
```

## 🔧 Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Compile the application for production.
- `npm run preview` - Preview the built production application locally.
- `npm run lint` - Run ESLint over the codebase.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes and commit them
4. Push to your fork and submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
