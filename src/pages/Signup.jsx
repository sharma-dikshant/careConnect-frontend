import React, { useState } from "react";
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
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import { PersonAddOutlined, LocalHospital, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [userType, setUserType] = useState("doctor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      if (newUserType === "patient") {
        setFormData((prev) => ({
          ...prev,
          specialization: "",
          licenseNumber: "",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (userType === "doctor") {
      if (!formData.specialization.trim()) {
        newErrors.specialization = "Specialization is required for doctors";
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required for doctors";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (userType === "doctor") {
        userData.specialization = formData.specialization;
        userData.licenseNumber = formData.licenseNumber;
      }

      const result = await signup(userData, userType);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred during signup");
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
            maxWidth: 600,
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
            <PersonAddOutlined sx={{ color: "white", fontSize: 24 }} />
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
            Create your account
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

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              {userType === "doctor" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="specialization"
                      label="Specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      error={!!errors.specialization}
                      helperText={errors.specialization}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="licenseNumber"
                      label="License Number"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      error={!!errors.licenseNumber}
                      helperText={errors.licenseNumber}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
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
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                height: 48,
                fontSize: "0.9375rem",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Signup;
