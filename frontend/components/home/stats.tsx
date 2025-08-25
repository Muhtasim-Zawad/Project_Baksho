import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Target, TrendingUp } from "lucide-react";

const stats = [
	{
		icon: DollarSign,
		value: "$2.5M+",
		label: "Total Raised",
		description: "Funds raised for amazing causes",
	},
	{
		icon: Users,
		value: "50K+",
		label: "Active Users",
		description: "Supporters making a difference",
	},
	{
		icon: Target,
		value: "10K+",
		label: "Campaigns",
		description: "Projects funded successfully",
	},
	{
		icon: TrendingUp,
		value: "85%",
		label: "Success Rate",
		description: "Campaigns reaching their goals",
	},
];

export function Stats() {
	return (
		<section className="py-16 bg-primary text-primary-foreground flex items-center justify-center">
			<div className="container">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Making Impact Together</h2>
					<p className="text-primary-foreground/80 max-w-2xl mx-auto">
						Join a community that believes in the power of collective action
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<Card
							key={index}
							className="bg-primary-foreground/10 border-primary-foreground/20"
						>
							<CardContent className="p-6 text-center">
								<stat.icon className="h-8 w-8 mx-auto mb-4 text-primary-foreground" />
								<div className="text-3xl font-bold mb-2">{stat.value}</div>
								<div className="font-semibold mb-1">{stat.label}</div>
								<div className="text-sm text-primary-foreground/70">
									{stat.description}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
