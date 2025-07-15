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
		name: "Sarah Johnson",
		role: "CEO & Co-Founder",
		image: "/placeholder.svg?height=150&width=150",
		bio: "Former nonprofit director with 10+ years in social impact and technology.",
	},
	{
		name: "Michael Chen",
		role: "CTO & Co-Founder",
		image: "/placeholder.svg?height=150&width=150",
		bio: "Tech veteran who previously built fintech platforms at major companies.",
	},
	{
		name: "Emily Rodriguez",
		role: "Head of Community",
		image: "/placeholder.svg?height=150&width=150",
		bio: "Community building expert passionate about connecting people with causes.",
	},
	{
		name: "David Kim",
		role: "Head of Product",
		image: "/placeholder.svg?height=150&width=150",
		bio: "Product strategist focused on creating meaningful user experiences.",
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
