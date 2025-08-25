"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock campaign data
const campaign = {
	id: 1,
	title: "Emergency Flood Relief for Sylhet",
	description:
		"Help families affected by recent flooding in Sylhet region with emergency supplies, temporary shelter, and medical aid. The recent floods have displaced over 500 families and destroyed homes, crops, and livelihoods.",
	fullDescription: `The devastating floods in Sylhet have left hundreds of families homeless and in desperate need of assistance. Our team is working directly with local authorities and community leaders to provide immediate relief.

**What we're doing:**
- Providing emergency food supplies for 500 families
- Setting up temporary shelters
- Distributing clean water and medical supplies
- Supporting children's education continuity

**How your donation helps:**
- ৳500 feeds a family for a week
- ৳2000 provides emergency shelter materials
- ৳5000 supports medical aid for 10 people
- ৳10000 helps rebuild a family's livelihood

Every contribution, no matter the size, makes a real difference in someone's life.`,
	category: "Disaster Relief",
	location: "Sylhet, Bangladesh",
	raised: 450000,
	goal: 800000,
	donors: 234,
	daysLeft: 15,
	createdDate: "2024-01-01",
	image: "/placeholder.svg?height=400&width=600",
	organizer: {
		name: "Bangladesh Relief Foundation",
		avatar: "/placeholder.svg?height=40&width=40",
		verified: true,
		campaigns: 12,
		totalRaised: 2500000,
	},
	urgent: true,
	verified: true,
	tags: ["Emergency", "Flood Relief", "Families", "Shelter"],
};

const donationTiers = [
	{
		amount: 500,
		title: "Food Support",
		description: "Provides emergency food for one family for a week",
		backers: 45,
		incentive: "Thank you message and relief updates",
	},
	{
		amount: 2000,
		title: "Shelter Kit",
		description: "Emergency shelter materials for displaced families",
		backers: 23,
		incentive: "Photo updates of shelter construction + certificate",
	},
	{
		amount: 5000,
		title: "Medical Aid Package",
		description: "Medical supplies and treatment for 10 people",
		backers: 12,
		incentive: "Detailed impact report + video message from beneficiaries",
	},
	{
		amount: 10000,
		title: "Livelihood Restoration",
		description: "Help rebuild a family's source of income",
		backers: 8,
		incentive: "Personal thank you call + annual impact report",
	},
];

const updates = [
	{
		id: 1,
		date: "2024-01-15",
		title: "Relief Distribution Begins",
		content:
			"We've successfully distributed food packages to 150 families in the most affected areas. Medical teams are also providing healthcare services.",
		images: ["/placeholder.svg?height=200&width=300"],
	},
	{
		id: 2,
		date: "2024-01-10",
		title: "Temporary Shelters Set Up",
		content:
			"Thanks to your generous donations, we've established 50 temporary shelters. Families now have safe places to stay while we work on permanent solutions.",
		images: [
			"/placeholder.svg?height=200&width=300",
			"/placeholder.svg?height=200&width=300",
		],
	},
];

const comments = [
	{
		id: 1,
		user: "Ahmed Rahman",
		avatar: "/placeholder.svg?height=32&width=32",
		date: "2024-01-14",
		content:
			"Thank you for this important work. I've donated and shared with my network. Stay strong Sylhet!",
		likes: 12,
	},
	{
		id: 2,
		user: "Fatima Khan",
		avatar: "/placeholder.svg?height=32&width=32",
		date: "2024-01-13",
		content:
			"My family is from Sylhet. This means so much to us. May Allah bless your efforts.",
		likes: 8,
	},
];

