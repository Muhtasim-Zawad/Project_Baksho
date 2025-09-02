"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Target,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// NOTE: The mock data has been removed as it will be fetched from the API.

export default function AdminCampaignsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [reviewNotes, setReviewNotes] = useState("");

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [rejectedCampaigns, setRejectedCampaigns] = useState([]);
  const router = useRouter();

  const handleReview = (campaign: any, action: "approve" | "reject") => {
    setSelectedCampaign(campaign);
    setReviewAction(action);
    setReviewNotes(campaign.note || ""); // Pre-fill notes if they exist
    setReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedCampaign || !reviewAction) return;

    // For rejection, notes are required.
    if (reviewAction === "reject" && !reviewNotes.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const payload = {
      approved: reviewAction === "approve",
      reviewed: true,
      note: reviewNotes,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/campaigns/${selectedCampaign.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update campaign status");
      }

      // Refresh the campaign list to show the change
      fetchCampaigns();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review.");
    } finally {
      // Close and reset the dialog
      setReviewDialog(false);
      setReviewNotes("");
      setSelectedCampaign(null);
      setReviewAction(null);
    }
  };

  const fetchCampaigns = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found, redirecting to login.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/campaigns/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
        }
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();
      console.log(data[0]);
      setAllCampaigns(data);

      // Filter campaigns into different states based on their properties
      const pending = data.filter(
        (c: any) => c.reviewed === false && c.approved === false,
      );
      const approved = data.filter((c: any) => c.approved === true);
      const rejected = data.filter(
        (c: any) => c.reviewed === true && c.approved === false,
      );

      console.log(pending);
      console.log(approved);
      console.log(rejected);

      setPendingCampaigns(pending);
      setApprovedCampaigns(approved);
      setRejectedCampaigns(rejected);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    // 1. Check if the logged-in user is an admin
    const verifyAdminStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/users/get-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          // If token is invalid or expired, server will return an error
          router.push("/login");
          return;
        }

        const userProfile = await response.json();

        // Check if the user's role is 'admin'
        if (userProfile.role !== "admin") {
          // If not an admin, redirect to the homepage
          router.push("/");
        } else {
          // If the user is an admin, fetch the campaign data
          fetchCampaigns();
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        // Redirect to login on any error during verification
        router.push("/login");
      }
    };

    verifyAdminStatus();
  }, [router]); // Added router to the dependency array

  // This derived state will now correctly filter the campaigns from the state
  const filteredCampaigns = pendingCampaigns.filter(
    (campaign: any) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-yellow-400" />
              <Link href="/admin" className="text-xl font-bold text-black">
                Project Bakso Admin
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
                className="text-sm font-medium text-green-600"
              >
                Campaigns
              </Link>
              <Link
                href="/admin/users"
                className="text-sm font-medium hover:text-green-600"
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
            Campaign Management
          </h1>
          <p className="text-gray-600">
            Review, approve, and manage campaigns on the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingCampaigns.length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Campaigns
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedCampaigns.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently fundraising
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rejectedCampaigns.length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allCampaigns.length > 0
                  ? `${Math.round(
                      (approvedCampaigns.length / allCampaigns.length) * 100,
                    )}%`
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Approval rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <Button
                variant={selectedTab === "pending" ? "default" : "outline"}
                onClick={() => setSelectedTab("pending")}
              >
                Pending ({pendingCampaigns.length})
              </Button>
              <Button
                variant={selectedTab === "approved" ? "default" : "outline"}
                onClick={() => setSelectedTab("approved")}
              >
                Approved ({approvedCampaigns.length})
              </Button>
              <Button
                variant={selectedTab === "rejected" ? "default" : "outline"}
                onClick={() => setSelectedTab("rejected")}
              >
                Rejected ({rejectedCampaigns.length})
              </Button>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        {selectedTab === "pending" && (
          <div className="space-y-6">
            {filteredCampaigns.map((campaign: any) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3 gap-6 p-6">
                    {/* Campaign Image */}
                    <div className="lg:col-span-1">
                      <Image
                        src={
                          campaign.image_urls.split(",")[0] ||
                          "/placeholder.svg"
                        }
                        alt={campaign.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">{campaign.category}</Badge>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="lg:col-span-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {campaign.description}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {campaign.organizer_name}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {campaign.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Target className="h-4 w-4 mr-2" />
                          Goal: ৳{campaign.goal.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {campaign.duration} days duration
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="space-y-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{campaign.title}</DialogTitle>
                              <DialogDescription>
                                Complete campaign review
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Story / Full Description
                                </h4>
                                <p className="text-sm text-gray-700">
                                  {campaign.story}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">
                                  Risks & Challenges
                                </h4>
                                <p className="text-sm text-gray-700">
                                  {campaign.risks}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">
                                  Donation Tiers
                                </h4>
                                <div className="space-y-2">
                                  {campaign.incentive_tiers.map(
                                    (tier: any, index: number) => (
                                      <div
                                        key={index}
                                        className="border rounded p-3"
                                      >
                                        <div className="font-medium">
                                          ৳{tier.amount.toLocaleString()} -{" "}
                                          {tier.title}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {tier.description}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleReview(campaign, "approve")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Campaign
                        </Button>

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleReview(campaign, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Campaign
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 pt-4 border-t">
                        Submitted:{" "}
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "approved" && (
          <div className="space-y-4">
            {approvedCampaigns.map((campaign: any) => (
              <Card key={campaign.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {campaign.title}
                        </h3>
                        <Badge className="bg-green-600">Active</Badge>
                        <Badge variant="outline">{campaign.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        By: {campaign.organizer_name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>Goal: ৳{campaign.goal.toLocaleString()}</span>
                        <span>Raised: ৳{campaign.raised.toLocaleString()}</span>
                        <span>{campaign.backers} donors</span>
                      </div>
                      <Progress
                        value={(campaign.raised / campaign.goal) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "rejected" && (
          <div className="space-y-4">
            {rejectedCampaigns.map((campaign: any) => (
              <Card key={campaign.id} className="border-red-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {campaign.title}
                        </h3>
                        <Badge variant="destructive">Rejected</Badge>
                        <Badge variant="outline">{campaign.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        By: {campaign.organizer_name}
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="text-sm font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </div>
                        <div className="text-sm text-red-700">
                          {campaign.note || "No reason provided."}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(campaign, "reject")}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review/Edit Reason
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === "approve"
                  ? "Approve Campaign"
                  : "Reject Campaign"}
              </DialogTitle>
              <DialogDescription>
                {reviewAction === "approve"
                  ? "This campaign will go live and start accepting donations."
                  : "Please provide a reason for rejection. The organizer will be notified."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Campaign: {selectedCampaign?.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Organizer: {selectedCampaign?.organizer_name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {reviewAction === "approve"
                    ? "Approval Notes (Optional)"
                    : "Rejection Reason (Required)"}
                </label>
                <Textarea
                  placeholder={
                    reviewAction === "approve"
                      ? "Add any notes for the organizer..."
                      : "Explain why this campaign is being rejected..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  required={reviewAction === "reject"}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  className={
                    reviewAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                  variant={
                    reviewAction === "reject" ? "destructive" : "default"
                  }
                  disabled={reviewAction === "reject" && !reviewNotes.trim()}
                >
                  {reviewAction === "approve"
                    ? "Approve Campaign"
                    : "Reject Campaign"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
