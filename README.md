# CareConnect Frontend

CareConnect is a modern healthcare platform frontend built with React, Vite, and Tailwind CSS. It provides dedicated portals for both doctors and patients, facilitating appointment scheduling, health record management, and secure communication.

## 🌟 Key Features

### 👨‍⚕️ Doctor Portal (`/doctor/*`)
- **Interactive Dashboard**: Quick metrics on today's appointments and pending tasks.
- **Appointment Management**: View, track, and manage all upcoming and past patient visits.
- **Patient Records & History**: Detailed view of patient interactions and history.
- **Care Protocols**: Manage and standardized medical care protocols.
- **Professional Profile**: Update specialization, credentials, and contact details.

### 🧑‍🤝‍🧑 Patient Portal (`/patient/*`)
- **Health Dashboard**: Overview of upcoming appointments and recent health updates.
- **Appointment Booking**: Browse available doctor slots and schedule visits.
- **Personal Profile**: Manage personal information and basic health records.

### 🔐 Authentication & Security
- **Role-Based Access Control**: Distinct routing and UI features depending on the logged-in role (Doctor vs. Patient).
- **Secure Registration**: Specific signup flows for different user types.

### 📱 General UI/UX
- **Responsive Design**: Mobile-first approach ensuring usability across mobile devices, tablets, and desktop.
- **Accessible Components**: Built with Radix UI to ensure semantic HTML and screen-reader support.
- **Modern aesthetics**: Clean and professional interface using shadcn/ui and Tailwind CSS.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **UI Architecture**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI primitives](https://www.radix-ui.com/)
- **Data Fetching**: [React Query (v5)](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
careConnect-frontend/
├── public/                  # Public assets (Favicon, etc.)
├── src/
│   ├── api/                 # Axios clients and API route definitions
│   ├── components/
│   │   ├── appointments/    # Appointment scheduling/viewing UI
│   │   ├── chat/            # Messaging interface components
│   │   ├── layout/          # Application layouts (AppShell, AuthLayout)
│   │   ├── protocols/       # Doctor protocol management UI
│   │   └── ui/              # shadcn/ui reusable foundation components
│   ├── context/             # Global React Context providers (Auth, Theme)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (tailwind-merge, constants, helpers)
│   ├── pages/
│   │   ├── auth/            # Login, Signup
│   │   ├── doctor/          # Doctor-specific pages
│   │   ├── patient/         # Patient-specific pages
│   │   └── shared/          # Homepage, Not Found, Shared Profile
│   ├── routes/              # Routing logic (AppRouter, ProtectedRoute)
│   ├── App.jsx              # Main React Component
│   ├── index.css            # Tailwind directives and global styles
│   └── main.jsx             # Entry script
├── docker-compose.yml       # Docker Compose dev/prod configuration
├── Dockerfile               # Docker production build instructions
├── package.json             # Project dependencies and script runner
├── tailwind.config.js       # Tailwind theme configuration
└── vite.config.js           # Vite build and dev-server configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or newer
- **Package Manager**: npm, yarn, or bun (npm is used by default)

### Local Setup

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
   Create a `.env` file based on the example to point to your backend API.
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

---

## 🐳 Docker Setup

You can fully run the frontend inside a Docker container using Docker Compose:

1. **Start the containers in detached mode**
   ```bash
   docker-compose up -d
   ```
2. **Stop the containers**
   ```bash
   docker-compose down
   ```

---

## 📜 Available Scripts

- `npm run dev` - Starts the Vite development server with HMR.
- `npm run build` - Builds the application into the `dist` directory for production.
- `npm run preview` - Locally preview the production build.
- `npm run lint` - Lints the codebase using ESLint to catch errors and enforce code style.

---

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is proprietary and confidential. Standard MIT guidelines do not apply unless explicitly provided in a `LICENSE` file.
