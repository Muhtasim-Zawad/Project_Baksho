"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Search,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Eye,
  Ban,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Heart,
  Flag,
  Box,
} from "lucide-react";
import Link from "next/link";

// Mock user data
const users = [
  {
    id: 1,
    name: "Ahmed Rahman",
    email: "ahmed.rahman@email.com",
    phone: "+880 1712-345678",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-15",
    status: "active",
    role: "donor",
    location: "Dhaka, Bangladesh",
    totalDonated: 25000,
    campaignsSupported: 8,
    campaignsCreated: 0,
    lastActivity: "2024-01-20",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 2,
    name: "Fatima Khan",
    email: "fatima.khan@email.com",
    phone: "+880 1812-987654",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-10",
    status: "active",
    role: "organizer",
    location: "Chittagong, Bangladesh",
    totalDonated: 5000,
    campaignsSupported: 3,
    campaignsCreated: 2,
    lastActivity: "2024-01-19",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 3,
    name: "Mohammad Ali",
    email: "mohammad.ali@email.com",
    phone: "+880 1912-456789",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-08",
    status: "active",
    role: "both",
    location: "Sylhet, Bangladesh",
    totalDonated: 15000,
    campaignsSupported: 12,
    campaignsCreated: 1,
    lastActivity: "2024-01-18",
    verified: false,
    riskLevel: "low",
  },
  {
    id: 4,
    name: "Suspicious User",
    email: "fake.user@email.com",
    phone: "+880 1612-000000",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-16",
    status: "flagged",
    role: "organizer",
    location: "Unknown",
    totalDonated: 0,
    campaignsSupported: 0,
    campaignsCreated: 3,
    lastActivity: "2024-01-17",
    verified: false,
    riskLevel: "high",
    flags: [
      "Multiple failed campaigns",
      "Suspicious documentation",
      "User reports",
    ],
  },
  {
    id: 5,
    name: "Banned User",
    email: "banned@email.com",
    phone: "+880 1512-111111",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-05",
    status: "banned",
    role: "organizer",
    location: "Dhaka, Bangladesh",
    totalDonated: 0,
    campaignsSupported: 0,
    campaignsCreated: 1,
    lastActivity: "2024-01-12",
    verified: false,
    riskLevel: "high",
    banReason: "Fraudulent campaign activities",
  },
];

const userStats = {
  totalUsers: 5234,
  activeUsers: 4890,
  flaggedUsers: 23,
  bannedUsers: 12,
  newUsersThisMonth: 456,
  verifiedUsers: 3421,
};

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailDialog, setUserDetailDialog] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`);
    // Handle user actions (ban, unban, verify, etc.)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "flagged":
        return "bg-yellow-600";
      case "banned":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Box className="h-6 w-6 text-yellow-500" />
              <Link href="/admin" className="text-xl font-bold text-white-700">
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
          <p className="text-gray-600">Monitor and manage platform users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.totalUsers.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.activeUsers.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.flaggedUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.bannedUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.newUsersThisMonth}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.verifiedUsers.toLocaleString()}
              </div>
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
                  <SelectItem value="flagged">Flagged</SelectItem>
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
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={
                user.status === "flagged"
                  ? "border-yellow-200"
                  : user.status === "banned"
                    ? "border-red-200"
                    : ""
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <Badge variant="outline">{user.role}</Badge>
                        {user.verified && (
                          <Badge className="bg-blue-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Joined: {user.joinDate}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />৳
                            {user.totalDonated.toLocaleString()} donated
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {user.campaignsCreated} campaigns created
                          </div>
                          <div
                            className={`flex items-center font-medium ${getRiskColor(
                              user.riskLevel,
                            )}`}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {user.riskLevel} risk
                          </div>
                        </div>
                      </div>

                      {/* Flags for flagged users */}
                      {user.flags && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center text-yellow-800 font-medium mb-2">
                            <Flag className="h-4 w-4 mr-2" />
                            Flags:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {user.flags.map((flag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-yellow-700 border-yellow-300"
                              >
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ban reason for banned users */}
                      {user.banReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <div className="text-red-800 font-medium">
                            Ban Reason:
                          </div>
                          <div className="text-red-700 text-sm">
                            {user.banReason}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserDetailDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    {user.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user.id, "flag")}
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Flag User
                      </Button>
                    )}

                    {user.status === "flagged" && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUserAction(user.id, "ban")}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction(user.id, "clear")}
                        >
                          Clear Flags
                        </Button>
                      </>
                    )}

                    {user.status === "banned" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user.id, "unban")}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Unban User
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Detail Dialog */}
        <Dialog open={userDetailDialog} onOpenChange={setUserDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedUser.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {selectedUser.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                      <Badge variant="outline">{selectedUser.role}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Email:</strong> {selectedUser.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {selectedUser.phone}
                      </div>
                      <div>
                        <strong>Location:</strong> {selectedUser.location}
                      </div>
                      <div>
                        <strong>Joined:</strong> {selectedUser.joinDate}
                      </div>
                      <div>
                        <strong>Last Activity:</strong>{" "}
                        {selectedUser.lastActivity}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Platform Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Total Donated:</strong> ৳
                        {selectedUser.totalDonated.toLocaleString()}
                      </div>
                      <div>
                        <strong>Campaigns Supported:</strong>{" "}
                        {selectedUser.campaignsSupported}
                      </div>
                      <div>
                        <strong>Campaigns Created:</strong>{" "}
                        {selectedUser.campaignsCreated}
                      </div>
                      <div>
                        <strong>Verified:</strong>{" "}
                        {selectedUser.verified ? "Yes" : "No"}
                      </div>
                      <div>
                        <strong>Risk Level:</strong>{" "}
                        <span className={getRiskColor(selectedUser.riskLevel)}>
                          {selectedUser.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser.flags && (
                  <div>
                    <h4 className="font-semibold mb-3">Flags & Issues</h4>
                    <div className="space-y-2">
                      {selectedUser.flags.map((flag: string, index: number) => (
                        <div
                          key={index}
                          className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                        >
                          {flag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setUserDetailDialog(false)}
                  >
                    Close
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
