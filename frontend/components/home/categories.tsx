import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
	GraduationCap,
	Heart,
	Briefcase,
	Palette,
	Leaf,
	Users,
	Stethoscope,
	Home,
} from "lucide-react";

const categories = [
	{
		name: "Education",
		icon: GraduationCap,
		count: "1,234",
		color: "text-blue-600",
	},
	{
		name: "Health",
		icon: Stethoscope,
		count: "856",
		color: "text-red-600",
	},
	{
		name: "Business",
		icon: Briefcase,
		count: "642",
		color: "text-green-600",
	},
	{
		name: "Creative",
		icon: Palette,
		count: "789",
		color: "text-purple-600",
	},
	{
		name: "Environment",
		icon: Leaf,
		count: "423",
		color: "text-emerald-600",
	},
	{
		name: "Community",
		icon: Users,
		count: "567",
		color: "text-orange-600",
	},
	{
		name: "Emergency",
		icon: Heart,
		count: "234",
		color: "text-pink-600",
	},
	{
		name: "Housing",
		icon: Home,
		count: "345",
		color: "text-indigo-600",
	},
];

export function Categories() {
	return (
		<section className="py-16 bg-muted/50 flex items-center justify-center">
			<div className="container">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Find campaigns that match your interests and make a difference in
						areas you care about
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{categories.map((category) => (
						<Link
							key={category.name}
							href={`/campaigns?category=${category.name.toLowerCase()}`}
						>
							<Card className="hover:shadow-md transition-shadow cursor-pointer">
								<CardContent className="p-6 text-center">
									<category.icon
										className={`h-8 w-8 mx-auto mb-3 ${category.color}`}
									/>
									<h3 className="font-semibold mb-1">{category.name}</h3>
									<p className="text-sm text-muted-foreground">
										{category.count} campaigns
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
