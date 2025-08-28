"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
	Heart,
	Share2,
	Flag,
	MapPin,
	Clock,
	Users,
	Shield,
	Calendar,
	Target,
	Send,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Types
interface IncentiveTier {
	id: number;
	amount: number;
	title: string;
	description: string;
	backers?: number;
	incentive?: string;
}

interface Campaign {
	id: number;
	title: string;
	description: string;
	category: string;
	goal: number;
	raised: number;
	backers: number;
	duration: number;
	location: string;
	story?: string;
	risks?: string;
	timeline?: string;
	image_urls?: string;
	organizer_id: string;
	organizer_name: string;
	featured: boolean;
	urgent: boolean;
	incentive_tiers: IncentiveTier[];
	created_at?: string;
	updated_at?: string;
}

interface CampaignDetailsPageProps {
	params: {
		id: string;
	};
}

// API functions
const API_BASE_URL = "http://localhost:8080";

const getAuthToken = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("accessToken");
	}
	return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	const token = getAuthToken();

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (response.status === 401) {
		// Token expired, redirect to login
		if (typeof window !== "undefined") {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			window.location.href = "/login";
		}
		throw new Error("Authentication required");
	}

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

const fetchCampaign = async (id: string): Promise<Campaign> => {
	return fetchWithAuth(`${API_BASE_URL}/campaigns/${id}`);
};

