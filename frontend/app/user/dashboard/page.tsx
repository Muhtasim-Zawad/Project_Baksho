"use client";

import { useAuth } from "@/contexts/auth-context";
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
								Campaigns Supported
							</CardTitle>
							<Heart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{donationStats.campaignsSupported}
							</div>
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
						<TabsTrigger value="donations">Recent Donations</TabsTrigger>
						<TabsTrigger value="campaigns">Supported Campaigns</TabsTrigger>
						<TabsTrigger value="incentives">Incentives</TabsTrigger>
					</TabsList>

					<TabsContent value="donations">
						<Card>
							<CardHeader>
								<CardTitle>Recent Donations</CardTitle>
								<CardDescription>
									Your latest contributions to campaigns
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentDonations.map((donation) => (
										<div
											key={donation.id}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="space-y-1">
												<p className="font-medium">{donation.campaign}</p>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<span>${donation.amount}</span>
													<span>
														{new Date(donation.date).toLocaleDateString()}
													</span>
													<Badge
														variant={
															donation.status === "completed"
																? "default"
																: "secondary"
														}
													>
														{donation.status}
													</Badge>
												</div>
												{donation.incentive && (
													<p className="text-sm text-muted-foreground">
														Incentive: {donation.incentive}
													</p>
												)}
											</div>
											<Button variant="outline" size="sm">
												View Receipt
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="campaigns">
						<div className="grid gap-6">
							{supportedCampaigns.map((campaign) => (
								<Card key={campaign.id}>
									<CardContent className="p-6">
										<div className="flex gap-4">
											<Image
												src={campaign.image || "/placeholder.svg"}
												alt={campaign.title}
												width={150}
												height={100}
												className="rounded-lg object-cover"
											/>
											<div className="flex-1 space-y-3">
												<div className="flex items-start justify-between">
													<h3 className="font-semibold text-lg">
														{campaign.title}
													</h3>
													<Badge
														variant={
															campaign.status === "completed"
																? "default"
																: "secondary"
														}
													>
														{campaign.status}
													</Badge>
												</div>

												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>
															${campaign.raised.toLocaleString()} raised
														</span>
														<span>${campaign.goal.toLocaleString()} goal</span>
													</div>
													<Progress
														value={(campaign.raised / campaign.goal) * 100}
													/>
												</div>

												<div className="flex items-center justify-between">
													<p className="text-sm text-muted-foreground">
														Your contribution: ${campaign.myContribution}
													</p>
													<Button asChild variant="outline" size="sm">
														<Link href={`/campaigns/${campaign.id}`}>
															View Campaign
														</Link>
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
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
