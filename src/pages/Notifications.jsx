import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Grid,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { notificationService } from "../services/apiService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setError("");
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setSuccess("Notification marked as read");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(error.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      setError("");
      await notificationService.markAsUnread(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
      setSuccess("Notification marked as unread");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      setError(error.response?.data?.message || 'Failed to mark notification as unread');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      setError("");
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setSuccess("Notification deleted");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError(error.response?.data?.message || 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "emergency":
        return <WarningIcon sx={{ color: "error.main" }} />;
      case "update":
        return <InfoIcon sx={{ color: "info.main" }} />;
      case "reminder":
        return <ScheduleIcon sx={{ color: "warning.main" }} />;
      case "results":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      default:
        return <NotificationsIcon sx={{ color: "primary.main" }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "emergency":
        return "error";
      case "update":
        return "info";
      case "reminder":
        return "warning";
      case "results":
        return "success";
      default:
        return "default";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const emergencyCount = notifications.filter(
    (n) => n.type === "emergency" && !n.isRead
  ).length;

  const groupedNotifications = {
    emergency: notifications.filter((n) => n.type === "emergency"),
    updates: notifications.filter((n) => n.type === "update"),
    reminders: notifications.filter((n) => n.type === "reminder"),
    results: notifications.filter((n) => n.type === "results"),
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Notification Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                </Badge>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {unreadCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unread
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Badge badgeContent={emergencyCount} color="error">
                  <WarningIcon
                    sx={{ fontSize: 40, color: "error.main", mb: 1 }}
                  />
                </Badge>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "error.main" }}
                >
                  {emergencyCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emergency Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <InfoIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "info.main" }}
                >
                  {notifications.filter((n) => n.type === "update").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Patient Updates
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <ScheduleIcon
                  sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "warning.main" }}
                >
                  {notifications.filter((n) => n.type === "reminder").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reminders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notifications by Category */}
        <Grid container spacing={3}>
          {/* Emergency Alerts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WarningIcon sx={{ color: "error.main", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "error.main" }}>
                    Emergency Alerts
                  </Typography>
                </Box>

                {groupedNotifications.emergency.length > 0 ? (
                  <List>
                    {groupedNotifications.emergency.map((notification) => (
                      <React.Fragment key={notification.id}>
                        <ListItem>
                          <ListItemIcon>
                            {getNotificationIcon(notification.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: notification.isRead
                                      ? "normal"
                                      : "bold",
                                  }}
                                >
                                  {notification.title}
                                </Typography>
                                {!notification.isRead && (
                                  <Chip
                                    label="New"
                                    color="error"
                                    size="small"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {notification.message}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <Box>
                            {notification.isRead ? (
                              <Tooltip title="Mark as unread">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleMarkAsUnread(notification.id)
                                  }
                                >
                                  <MarkEmailUnreadIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Mark as read">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                >
                                  <MarkEmailReadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No emergency alerts
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Other Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Other Notifications
                </Typography>

                {Object.entries(groupedNotifications)
                  .filter(([key]) => key !== "emergency")
                  .map(([category, categoryNotifications]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 1, textTransform: "capitalize" }}
                      >
                        {category}
                      </Typography>

                      {categoryNotifications.length > 0 ? (
                        <List dense>
                          {categoryNotifications.map((notification) => (
                            <ListItem key={notification.id} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getNotificationIcon(notification.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: notification.isRead
                                          ? "normal"
                                          : "bold",
                                      }}
                                    >
                                      {notification.title}
                                    </Typography>
                                    {!notification.isRead && (
                                      <Chip
                                        label="New"
                                        color={getNotificationColor(
                                          notification.type
                                        )}
                                        size="small"
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {notification.message}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block" }}
                                    >
                                      {new Date(
                                        notification.timestamp
                                      ).toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box>
                                {notification.isRead ? (
                                  <Tooltip title="Mark as unread">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleMarkAsUnread(notification.id)
                                      }
                                    >
                                      <MarkEmailUnreadIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Mark as read">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleMarkAsRead(notification.id)
                                      }
                                    >
                                      <MarkEmailReadIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", py: 1 }}
                        >
                          No {category} notifications
                        </Typography>
                      )}
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                setError("");
                await notificationService.markAllAsRead();
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true }))
                );
                setSuccess("All notifications marked as read");
                setTimeout(() => setSuccess(""), 3000);
              } catch (error) {
                console.error('Error marking all as read:', error);
                setError(error.response?.data?.message || 'Failed to mark all as read');
              }
            }}
            sx={{ mr: 2 }}
          >
            Mark All as Read
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => {
              try {
                setError("");
                await notificationService.clearAll();
                setNotifications([]);
                setSuccess("All notifications cleared");
                setTimeout(() => setSuccess(""), 3000);
              } catch (error) {
                console.error('Error clearing all notifications:', error);
                setError(error.response?.data?.message || 'Failed to clear all notifications');
              }
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Notifications;
