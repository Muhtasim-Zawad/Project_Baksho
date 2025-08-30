"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	GraduationCap,
	Heart,
	Briefcase,
	Palette,
	Leaf,
	Users,
	Stethoscope,
	Home,
	Search,
	TrendingUp,
	DollarSign,
} from "lucide-react";
import Image from "next/image";

const categories = [
	{
		id: "education",
		name: "Education",
		icon: GraduationCap,
		description: "Supporting learning and educational initiatives worldwide",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		count: 1234,
		totalRaised: 2500000,
		successRate: 87,
		featuredCampaigns: [
			{
				id: "1",
				title: "Build Schools in Rural Kenya",
				image: "/placeholder.svg?height=150&width=200",
				raised: 32500,
				goal: 50000,
				backers: 234,
			},
			{
				id: "2",
				title: "Coding Bootcamp for Underserved Youth",
				image: "/placeholder.svg?height=150&width=200",
				raised: 18750,
				goal: 25000,
				backers: 156,
			},
		],
	},
	{
		id: "health",
		name: "Health",
		icon: Stethoscope,
		description: "Medical care, research, and health initiatives",
		color: "text-red-600",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		count: 856,
		totalRaised: 1800000,
		successRate: 82,
		featuredCampaigns: [
			{
				id: "3",
				title: "Clean Water for Villages",
				image: "/placeholder.svg?height=150&width=200",
				raised: 45000,
				goal: 60000,
				backers: 289,
			},
			{
				id: "4",
				title: "Mobile Medical Clinic",
				image: "/placeholder.svg?height=150&width=200",
				raised: 22000,
				goal: 35000,
				backers: 178,
			},
		],
	},
	{
		id: "business",
		name: "Business",
		icon: Briefcase,
		description: "Startups, entrepreneurship, and business ventures",
		color: "text-green-600",
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
		count: 642,
		totalRaised: 3200000,
		successRate: 75,
		featuredCampaigns: [
			{
				id: "5",
				title: "Sustainable Fashion Startup",
				image: "/placeholder.svg?height=150&width=200",
				raised: 85000,
				goal: 100000,
				backers: 445,
			},
			{
				id: "6",
				title: "Local Farm to Table App",
				image: "/placeholder.svg?height=150&width=200",
				raised: 35000,
				goal: 50000,
				backers: 267,
			},
		],
	},
	{
		id: "creative",
		name: "Creative",
		icon: Palette,
		description: "Art, music, film, and creative projects",
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		count: 789,
		totalRaised: 1200000,
		successRate: 79,
		featuredCampaigns: [
			{
				id: "7",
				title: "Community Art Studio",
				image: "/placeholder.svg?height=150&width=200",
				raised: 12000,
				goal: 15000,
				backers: 89,
			},
			{
				id: "8",
				title: "Independent Documentary Film",
				image: "/placeholder.svg?height=150&width=200",
				raised: 28000,
				goal: 40000,
				backers: 156,
			},
		],
	},
	{
		id: "environment",
		name: "Environment",
		icon: Leaf,
		description: "Environmental conservation and sustainability projects",
		color: "text-emerald-600",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		count: 423,
		totalRaised: 950000,
		successRate: 84,
		featuredCampaigns: [
			{
				id: "9",
				title: "Reforestation Initiative",
				image: "/placeholder.svg?height=150&width=200",
				raised: 45000,
				goal: 60000,
				backers: 312,
			},
			{
				id: "10",
				title: "Ocean Cleanup Project",
				image: "/placeholder.svg?height=150&width=200",
				raised: 78000,
				goal: 100000,
				backers: 456,
			},
		],
	},
	{
		id: "community",
		name: "Community",
		icon: Users,
		description: "Local community projects and social initiatives",
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		count: 567,
		totalRaised: 800000,
		successRate: 88,
		featuredCampaigns: [
			{
				id: "11",
				title: "Community Garden Project",
				image: "/placeholder.svg?height=150&width=200",
				raised: 8500,
				goal: 12000,
				backers: 67,
			},
			{
				id: "12",
				title: "Youth Sports Program",
				image: "/placeholder.svg?height=150&width=200",
				raised: 15000,
				goal: 20000,
				backers: 123,
			},
		],
	},
	{
		id: "emergency",
		name: "Emergency",
		icon: Heart,
		description: "Disaster relief and emergency assistance",
		color: "text-pink-600",
		bgColor: "bg-pink-50",
		borderColor: "border-pink-200",
		count: 234,
		totalRaised: 1500000,
		successRate: 91,
		featuredCampaigns: [
			{
				id: "13",
				title: "Earthquake Relief Fund",
				image: "/placeholder.svg?height=150&width=200",
				raised: 125000,
				goal: 150000,
				backers: 789,
			},
			{
				id: "14",
				title: "Flood Victims Support",
				image: "/placeholder.svg?height=150&width=200",
				raised: 67000,
				goal: 80000,
				backers: 445,
			},
		],
	},
	{
		id: "housing",
		name: "Housing",
		icon: Home,
		description: "Housing projects and homelessness initiatives",
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
		borderColor: "border-indigo-200",
		count: 345,
		totalRaised: 2100000,
		successRate: 76,
		featuredCampaigns: [
			{
				id: "15",
				title: "Affordable Housing Initiative",
				image: "/placeholder.svg?height=150&width=200",
				raised: 180000,
				goal: 250000,
				backers: 567,
			},
			{
				id: "16",
				title: "Homeless Shelter Renovation",
				image: "/placeholder.svg?height=150&width=200",
				raised: 45000,
				goal: 75000,
				backers: 234,
			},
		],
	},
];

