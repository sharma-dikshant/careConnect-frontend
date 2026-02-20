import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import { LockOutlined, LocalHospital, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("doctor");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, userType);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "background.default",
        padding: 3,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 480,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          {/* Logo/Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <LockOutlined sx={{ color: "white", fontSize: 24 }} />
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ 
              mb: 1, 
              fontWeight: 700,
              color: "text.primary",
              textAlign: "center",
            }}
          >
            CareConnect
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Sign in to your account
          </Typography>

          {/* User Type Toggle */}
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={handleUserTypeChange}
            sx={{ mb: 3, width: "100%" }}
            fullWidth
          >
            <ToggleButton value="doctor">
              <LocalHospital sx={{ mr: 1, fontSize: 20 }} />
              Doctor
            </ToggleButton>
            <ToggleButton value="patient">
              <Person sx={{ mr: 1, fontSize: 20 }} />
              Patient
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 2,
                height: 48,
                fontSize: "0.9375rem",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link 
                  component={RouterLink} 
                  to="/signup"
                  sx={{ 
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