export default function CampaignDetailsPage() {
	const [selectedTier, setSelectedTier] = useState<number | null>(null);
	const [newComment, setNewComment] = useState("");

	const progressPercentage = (campaign.raised / campaign.goal) * 100;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header
			<header className="bg-white border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Heart className="h-6 w-6 text-red-500" />
							<Link href="/" className="text-xl font-bold text-green-700">
								Baksho
							</Link>
						</div>
						<div className="flex items-center space-x-3">
							<Link href="/campaigns">
								<Button variant="ghost" size="sm">
									Back to Campaigns
								</Button>
							</Link>
							<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
								<span className="text-sm font-medium text-green-700">JD</span>
							</div>
						</div>
					</div>
				</div>
			</header> */}

			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Campaign Header */}
						<div>
							<div className="flex flex-wrap gap-2 mb-4">
								<Badge variant="secondary">{campaign.category}</Badge>
								{campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
								{campaign.verified && (
									<Badge className="bg-green-600">
										<Shield className="w-3 h-3 mr-1" />
										Verified
									</Badge>
								)}
								{campaign.tags.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>

							<h1 className="text-3xl font-bold text-gray-900 mb-4">
								{campaign.title}
							</h1>

							<div className="flex items-center text-gray-600 space-x-4 mb-6">
								<div className="flex items-center">
									<MapPin className="h-4 w-4 mr-1" />
									{campaign.location}
								</div>
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-1" />
									Created {campaign.createdDate}
								</div>
								<div className="flex items-center">
									<Clock className="h-4 w-4 mr-1" />
									{campaign.daysLeft} days left
								</div>
							</div>
						</div>

						{/* Campaign Image */}
						<div className="relative">
							<Image
								src={campaign.image || "/placeholder.svg"}
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

						{/* Campaign Tabs */}
						<Tabs defaultValue="story" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="story">Story</TabsTrigger>
								<TabsTrigger value="updates">
									Updates ({updates.length})
								</TabsTrigger>
								<TabsTrigger value="comments">
									Comments ({comments.length})
								</TabsTrigger>
							</TabsList>

							<TabsContent value="story" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Campaign Story</CardTitle>
									</CardHeader>
									<CardContent className="prose max-w-none">
										<div className="whitespace-pre-line text-gray-700 leading-relaxed">
											{campaign.fullDescription}
										</div>
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
												<AvatarImage
													src={campaign.organizer.avatar || "/placeholder.svg"}
												/>
												<AvatarFallback>OR</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<h3 className="font-semibold">
														{campaign.organizer.name}
													</h3>
													{campaign.organizer.verified && (
														<Badge className="bg-green-600">
															<Shield className="w-3 h-3 mr-1" />
															Verified
														</Badge>
													)}
												</div>
												<div className="text-sm text-gray-600 mt-1">
													{campaign.organizer.campaigns} campaigns • ৳
													{campaign.organizer.totalRaised.toLocaleString()}{" "}
													raised
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

							<TabsContent value="updates" className="mt-6">
								<div className="space-y-6">
									{updates.map((update) => (
										<Card key={update.id}>
											<CardHeader>
												<div className="flex justify-between items-start">
													<CardTitle className="text-lg">
														{update.title}
													</CardTitle>
													<span className="text-sm text-gray-500">
														{update.date}
													</span>
												</div>
											</CardHeader>
											<CardContent>
												<p className="text-gray-700 mb-4">{update.content}</p>
												{update.images && (
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														{update.images.map((image, index) => (
															<Image
																key={index}
																src={image || "/placeholder.svg"}
																alt={`Update ${update.id} image ${index + 1}`}
																width={300}
																height={200}
																className="rounded-lg object-cover"
															/>
														))}
													</div>
												)}
											</CardContent>
										</Card>
									))}
								</div>
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

										{/* Comments List */}
										<div className="space-y-4">
											{comments.map((comment) => (
												<div key={comment.id} className="flex space-x-3">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={comment.avatar || "/placeholder.svg"}
														/>
														<AvatarFallback>{comment.user[0]}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="bg-gray-50 rounded-lg p-3">
															<div className="flex justify-between items-start mb-1">
																<span className="font-medium text-sm">
																	{comment.user}
																</span>
																<span className="text-xs text-gray-500">
																	{comment.date}
																</span>
															</div>
															<p className="text-sm text-gray-700">
																{comment.content}
															</p>
														</div>
														<div className="flex items-center space-x-2 mt-2">
															<Button
																variant="ghost"
																size="sm"
																className="text-xs"
															>
																<Heart className="h-3 w-3 mr-1" />
																{comment.likes}
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="text-xs"
															>
																Reply
															</Button>
														</div>
													</div>
												</div>
											))}
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
											<div className="text-xl font-bold">{campaign.donors}</div>
											<div className="text-sm text-gray-600">donors</div>
										</div>
										<div className="text-center">
											<div className="text-xl font-bold">
												{campaign.daysLeft}
											</div>
											<div className="text-sm text-gray-600">days left</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Donation Tiers */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Target className="h-5 w-5 mr-2" />
									Support This Campaign
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{donationTiers.map((tier, index) => (
									<div
										key={index}
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
											<span className="text-sm text-gray-600">
												{tier.backers} backers
											</span>
										</div>
										<h4 className="font-medium mb-1">{tier.title}</h4>
										<p className="text-sm text-gray-600 mb-2">
											{tier.description}
										</p>
										<p className="text-xs text-green-600 font-medium">
											Incentive: {tier.incentive}
										</p>
									</div>
								))}

								<div className="pt-4 space-y-3">
									{/* <Button
										className="w-full bg-green-600 hover:bg-green-700"
										size="lg"
									>
										Donate Now
									</Button> */}

									<Button
										asChild
										variant="default"
										size="lg"
										className="hidden md:flex"
									>
										<Link href="">Donate Now</Link>
									</Button>

									<Button variant="outline" className="w-full bg-transparent">
										<Heart className="h-4 w-4 mr-2" />
										Save for Later
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Recent Donors */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Users className="h-5 w-5 mr-2" />
									Recent Supporters
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{[
										{ name: "Ahmed R.", amount: 5000, time: "2 hours ago" },
										{ name: "Anonymous", amount: 2000, time: "4 hours ago" },
										{ name: "Fatima K.", amount: 1000, time: "6 hours ago" },
										{ name: "Rahman S.", amount: 10000, time: "1 day ago" },
									].map((donor, index) => (
										<div
											key={index}
											className="flex justify-between items-center"
										>
											<div>
												<div className="font-medium text-sm">{donor.name}</div>
												<div className="text-xs text-gray-600">
													{donor.time}
												</div>
											</div>
											<div className="font-semibold text-sm">
												৳{donor.amount.toLocaleString()}
											</div>
										</div>
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
