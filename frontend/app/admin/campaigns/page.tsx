"use client";

import { useState } from "react";
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

// {
// 		id: "1",
// 		title: "Help Build a School in Rural Kenya",
// 		description:
// 			"Providing quality education to 500+ children in underserved communities. This project will construct a modern school facility with proper classrooms, library, and computer lab.",
// 		image: "/placeholder.svg?height=200&width=400",
// 		category: "Education",
// 		goal: 50000,
// 		raised: 32500,
// 		backers: 234,
// 		daysLeft: 15,
// 		location: "Kenya",
// 		organizer: "Education for All Foundation",
// 		featured: true,
// 		urgent: false,
// 	},

// Mock campaign data for admin review
const pendingCampaigns = [
  {
    id: 1,
    title: "Emergency Medical Treatment for Child",
    organizer: {
      name: "Dr. Rahman Medical Center",
      email: "dr.rahman@medical.com",
      verified: true,
      previousCampaigns: 3,
    },
    category: "Healthcare",
    location: "Dhaka, Bangladesh",
    goalAmount: 500000,
    description:
      "Urgent medical treatment needed for a 5-year-old child with heart condition.",
    fullDescription:
      "This campaign is to raise funds for emergency heart surgery for little Aisha, a 5-year-old girl from a low-income family in Dhaka. The surgery costs ৳500,000 and the family cannot afford it. All medical documents are verified.",
    submittedDate: "2024-01-15",
    duration: 30,
    status: "pending",
    riskLevel: "low",
    documents: [
      "medical_report.pdf",
      "doctor_certificate.pdf",
      "family_income_proof.pdf",
    ],
    images: ["/placeholder.svg?height=200&width=300"],
    tags: ["Emergency", "Children", "Healthcare"],
    donationTiers: [
      {
        amount: 1000,
        title: "Basic Support",
        description: "Help with medical expenses",
      },
      {
        amount: 5000,
        title: "Treatment Support",
        description: "Significant contribution to surgery",
      },
      {
        amount: 10000,
        title: "Major Donor",
        description: "Major contribution with updates",
      },
    ],
  },
  {
    id: 2,
    title: "Tech Startup for Rural Education",
    organizer: {
      name: "InnovateX Solutions",
      email: "founder@innovatex.com",
      verified: false,
      previousCampaigns: 0,
    },
    category: "Business",
    location: "Chittagong, Bangladesh",
    goalAmount: 2000000,
    description:
      "Revolutionary EdTech platform to bring quality education to rural Bangladesh.",
    fullDescription:
      "We're building an AI-powered educational platform specifically designed for rural Bangladeshi students. Our solution includes offline capabilities, local language support, and affordable hardware. We need funding for development, testing, and initial deployment.",
    submittedDate: "2024-01-14",
    duration: 60,
    status: "pending",
    riskLevel: "medium",
    documents: [
      "business_plan.pdf",
      "prototype_demo.pdf",
      "team_credentials.pdf",
    ],
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    tags: ["Technology", "Education", "Innovation"],
    donationTiers: [
      {
        amount: 5000,
        title: "Early Supporter",
        description: "Get updates and beta access",
      },
      {
        amount: 25000,
        title: "Beta Tester",
        description: "Early access and feedback sessions",
      },
      {
        amount: 100000,
        title: "Partner",
        description: "Partnership benefits and profit sharing",
      },
    ],
  },
  {
    id: 3,
    title: "Flood Relief for Sylhet Families",
    organizer: {
      name: "Bangladesh Relief Foundation",
      email: "relief@brf.org",
      verified: true,
      previousCampaigns: 12,
    },
    category: "Disaster Relief",
    location: "Sylhet, Bangladesh",
    goalAmount: 800000,
    description:
      "Emergency relief for 200 families affected by recent flooding in Sylhet region.",
    fullDescription:
      "Recent floods in Sylhet have displaced over 200 families. We need immediate funding for emergency supplies, temporary shelter, clean water, and medical aid. Our team is already on ground providing initial relief.",
    submittedDate: "2024-01-13",
    duration: 45,
    status: "pending",
    riskLevel: "low",
    documents: [
      "damage_assessment.pdf",
      "beneficiary_list.pdf",
      "relief_plan.pdf",
    ],
    images: ["/placeholder.svg?height=200&width=300"],
    tags: ["Emergency", "Disaster Relief", "Families"],
    donationTiers: [
      {
        amount: 2000,
        title: "Family Kit",
        description: "Emergency supplies for one family",
      },
      {
        amount: 10000,
        title: "Shelter Support",
        description: "Temporary shelter materials",
      },
      {
        amount: 50000,
        title: "Community Support",
        description: "Support for entire affected area",
      },
    ],
  },
];

