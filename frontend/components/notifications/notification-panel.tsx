"use client";

import {
  useNotifications,
  Notification, // Import the Notification type for type safety
} from "@/contexts/notification-context"; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, CheckCheck, ExternalLink, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface NotificationPanelProps {
  onClose: () => void;
}

// Helper function to safely format the date and prevent crashes
const timeAgo = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "just now"; // Fallback for invalid dates
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

// Helper function to infer notification type from its text content
const getNotificationIcon = (notificationText: string) => {
  const lowerText = notificationText.toLowerCase();
  if (
    lowerText.includes("success") ||
    lowerText.includes("approved") ||
    lowerText.includes("completed")
  ) {
    return "✅";
  } else if (lowerText.includes("warning") || lowerText.includes("pending")) {
    return "⚠️";
  } else if (
    lowerText.includes("error") ||
    lowerText.includes("failed") ||
    lowerText.includes("rejected")
  ) {
    return "❌";
  }
  return "ℹ️"; // Default info icon
};

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  const router = useRouter();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read (seen) if not already
    if (!notification.seen) {
      await markAsRead(notification.id);
    }

    // Navigate to the URL if it exists
    if (notification.url) {
      if (
        notification.url.startsWith("http://") ||
        notification.url.startsWith("https://")
      ) {
        window.open(notification.url, "_blank");
      } else {
        router.push(notification.url);
        onClose();
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRefresh = async () => {
    await fetchNotifications();
  };

  return (
    <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh notifications"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border-b">
              <p>{error}</p>
              <Button
                variant="link"
                size="sm"
                onClick={handleRefresh}
                className="mt-1 h-6 px-1"
              >
                Retry
              </Button>
            </div>
          )}

          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <RefreshCw className="h-8 w-8 mb-2 animate-spin" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p className="text-sm">You have no new notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.seen
                      ? "bg-muted/30 border-l-2 border-l-primary"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">
                      {getNotificationIcon(notification.notification)}
                    </span>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm text-foreground line-clamp-3 ${
                            !notification.seen ? "font-semibold" : ""
                          }`}
                        >
                          {notification.notification}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {notification.url && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                          {!notification.seen && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
