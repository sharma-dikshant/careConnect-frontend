import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 256;

// Doctor menu items
const doctorMenuItems = [
  { 
    text: "Dashboard", 
    icon: <DashboardIcon />, 
    path: "/",
    description: "Overview and analytics"
  },
  { 
    text: "Patient Management", 
    icon: <PeopleIcon />, 
    path: "/patients",
    description: "Manage patient records"
  },
  { 
    text: "Medical Records", 
    icon: <FolderIcon />, 
    path: "/global-context",
    description: "Global medical context"
  },
  {
    text: "Notifications",
    icon: <NotificationsIcon />,
    path: "/notifications",
    description: "Alerts and updates"
  },
  { 
    text: "Profile", 
    icon: <PersonIcon />, 
    path: "/profile",
    description: "Account settings"
  },
];

// Patient menu items
const patientMenuItems = [
  { 
    text: "Dashboard", 
    icon: <DashboardIcon />, 
    path: "/",
    description: "My appointments"
  },
  {
    text: "Notifications",
    icon: <NotificationsIcon />,
    path: "/notifications",
    description: "Alerts and updates"
  },
  { 
    text: "Profile", 
    icon: <PersonIcon />, 
    path: "/profile",
    description: "Account settings"
  },
];

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        height: 64,
      }}>
        <Box sx={{ 
          width: 32, 
          height: 32, 
          borderRadius: 1, 
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)'
        }}>
          <MedicalIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.125rem' }}>
          CareConnect
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 1 }}>
          {(userRole === 'patient' ? patientMenuItems : doctorMenuItems).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  py: 1,
                  px: 1.5,
                  transition: 'all 0.2s ease-in-out',
                  "&.Mui-selected": {
                    backgroundColor: "primary.50",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.100",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                    "& .MuiListItemText-primary": {
                      color: "primary.main",
                      fontWeight: 600,
                    },
                    "& .MuiListItemText-secondary": {
                      color: "primary.main",
                      opacity: 0.8,
                    },
                  },
                  "&:hover": {
                    backgroundColor: "grey.50",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? "primary.main" : "text.secondary",
                    minWidth: 32,
                    "& svg": {
                      fontSize: 20,
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  // secondary={item.description} // Removing description for cleaner look
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* User Info */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.50', 
              color: 'primary.main',
              mr: 2, 
              width: 32, 
              height: 32,
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0) || 'D'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Dr. {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {user?.specialization || 'Medical Professional'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ px: 3, py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: "none" },
              color: 'text.primary'
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 3 }}>
            <TextField
              placeholder="Search patients, medical records..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "grey.50",
                borderRadius: 2,
                minWidth: { xs: 200, sm: 300, md: 400 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Welcome back, Dr. {user?.name || 'User'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => navigate("/notifications")}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account Settings">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: "primary.main",
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {user?.name?.charAt(0) || "D"}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleNavigation("/profile")}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