export default function CampaignDetailsPage({
	params,
}: CampaignDetailsPageProps) {
	const [campaign, setCampaign] = useState<Campaign | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedTier, setSelectedTier] = useState<number | null>(null);
	const [newComment, setNewComment] = useState("");

	const router = useRouter();
	const campaignId = params.id;

	useEffect(() => {
		const loadCampaign = async () => {
			try {
				setLoading(true);
				const campaignData = await fetchCampaign(campaignId);
				setCampaign(campaignData);
				setError(null);
			} catch (err) {
				console.error("Error fetching campaign:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load campaign"
				);
			} finally {
				setLoading(false);
			}
		};

		if (campaignId) {
			loadCampaign();
		}
	}, [campaignId]);

	// Helper functions
	const calculateDaysLeft = (createdAt: string, duration: number): number => {
		if (!createdAt) return duration;

		const created = new Date(createdAt);
		const endDate = new Date(
			created.getTime() + duration * 24 * 60 * 60 * 1000
		);
		const now = new Date();
		const diffTime = endDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return Math.max(0, diffDays);
	};

	const formatDate = (dateString: string): string => {
		if (!dateString) return "Unknown";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getImageUrls = (imageUrls: string | undefined): string[] => {
		if (!imageUrls) return ["/placeholder.svg?height=400&width=600"];

		const urls = imageUrls
			.split(",")
			.map((url) => url.trim())
			.filter((url) => url.length > 0);
		return urls.length > 0 ? urls : ["/placeholder.svg?height=400&width=600"];
	};

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading campaign...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !campaign) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						{error || "Campaign not found"}
					</h1>
					<Button onClick={() => router.push("/campaigns")}>
						Back to Campaigns
					</Button>
				</div>
			</div>
		);
	}

	const progressPercentage = (campaign.raised / campaign.goal) * 100;
	const daysLeft = calculateDaysLeft(
		campaign.created_at || "",
		campaign.duration
	);
	const imageUrls = getImageUrls(campaign.image_urls);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Campaign Header */}
						<div>
							<div className="flex flex-wrap gap-2 mb-4">
								<Badge variant="secondary">{campaign.category}</Badge>
								{campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
								{campaign.featured && (
									<Badge className="bg-green-600">
										<Shield className="w-3 h-3 mr-1" />
										Featured
									</Badge>
								)}
							</div>

							<h1 className="text-3xl font-bold text-gray-900 mb-4">
								{campaign.title}
							</h1>

							<div className="flex items-center text-gray-600 space-x-4 mb-6">
								<div className="flex items-center">
									<MapPin className="h-4 w-4 mr-1" />
									{campaign.location}
								</div>
								{campaign.created_at && (
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-1" />
										Created {formatDate(campaign.created_at)}
									</div>
								)}
								<div className="flex items-center">
									<Clock className="h-4 w-4 mr-1" />
									{daysLeft} days left
								</div>
							</div>
						</div>

						{/* Campaign Images */}
						<div className="relative">
							{imageUrls.length === 1 ? (
								// Single image display
								<div className="relative">
									<Image
										src={imageUrls[0]}
										alt={campaign.title}
										width={600}
										height={400}
										className="w-full h-64 md:h-96 object-cover rounded-lg"
									/>
									<div className="absolute top-4 right-4 flex space-x-2">
										<Button variant="secondary" size="sm">
											<Heart className="h-4 w-4 mr-1" />
											Save
										</Button>
										<Button variant="secondary" size="sm">
											<Share2 className="h-4 w-4 mr-1" />
											Share
										</Button>
										<Button variant="ghost" size="sm">
											<Flag className="h-4 w-4" />
										</Button>
									</div>
								</div>
							) : (
								// Multiple images display
								<div>
									{/* Main image */}
									<div className="relative mb-4">
										<Image
											src={imageUrls[0]}
											alt={`${campaign.title} - Main image`}
											width={600}
											height={400}
											className="w-full h-64 md:h-80 object-cover rounded-lg"
										/>
										<div className="absolute top-4 right-4 flex space-x-2">
											<Button variant="secondary" size="sm">
												<Heart className="h-4 w-4 mr-1" />
												Save
											</Button>
											<Button variant="secondary" size="sm">
												<Share2 className="h-4 w-4 mr-1" />
												Share
											</Button>
											<Button variant="ghost" size="sm">
												<Flag className="h-4 w-4" />
											</Button>
										</div>
										{imageUrls.length > 1 && (
											<div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
												1 / {imageUrls.length}
											</div>
										)}
									</div>

									{/* Additional images grid */}
									{imageUrls.length > 1 && (
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
											{imageUrls.slice(1).map((url, index) => (
												<div key={index + 1} className="relative group">
													<Image
														src={url}
														alt={`${campaign.title} - Image ${index + 2}`}
														width={200}
														height={150}
														className="w-full h-24 md:h-32 object-cover rounded-lg cursor-pointer transition-opacity group-hover:opacity-80"
														onClick={() => {
															// You can implement a modal/lightbox here
															console.log(`Clicked image ${index + 2}`);
														}}
													/>
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>

						{/* Campaign Tabs */}
						<Tabs defaultValue="story" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="story">Story</TabsTrigger>
								<TabsTrigger value="comments">Comments</TabsTrigger>
							</TabsList>

							<TabsContent value="story" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Campaign Story</CardTitle>
									</CardHeader>
									<CardContent className="prose max-w-none">
										<div className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
											{campaign.story || campaign.description}
										</div>

										{campaign.timeline && (
											<div className="mb-6">
												<h3 className="text-lg font-semibold mb-3">Timeline</h3>
												<div className="whitespace-pre-line text-gray-700">
													{campaign.timeline}
												</div>
											</div>
										)}

										{campaign.risks && (
											<div className="mb-6">
												<h3 className="text-lg font-semibold mb-3">
													Risks & Challenges
												</h3>
												<div className="whitespace-pre-line text-gray-700">
													{campaign.risks}
												</div>
											</div>
										)}
									</CardContent>
								</Card>

								{/* Organizer Info */}
								<Card className="mt-6">
									<CardHeader>
										<CardTitle>Campaign Organizer</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex items-start space-x-4">
											<Avatar className="h-12 w-12">
												<AvatarFallback>
													{campaign.organizer_name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<h3 className="font-semibold">
														{campaign.organizer_name}
													</h3>
												</div>
												<div className="text-sm text-gray-600 mt-1">
													Campaign organizer
												</div>
												<Button
													variant="outline"
													size="sm"
													className="mt-3 bg-transparent"
												>
													View Profile
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="comments" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Comments</CardTitle>
									</CardHeader>
									<CardContent>
										{/* Add Comment */}
										<div className="mb-6">
											<Textarea
												placeholder="Share your thoughts or encouragement..."
												value={newComment}
												onChange={(e) => setNewComment(e.target.value)}
												className="mb-3"
											/>
											<Button>
												<Send className="h-4 w-4 mr-2" />
												Post Comment
											</Button>
										</div>

										{/* Comments List - You can implement comments API later */}
										<div className="text-center text-gray-500 py-8">
											Comments feature coming soon!
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Campaign Stats */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div>
										<div className="flex justify-between items-center mb-2">
											<span className="text-2xl font-bold">
												৳{campaign.raised.toLocaleString()}
											</span>
											<span className="text-sm text-gray-600">raised</span>
										</div>
										<Progress value={progressPercentage} className="h-3" />
										<div className="flex justify-between text-sm text-gray-600 mt-2">
											<span>{Math.round(progressPercentage)}% funded</span>
											<span>৳{campaign.goal.toLocaleString()} goal</span>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4 pt-4 border-t">
										<div className="text-center">
											<div className="text-xl font-bold">
												{campaign.backers}
											</div>
											<div className="text-sm text-gray-600">backers</div>
										</div>
										<div className="text-center">
											<div className="text-xl font-bold">{daysLeft}</div>
											<div className="text-sm text-gray-600">days left</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Donation Tiers */}
						{campaign.incentive_tiers &&
							campaign.incentive_tiers.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Target className="h-5 w-5 mr-2" />
											Support This Campaign
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{campaign.incentive_tiers.map((tier, index) => (
											<div
												key={tier.id}
												className={`border rounded-lg p-4 cursor-pointer transition-colors ${
													selectedTier === index
														? "border-green-500 bg-green-50"
														: "border-gray-200 hover:border-gray-300"
												}`}
												onClick={() =>
													setSelectedTier(selectedTier === index ? null : index)
												}
											>
												<div className="flex justify-between items-start mb-2">
													<span className="font-semibold text-lg">
														৳{tier.amount.toLocaleString()}
													</span>
													{tier.backers && (
														<span className="text-sm text-gray-600">
															{tier.backers} backers
														</span>
													)}
												</div>
												<h4 className="font-medium mb-1">{tier.title}</h4>
												<p className="text-sm text-gray-600">
													{tier.description}
												</p>
											</div>
										))}

										<div className="pt-4 space-y-3">
											<Button
												className="w-full bg-green-600 hover:bg-green-700"
												size="lg"
											>
												Donate Now
											</Button>

											<Button
												variant="outline"
												className="w-full bg-transparent"
											>
												<Heart className="h-4 w-4 mr-2" />
												Save for Later
											</Button>
										</div>
									</CardContent>
								</Card>
							)}

						{/* Quick Support Options */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Heart className="h-5 w-5 mr-2" />
									Quick Support
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-2">
									{[500, 1000, 2500, 5000].map((amount) => (
										<Button
											key={amount}
											variant="outline"
											size="sm"
											className="bg-transparent"
											onClick={() => {
												// Handle quick donation
												console.log(`Quick donate: ৳${amount}`);
											}}
										>
											৳{amount.toLocaleString()}
										</Button>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