export default function CategoriesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalCampaigns = categories.reduce((sum, cat) => sum + cat.count, 0);
	const totalRaised = categories.reduce((sum, cat) => sum + cat.totalRaised, 0);
	const avgSuccessRate = Math.round(
		categories.reduce((sum, cat) => sum + cat.successRate, 0) /
			categories.length
	);

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
			<div className="container py-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
						Discover amazing projects across different categories and find
						causes that matter to you
					</p>

					{/* Search */}
					<div className="max-w-md mx-auto relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search categories..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Campaigns
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalCampaigns.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								Across all categories
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Raised
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								${(totalRaised / 1000000).toFixed(1)}M
							</div>
							<p className="text-xs text-muted-foreground">
								Funds raised to date
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Success Rate
							</CardTitle>
							<Heart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{avgSuccessRate}%</div>
							<p className="text-xs text-muted-foreground">
								Average across categories
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredCategories.map((category) => (
						<Card
							key={category.id}
							className={`hover:shadow-lg transition-all cursor-pointer ${category.borderColor} border-2`}
							onClick={() =>
								setSelectedCategory(
									selectedCategory === category.id ? null : category.id
								)
							}
						>
							<CardHeader className={`${category.bgColor} rounded-t-lg`}>
								<div className="flex items-center justify-between">
									<category.icon className={`h-8 w-8 ${category.color}`} />
									<Badge variant="secondary">{category.count}</Badge>
								</div>
								<CardTitle className="text-xl">{category.name}</CardTitle>
								<CardDescription className="text-sm">
									{category.description}
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-4">
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Total Raised</span>
										<span className="font-medium">
											${(category.totalRaised / 1000000).toFixed(1)}M
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Success Rate</span>
										<span className="font-medium">{category.successRate}%</span>
									</div>
									<Progress value={category.successRate} className="h-2" />

									<div className="pt-2">
										<Button asChild className="w-full" variant="outline">
											<Link href={`/campaigns?category=${category.id}`}>
												View Campaigns
											</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{filteredCategories.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No categories found matching your search.
						</p>
					</div>
				)}

				{/* Call to Action */}
				<div className="text-center mt-16 py-12 bg-muted/50 rounded-lg">
					<h2 className="text-2xl font-bold mb-4">
						Ready to Make a Difference?
					</h2>
					<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
						Whether you want to support existing campaigns or start your own,
						join our community of changemakers today.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg">
							<Link href="/campaigns">Browse All Campaigns</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/campaigns/create">Start Your Campaign</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
