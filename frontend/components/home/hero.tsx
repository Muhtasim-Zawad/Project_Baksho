import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
	return (
		<section className="relative py-20 md:py-32 overflow-hidden flex items-center justify-center">
			<div className="container relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
						Turn Your Dreams Into <span className="text-primary">Reality</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of creators and supporters making positive change
						happen. Start your campaign or support causes you believe in.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="text-lg px-8">
							<Link href="/campaigns/create">
								Start Your Campaign
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="text-lg px-8"
						>
							<Link href="/campaigns">Browse Campaigns</Link>
						</Button>
					</div>
					<div className="mt-12 flex items-center justify-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span>$2.5M+ raised</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span>10K+ campaigns</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							<span>50K+ supporters</span>
						</div>
					</div>
				</div>
			</div>

			{/* Background decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl"></div>
				</div>
			</div>
		</section>
	);
}