const approvedCampaigns = [
  {
    id: 4,
    title: "Rural School Computer Lab",
    organizer: "Education Foundation BD",
    category: "Education",
    goalAmount: 300000,
    raised: 120000,
    donors: 89,
    approvedDate: "2024-01-10",
    status: "active",
  },
  {
    id: 5,
    title: "Clean Water Initiative",
    organizer: "Water for All BD",
    category: "Healthcare",
    goalAmount: 500000,
    raised: 200000,
    donors: 156,
    approvedDate: "2024-01-08",
    status: "active",
  },
];

const rejectedCampaigns = [
  {
    id: 6,
    title: "Suspicious Investment Scheme",
    organizer: "Unknown Entity",
    category: "Business",
    goalAmount: 5000000,
    rejectedDate: "2024-01-12",
    reason: "Insufficient documentation and suspicious business model",
    status: "rejected",
  },
];

export default function AdminCampaignsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = (campaign: any, action: "approve" | "reject") => {
    setSelectedCampaign(campaign);
    setReviewAction(action);
    setReviewDialog(true);
  };

  const submitReview = () => {
    console.log(
      `${reviewAction} campaign ${selectedCampaign?.id}:`,
      reviewNotes,
    );
    setReviewDialog(false);
    setReviewNotes("");
    setSelectedCampaign(null);
    setReviewAction(null);
  };

  const filteredCampaigns = pendingCampaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <Link href="/admin" className="text-xl font-bold text-green-700">
                FundBD Admin
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
              <div className="text-2xl font-bold">85%</div>
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
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3 gap-6 p-6">
                    {/* Campaign Image */}
                    <div className="lg:col-span-1">
                      <Image
                        src={campaign.images[0] || "/placeholder.svg"}
                        alt={campaign.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">{campaign.category}</Badge>
                        <Badge
                          variant={
                            campaign.riskLevel === "low"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {campaign.riskLevel} risk
                        </Badge>
                        {campaign.organizer.verified && (
                          <Badge className="bg-green-600">
                            Verified Organizer
                          </Badge>
                        )}
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
                          {campaign.organizer.name}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {campaign.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Target className="h-4 w-4 mr-2" />
                          Goal: ৳{campaign.goalAmount.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {campaign.duration} days duration
                        </div>
                      </div>

                      {/*<div className="space-y-2">
												<div className="text-sm font-medium">
													Organizer History:
												</div>
												<div className="text-sm text-gray-600">
													{campaign.organizer.previousCampaigns} previous
													campaigns
												</div>
											</div>*/}
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
                                  Full Description
                                </h4>
                                <p className="text-sm text-gray-700">
                                  {campaign.fullDescription}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">
                                  Donation Tiers
                                </h4>
                                <div className="space-y-2">
                                  {campaign.donationTiers.map((tier, index) => (
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
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">
                                  Documents Submitted
                                </h4>
                                <div className="space-y-1">
                                  {campaign.documents.map((doc, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center text-sm"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      {doc}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                  {campaign.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                      {tag}
                                    </Badge>
                                  ))}
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
                        Submitted: {campaign.submittedDate}
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
            {approvedCampaigns.map((campaign) => (
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
                        By: {campaign.organizer}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>
                          Goal: ৳{campaign.goalAmount.toLocaleString()}
                        </span>
                        <span>Raised: ৳{campaign.raised.toLocaleString()}</span>
                        <span>{campaign.donors} donors</span>
                        <span>Approved: {campaign.approvedDate}</span>
                      </div>
                      <Progress
                        value={(campaign.raised / campaign.goalAmount) * 100}
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
            {rejectedCampaigns.map((campaign) => (
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
                        By: {campaign.organizer}
                      </p>
                      <div className="text-sm text-gray-500 mb-2">
                        Goal: ৳{campaign.goalAmount.toLocaleString()} •
                        Rejected: {campaign.rejectedDate}
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="text-sm font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </div>
                        <div className="text-sm text-red-700">
                          {campaign.reason}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
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
                  Organizer: {selectedCampaign?.organizer.name}
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
