// src/contexts/NotificationContext.tsx

"use client";

import { axiosPrivate } from "@/hooks/useAxiosPrivate";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Interface for raw data from the backend (matches NotificationRead schema)
interface BackendNotification {
  id: number;
  user_id: string;
  notification: string;
  url: string;
  seen: boolean;
  created_at: string; // ISO date-time string from backend
}

// Frontend notification interface with a proper Date object
export interface Notification {
  id: number;
  user_id: string;
  notification: string;
  url: string;
  seen: boolean;
  created_at: Date; // Use the Date object for easier handling
}

// Interface for creating notifications (matches NotificationCreate schema)
export interface NotificationCreateData {
  user_id: string;
  notification: string;
  url: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  createNotification: (data: NotificationCreateData) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Get the current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const res = await axiosPrivate.get("/api/users/get-profile");
      return res.data?._id || null;
    } catch (error) {
      console.error("Failed to fetch user profile for notifications:", error);
      return null;
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setNotifications([]); // Clear notifications if no user
        return;
      }

      // GET /notifications/{user_id}
      const response = await axiosPrivate.get(`/notifications/${userId}`);

      // The raw data from the backend
      const backendNotifications: BackendNotification[] = response.data;

      // Transform backend data to frontend format, converting string to Date
      const transformedNotifications: Notification[] = backendNotifications.map(
        (notif) => ({
          ...notif,
          created_at: new Date(notif.created_at),
        }),
      );

      // Sort by creation date (newest first)
      transformedNotifications.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime(),
      );

      setNotifications(transformedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  // Create a new notification
  const createNotification = async (data: NotificationCreateData) => {
    try {
      setError(null);

      // POST /notifications/
      const response = await axiosPrivate.post("/notifications/", data);

      // Transform the response to include Date object
      const newNotification: Notification = {
        ...response.data,
        created_at: new Date(response.data.created_at),
      };

      // Add the new notification to the beginning of the list
      setNotifications((prev) => [newNotification, ...prev]);
    } catch (err) {
      console.error("Error creating notification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create notification",
      );
      throw err; // Re-throw so caller can handle if needed
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id: number) => {
    console.log("Marking as read:", id);
    try {
      // Optimistic update: update UI immediately
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, seen: true }
            : notification,
        ),
      );

      // PUT /notifications/{notification_id}
      await axiosPrivate.put(`/notifications/${id}`, { seen: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read");
      // Revert the change on error
      fetchNotifications();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.seen);

      if (unreadNotifications.length === 0) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, seen: true })),
      );

      // Update each notification individually since the API doesn't have a bulk endpoint
      const updatePromises = unreadNotifications.map((notification) =>
        axiosPrivate.put(`/notifications/${notification.id}`, { seen: true }),
      );

      await Promise.all(updatePromises);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read");
      // Revert on error
      fetchNotifications();
    }
  };

  // Delete a single notification
  const deleteNotification = async (id: number) => {
    try {
      // Optimistic update: remove from UI immediately
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );

      // DELETE /notifications/{notification_id}
      await axiosPrivate.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
      // Revert the change on error
      fetchNotifications();
    }
  };

  // Clear all notifications (delete all for current user)
  const clearAll = async () => {
    try {
      const currentNotifications = [...notifications];

      // Optimistic update: clear UI immediately
      setNotifications([]);

      // Delete each notification individually
      const deletePromises = currentNotifications.map((notification) =>
        axiosPrivate.delete(`/notifications/${notification.id}`),
      );

      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Error clearing all notifications:", err);
      setError("Failed to clear all notifications");
      // Revert on error
      fetchNotifications();
    }
  };

  // Fetch notifications on component mount and set up polling
  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.seen).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        createNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        clearError,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
