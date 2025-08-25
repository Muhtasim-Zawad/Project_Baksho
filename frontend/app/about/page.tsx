import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Heart,
	Users,
	Target,
	Shield,
	Globe,
	TrendingUp,
	CheckCircle,
	Star,
	Award,
	Zap,
} from "lucide-react";
import Image from "next/image";

import riyad from "../../assets/images/riyad.jpg";
import zawad from "../../assets/images/zawad.jpg";
import asif from "../../assets/images/asif.jpg";

const stats = [
	{
		icon: Users,
		value: "50K+",
		label: "Active Users",
		description: "Supporters and creators worldwide",
	},
	{
		icon: Target,
		value: "10K+",
		label: "Campaigns Funded",
		description: "Successfully completed projects",
	},
	{
		icon: TrendingUp,
		value: "$2.5M+",
		label: "Total Raised",
		description: "Funds raised for amazing causes",
	},
	{
		icon: Globe,
		value: "50+",
		label: "Countries",
		description: "Global reach and impact",
	},
];

const features = [
	{
		icon: Shield,
		title: "Secure & Trusted",
		description:
			"Bank-level security with transparent fund management and regular audits.",
	},
	{
		icon: Zap,
		title: "Easy to Use",
		description:
			"Intuitive platform designed for both campaign creators and supporters.",
	},
	{
		icon: Heart,
		title: "Community Driven",
		description:
			"Built by the community, for the community with continuous feedback integration.",
	},
	{
		icon: Award,
		title: "Proven Success",
		description:
			"85% success rate with comprehensive support throughout your campaign journey.",
	},
];

const team = [
	{
		name: "Muhtasim Zawad",
		role: "Frontend Developer",
		image: zawad,
		bio: "Designing trust, one pixel at a time",
	},
	{
		name: "Riyad Hosen",
		role: "Fullstack Developer",
		image: riyad,
		bio: "Connecting ideas to impact, end to end",
	},
	{
		name: "MD. Abidur Rahman Asif",
		role: "Backend Engineer",
		image: asif,
		bio: "Building the engine behind every dream funded",
	},
];

const milestones = [
	{
		year: "2020",
		title: "CrowdFund Founded",
		description:
			"Started with a vision to democratize fundraising and make positive change accessible to everyone.",
	},
	{
		year: "2021",
		title: "First Million Raised",
		description:
			"Reached our first major milestone with over 1,000 successful campaigns.",
	},
	{
		year: "2022",
		title: "Global Expansion",
		description:
			"Expanded to 25+ countries and launched multi-language support.",
	},
	{
		year: "2023",
		title: "Mobile App Launch",
		description:
			"Launched iOS and Android apps, making fundraising accessible on-the-go.",
	},
	{
		year: "2024",
		title: "AI-Powered Matching",
		description:
			"Introduced smart campaign recommendations and automated fraud detection.",
	},
];

