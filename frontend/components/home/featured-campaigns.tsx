import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

const featuredCampaigns = [
	{
		id: "1",
		title: "Help Build a School in Rural Kenya",
		description:
			"Providing quality education to 500+ children in underserved communities",
		image: "/placeholder.svg?height=200&width=400",
		category: "Education",
		goal: 50000,
		raised: 32500,
		backers: 234,
		daysLeft: 15,
		location: "Kenya",
		organizer: "Education for All Foundation",
	},
	{
		id: "2",
		title: "Clean Water Initiative",
		description: "Installing water purification systems in 10 villages",
		image: "/placeholder.svg?height=200&width=400",
		category: "Health",
		goal: 25000,
		raised: 18750,
		backers: 156,
		daysLeft: 22,
		location: "Bangladesh",
		organizer: "Water for Life",
	},
	{
		id: "3",
		title: "Local Art Studio Renovation",
		description: "Transforming an old warehouse into a community art space",
		image: "/placeholder.svg?height=200&width=400",
		category: "Creative",
		goal: 15000,
		raised: 12300,
		backers: 89,
		daysLeft: 8,
		location: "Portland, OR",
		organizer: "Community Arts Collective",
	},
];

export function FeaturedCampaigns() {
	return (
		<section className="py-16 flex items-center justify-center">
			<div className="container">
				<div className="flex items-center justify-between mb-12">
					<div>
						<h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
						<p className="text-muted-foreground">
							Discover amazing projects making a real impact
						</p>
					</div>
					<Button asChild variant="outline">
						<Link href="/campaigns">View All</Link>
					</Button>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuredCampaigns.map((campaign) => (
						<Card
							key={campaign.id}
							className="overflow-hidden hover:shadow-lg transition-shadow"
						>
							<div className="relative">
								<Image
									src={campaign.image || "/placeholder.svg"}
									alt={campaign.title}
									width={400}
									height={200}
									className="w-full h-48 object-cover"
								/>
								<Badge className="absolute top-3 left-3">
									{campaign.category}
								</Badge>
							</div>

							<CardHeader className="pb-3">
								<h3 className="font-semibold text-lg line-clamp-2">
									{campaign.title}
								</h3>
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
											${campaign.goal.toLocaleString()} goal
										</span>
									</div>
									<Progress value={(campaign.raised / campaign.goal) * 100} />
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

							<CardFooter>
								<Button asChild className="w-full">
									<Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
