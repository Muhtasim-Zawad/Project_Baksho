"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, MapPin, Users, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock campaigns data
const campaigns = [
	{
		id: "1",
		title: "Help Build a School in Rural Kenya",
		description:
			"Providing quality education to 500+ children in underserved communities. This project will construct a modern school facility with proper classrooms, library, and computer lab.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Education",
		goal: 50000,
		raised: 32500,
		backers: 234,
		daysLeft: 15,
		location: "Kenya",
		organizer: "Education for All Foundation",
		featured: true,
		urgent: false,
	},
	{
		id: "2",
		title: "Clean Water Initiative",
		description:
			"Installing water purification systems in 10 villages to provide clean drinking water to over 2000 families.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Health",
		goal: 25000,
		raised: 18750,
		backers: 156,
		daysLeft: 22,
		location: "Bangladesh",
		organizer: "Water for Life",
		featured: true,
		urgent: false,
	},
	{
		id: "3",
		title: "Emergency Medical Fund",
		description:
			"Urgent medical treatment needed for children with rare diseases. Every donation helps save a life.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Health",
		goal: 15000,
		raised: 8500,
		backers: 89,
		daysLeft: 3,
		location: "Philippines",
		organizer: "Medical Aid Society",
		featured: false,
		urgent: true,
	},
	{
		id: "4",
		title: "Local Art Studio Renovation",
		description:
			"Transforming an old warehouse into a community art space where local artists can create and teach.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Creative",
		goal: 12000,
		raised: 9800,
		backers: 67,
		daysLeft: 8,
		location: "Portland, OR",
		organizer: "Community Arts Collective",
		featured: false,
		urgent: false,
	},
	{
		id: "5",
		title: "Tech Startup Launch",
		description:
			"Revolutionary app that connects local farmers with consumers directly, eliminating middlemen.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Business",
		goal: 75000,
		raised: 45000,
		backers: 123,
		daysLeft: 30,
		location: "San Francisco, CA",
		organizer: "FarmConnect Inc",
		featured: false,
		urgent: false,
	},
	{
		id: "6",
		title: "Reforestation Project",
		description:
			"Planting 10,000 trees to combat climate change and restore natural habitats for wildlife.",
		image: "/placeholder.svg?height=200&width=400",
		category: "Environment",
		goal: 20000,
		raised: 14500,
		backers: 201,
		daysLeft: 18,
		location: "Amazon Rainforest",
		organizer: "Green Earth Initiative",
		featured: false,
		urgent: false,
	},
];

const categories = [
	"All",
	"Education",
	"Health",
	"Business",
	"Creative",
	"Environment",
	"Community",
	"Emergency",
];

export default function CampaignsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("featured");

	const filteredCampaigns = campaigns.filter((campaign) => {
		const matchesSearch =
			campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === "All" || campaign.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return b.id.localeCompare(a.id);
			case "ending":
				return a.daysLeft - b.daysLeft;
			case "popular":
				return b.backers - a.backers;
			case "funded":
				return b.raised / b.goal - a.raised / a.goal;
			default:
				return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
		}
	});

	const featuredCampaigns = campaigns.filter((c) => c.featured);
	const urgentCampaigns = campaigns.filter((c) => c.urgent);

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
			<div className="container py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-4">Discover Campaigns</h1>
					<p className="text-muted-foreground mb-6">
						Find and support amazing projects that are making a difference
					</p>

					{/* Search and Filters */}
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search campaigns..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="featured">Featured</SelectItem>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="ending">Ending Soon</SelectItem>
								<SelectItem value="popular">Most Popular</SelectItem>
								<SelectItem value="funded">Most Funded</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<Tabs defaultValue="all" className="space-y-6">
					<TabsList>
						<TabsTrigger value="all">All Campaigns</TabsTrigger>
						<TabsTrigger value="featured">Featured</TabsTrigger>
						<TabsTrigger value="urgent">Urgent</TabsTrigger>
					</TabsList>

					<TabsContent value="all">
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{sortedCampaigns.map((campaign) => (
								<CampaignCard key={campaign.id} campaign={campaign} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="featured">
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredCampaigns.map((campaign) => (
								<CampaignCard key={campaign.id} campaign={campaign} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="urgent">
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{urgentCampaigns.map((campaign) => (
								<CampaignCard key={campaign.id} campaign={campaign} />
							))}
						</div>
					</TabsContent>
				</Tabs>

				{sortedCampaigns.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No campaigns found matching your criteria.
						</p>
						<Button asChild className="mt-4">
							<Link href="/campaigns/create">Start Your Own Campaign</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

function CampaignCard({ campaign }: { campaign: any }) {
	const progressPercentage = (campaign.raised / campaign.goal) * 100;

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow">
			<div className="relative">
				<Image
					src={campaign.image || "/placeholder.svg"}
					alt={campaign.title}
					width={400}
					height={200}
					className="w-full h-48 object-cover"
				/>
				<div className="absolute top-3 left-3 flex gap-2">
					<Badge>{campaign.category}</Badge>
					{campaign.featured && <Badge variant="secondary">Featured</Badge>}
					{campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
				</div>
				{campaign.daysLeft <= 7 && (
					<Badge className="absolute top-3 right-3" variant="outline">
						{campaign.daysLeft} days left
					</Badge>
				)}
			</div>

			<CardHeader className="pb-3">
				<h3 className="font-semibold text-lg line-clamp-2">{campaign.title}</h3>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{campaign.description}
				</p>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="font-medium">
							${campaign.raised.toLocaleString()} raised
						</span>
						<span className="text-muted-foreground">
							{progressPercentage.toFixed(0)}%
						</span>
					</div>
					<Progress value={progressPercentage} />
					<div className="text-sm text-muted-foreground">
						${campaign.goal.toLocaleString()} goal
					</div>
				</div>

				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />
						<span>{campaign.backers} backers</span>
					</div>
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>{campaign.daysLeft} days left</span>
					</div>
				</div>

				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="h-4 w-4" />
					<span>{campaign.location}</span>
				</div>
			</CardContent>

			<CardFooter className="flex gap-2">
				<Button asChild className="flex-1">
					<Link href={`/campaigns/${campaign.id}`}>View Details</Link>
				</Button>
				<Button variant="outline" size="icon">
					<Heart className="h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