export default function AboutPage() {
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-background">
			{/* Hero Section */}
			<section className="py-20 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
				<div className="container">
					<div className="max-w-4xl mx-auto text-center">
						<Badge className="mb-4" variant="secondary">
							About CrowdFund
						</Badge>
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Empowering Dreams,{" "}
							<span className="text-primary">One Campaign at a Time</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
							We believe everyone deserves the chance to turn their vision into
							reality. CrowdFund connects passionate creators with supportive
							communities to make positive change happen.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg">
								<Link href="/campaigns/create">Start Your Campaign</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/campaigns">Support a Cause</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-muted/50 flex items-center justify-center">
				<div className="container">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<Card key={index} className="text-center">
								<CardContent className="pt-6">
									<stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
									<div className="text-3xl font-bold mb-2">{stat.value}</div>
									<div className="font-semibold mb-1">{stat.label}</div>
									<div className="text-sm text-muted-foreground">
										{stat.description}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-16 flex items-center justify-center">
				<div className="container">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold mb-6">Our Mission</h2>
							<p className="text-lg text-muted-foreground mb-6">
								At CrowdFund, we're on a mission to democratize fundraising and
								make positive change accessible to everyone. We believe that
								great ideas shouldn't be limited by traditional funding
								barriers.
							</p>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
									<div>
										<h3 className="font-semibold">Transparent & Trustworthy</h3>
										<p className="text-sm text-muted-foreground">
											Every donation is tracked and campaign progress is visible
											to all supporters.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
									<div>
										<h3 className="font-semibold">Global Impact</h3>
										<p className="text-sm text-muted-foreground">
											Supporting projects across education, health, environment,
											and social causes worldwide.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
									<div>
										<h3 className="font-semibold">Community First</h3>
										<p className="text-sm text-muted-foreground">
											Building meaningful connections between creators and
											supporters for lasting impact.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="relative">
							<Image
								src="/placeholder.svg?height=400&width=600"
								alt="Our mission"
								width={600}
								height={400}
								className="rounded-lg shadow-lg"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-muted/50 flex items-center justify-center">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Why Choose CrowdFund?</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							We've built the most comprehensive and user-friendly crowdfunding
							platform with features designed to maximize your campaign's
							success.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => (
							<Card key={index} className="text-center">
								<CardHeader>
									<feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Timeline Section */}
			<section className="py-16 flex items-center justify-center">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Journey</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							From a simple idea to a global platform, here's how we've grown to
							serve our amazing community.
						</p>
					</div>

					<div className="max-w-4xl mx-auto">
						<div className="space-y-8">
							{milestones.map((milestone, index) => (
								<div key={index} className="flex gap-6">
									<div className="flex flex-col items-center">
										<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
											{milestone.year.slice(-2)}
										</div>
										{index < milestones.length - 1 && (
											<div className="w-0.5 h-16 bg-muted mt-4"></div>
										)}
									</div>
									<div className="flex-1 pb-8">
										<div className="flex items-center gap-2 mb-2">
											<Badge variant="outline">{milestone.year}</Badge>
											<h3 className="text-xl font-semibold">
												{milestone.title}
											</h3>
										</div>
										<p className="text-muted-foreground">
											{milestone.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-16 bg-muted/50 flex items-center justify-center">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							We're a passionate team of builders, dreamers, and changemakers
							dedicated to making fundraising accessible to everyone.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{team.map((member, index) => (
							<Card key={index} className="text-center">
								<CardContent className="pt-6">
									<Image
										src={member.image || "/placeholder.svg"}
										alt={member.name}
										width={150}
										height={150}
										className="rounded-full mx-auto mb-4"
									/>
									<h3 className="font-semibold text-lg mb-1">{member.name}</h3>
									<p className="text-primary text-sm mb-3">{member.role}</p>
									<p className="text-sm text-muted-foreground">{member.bio}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 flex items-center justify-center">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Values</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							These core principles guide everything we do and shape how we
							serve our community.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<Card>
							<CardHeader>
								<Heart className="h-8 w-8 text-red-500 mb-2" />
								<CardTitle>Empathy First</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									We lead with empathy, understanding that behind every campaign
									is a real person with real dreams and challenges.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Shield className="h-8 w-8 text-blue-500 mb-2" />
								<CardTitle>Trust & Transparency</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									We maintain the highest standards of transparency and security
									to earn and keep the trust of our community.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Star className="h-8 w-8 text-yellow-500 mb-2" />
								<CardTitle>Excellence</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									We strive for excellence in everything we do, continuously
									improving our platform and support.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-primary text-primary-foreground flex items-center justify-center">
				<div className="container text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Make Your Impact?
					</h2>
					<p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
						Join thousands of creators and supporters who are already making
						positive change happen through CrowdFund.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" variant="secondary">
							<Link href="/register">Get Started Today</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="border-primary-foreground text-muted-foreground hover:bg-primary-foreground hover:text-primary"
						>
							<Link href="/contact">Contact Us</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
