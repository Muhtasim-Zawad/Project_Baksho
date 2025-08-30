"use client";

import { useAuth } from "@/contexts/auth-context";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign, TrendingUp, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/hooks/useAxiosPrivate";

// Mock data
const donationStats = {
	totalDonated: 1250,
	campaignsSupported: 8,
	impactScore: 92,
	incentivesReceived: 5,
};

const recentDonations = [
	{
		id: "1",
		campaign: "Help Build a School in Rural Kenya",
		amount: 100,
		date: "2024-01-15",
		status: "completed",
		incentive: "Thank you postcard",
	},
	{
		id: "2",
		campaign: "Clean Water Initiative",
		amount: 50,
		date: "2024-01-10",
		status: "completed",
		incentive: "Digital certificate",
	},
	{
		id: "3",
		campaign: "Local Art Studio Renovation",
		amount: 75,
		date: "2024-01-05",
		status: "pending",
		incentive: "Studio visit",
	},
];

const supportedCampaigns = [
	{
		id: "1",
		title: "Help Build a School in Rural Kenya",
		image: "/placeholder.svg?height=100&width=150",
		goal: 50000,
		raised: 32500,
		myContribution: 100,
		status: "active",
	},
	{
		id: "2",
		title: "Clean Water Initiative",
		image: "/placeholder.svg?height=100&width=150",
		goal: 25000,
		raised: 18750,
		myContribution: 50,
		status: "active",
	},
	{
		id: "3",
		title: "Community Garden Project",
		image: "/placeholder.svg?height=100&width=150",
		goal: 10000,
		raised: 10000,
		myContribution: 25,
		status: "completed",
	},
];

const incentives = [
	{
		id: "1",
		campaign: "Help Build a School in Rural Kenya",
		item: "Thank you postcard from students",
		status: "shipped",
		estimatedDelivery: "2024-02-01",
	},
	{
		id: "2",
		campaign: "Clean Water Initiative",
		item: "Digital impact report",
		status: "delivered",
		deliveredDate: "2024-01-20",
	},
];

export default function UserDashboard() {
	const { user } = useAuth();

	const [myCampaigns, setMyCampaigns] = useState([]);

	useEffect(() => {
		async function fetchAndSetCampaign() {
			try {
				const response = await axiosPrivate.get("/campaigns/");
				setMyCampaigns(response.data);
				console.log(response.data);
			} catch (err) {
				console.error("Error fetching campaigns from backend:", err);
				return [];
			}
		}
		fetchAndSetCampaign();
	}, []);

	if (!user) {
		return <div>Please log in to access your dashboard.</div>;
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
			<div className="container py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">
						Welcome back, {user.name}!
					</h1>
					<p className="text-muted-foreground">
						Track your donations and see the impact you're making
					</p>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Donated
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								${donationStats.totalDonated}
							</div>
							<p className="text-xs text-muted-foreground">
								+12% from last month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Campaigns Created
							</CardTitle>
							<Heart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{myCampaigns.length}</div>
							<p className="text-xs text-muted-foreground">
								Across 5 categories
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Impact Score
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{donationStats.impactScore}
							</div>
							<p className="text-xs text-muted-foreground">Top 10% of donors</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Incentives</CardTitle>
							<Gift className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{donationStats.incentivesReceived}
							</div>
							<p className="text-xs text-muted-foreground">
								2 pending delivery
							</p>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="donations" className="space-y-6">
					<TabsList>
						<TabsTrigger value="donations">My Campaigns</TabsTrigger>
						<TabsTrigger value="incentives">Incentives</TabsTrigger>
					</TabsList>

					<TabsContent value="donations">
						<Card>
							<CardHeader>
								<CardTitle>My Campaigns</CardTitle>
								<CardDescription>Your latest campaigns...</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{myCampaigns.map((campaign) => (
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
															<Badge variant="secondary">
																{campaign.category}
															</Badge>
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
																{/* <DialogTrigger asChild> */}
																<Button
																	variant="outline"
																	className="w-full bg-transparent"
																>
																	<Eye className="h-4 w-4 mr-2" />
																	<Link href={`/campaigns/${campaign.id}`}>
																		View Details
																	</Link>
																</Button>
															</Dialog>
														</div>

														<div className="text-xs text-gray-500 pt-4 border-t">
															Submitted: {campaign.created_at}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="incentives">
						<Card>
							<CardHeader>
								<CardTitle>Your Incentives</CardTitle>
								<CardDescription>
									Track your rewards and thank you gifts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{incentives.map((incentive) => (
										<div
											key={incentive.id}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="space-y-1">
												<p className="font-medium">{incentive.item}</p>
												<p className="text-sm text-muted-foreground">
													{incentive.campaign}
												</p>
												<Badge
													variant={
														incentive.status === "delivered"
															? "default"
															: "secondary"
													}
												>
													{incentive.status}
												</Badge>
											</div>
											<div className="text-right text-sm text-muted-foreground">
												{incentive.status === "delivered" ? (
													<span>
														Delivered{" "}
														{new Date(
															incentive.deliveredDate!
														).toLocaleDateString()}
													</span>
												) : (
													<span>
														Est. delivery{" "}
														{new Date(
															incentive.estimatedDelivery!
														).toLocaleDateString()}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
