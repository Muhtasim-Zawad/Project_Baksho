"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Search,
  Users,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Box,
  KeyRound,
  Ban,
} from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    admins: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const router = useRouter();

  // Fetch all users from the backend
  const fetchUsers = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      // If fetching users fails (e.g., token expired), redirect to login
      router.push("/login");
    }
  };

  useEffect(() => {
    // 1. Check if the logged-in user is an admin
    const verifyAdminAndFetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const profileRes = await fetch(
          "http://localhost:8080/api/users/get-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!profileRes.ok) {
          router.push("/login"); // Token is likely invalid
          return;
        }

        const profile = await profileRes.json();
        if (profile.role !== "admin") {
          router.push("/"); // Not an admin, redirect to home
          return;
        }

        // If admin, fetch all users
        await fetchUsers();
      } catch (error) {
        console.error("Verification failed", error);
        router.push("/login");
      }
    };

    verifyAdminAndFetchData();
  }, [router]);

  // Calculate stats whenever the users list changes
  useEffect(() => {
    const total = users.length;
    const banned = users.filter((u) => u.isBanned).length;
    const active = total - banned;
    const admins = users.filter((u) => u.role === "admin").length;
    setUserStats({ total, active, banned, admins });
  }, [users]);

  // Handler for changing a user's role
  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:8080/api/users/set-role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      // Refresh user list to show the change
      await fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert(
        "Could not update user role. Please ensure the backend supports this admin action.",
      );
    }
  };

  // Handler for banning or unbanning a user
  const handleBanToggle = async (user: any) => {
    const token = localStorage.getItem("accessToken");
    // Determine the correct endpoint based on the user's current status
    const endpoint = user.isBanned ? "unban-user" : "ban-user";

    try {
      // NOTE: The backend only has a 'ban-user' endpoint. An 'unban-user' endpoint would be needed.
      const response = await fetch(
        `http://localhost:8080/api/users/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: user._id }),
        },
      );

      if (!response.ok)
        throw new Error(`Failed to ${user.isBanned ? "unban" : "ban"} user`);

      await fetchUsers();
    } catch (error) {
      console.error(`Error toggling ban status:`, error);
      alert(
        `Could not ${user.isBanned ? "unban" : "ban"} user. Please ensure the backend supports this admin action.`,
      );
    }
  };

  // Filter logic based on search and dropdowns
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const userStatus = user.isBanned ? "banned" : "active";
    const matchesStatus = statusFilter === "all" || userStatus === statusFilter;

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (isBanned: boolean) => {
    return isBanned ? (
      <Badge variant="destructive">Banned</Badge>
    ) : (
      <Badge className="bg-green-600">Active</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Box className="h-6 w-6 text-yellow-500" />
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Bakso Admin
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-green-600"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/campaigns"
                className="text-sm font-medium hover:text-green-600"
              >
                Campaigns
              </Link>
              <Link
                href="/admin/users"
                className="text-sm font-medium text-green-600"
              >
                Users
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm font-medium hover:text-green-600"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Monitor, manage roles, and moderate platform users.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.banned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.admins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-4 flex flex-col md:flex-row items-center justify-between"
              >
                <div className="flex items-center space-x-4 mb-4 md:mb-0 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-2" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:space-x-8">
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    {getStatusBadge(user.isBanned)}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">Joined</div>
                    <div className="text-sm font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="w-28">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user._id, newRole)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Button
                      variant={user.isBanned ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => handleBanToggle(user)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      {user.isBanned ? "Unban" : "Ban"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
