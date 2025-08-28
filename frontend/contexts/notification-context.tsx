// src/contexts/NotificationContext.tsx

"use client";

import { axiosPrivate } from "@/hooks/useAxiosPrivate";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Interface for raw data from the backend
interface BackendNotification {
  id: number;
  user_id: string;
  notification: string;
  url: string;
  seen: boolean;
  created_at: string; // ISO date string from backend
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

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => void;
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

  // Placeholder for getting the current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    // Replace with your actual authentication logic (e.g., from a context or token)
    try {
      const res = await axiosPrivate.get("/api/users/get-profile");
      return res.data?._id || null;
    } catch (error) {
      console.error("Failed to fetch user profile for notifications:", error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setNotifications([]); // Clear notifications if no user
        return;
      }

      const response = await axiosPrivate.get(`/notifications/${userId}`);

      // The raw data from the backend
      const backendNotifications: BackendNotification[] = response.data;

      // Transform backend data to frontend format, converting string to Date
      const transformedNotifications: Notification[] = backendNotifications.map(
        (notif) => ({
          ...notif,
          created_at: new Date(notif.created_at), // <-- KEY CHANGE HERE
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

  const markAsRead = async (id: number) => {
    try {
      // Optimistic update: update UI immediately
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, seen: true }
            : notification,
        ),
      );

      // Make the API call
      await axiosPrivate.put(`/notifications/${id}`, { seen: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read");
      // Revert the change on error if needed
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.seen).map((n) => n.id);

      if (unreadIds.length === 0) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, seen: true })),
      );

      // API call to mark all as read (assuming your backend supports this)
      await axiosPrivate.put(`/notifications/mark-all-as-read`, {
        ids: unreadIds,
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read");
      // Revert on error
      fetchNotifications();
    }
  };

  const clearAll = () => {
    // Here you might also want to make an API call to delete notifications
    setNotifications([]);
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
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
