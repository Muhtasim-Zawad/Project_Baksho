import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Box } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-muted/50 border-t flex items-center justify-center">
			<div className="container py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Box className="h-6 w-6 text-primary" />
							<span className="text-xl font-bold">Baksho</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Empowering dreams and making positive change possible through
							community support.
						</p>
						<div className="flex gap-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Facebook className="h-4 w-4" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Twitter className="h-4 w-4" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Instagram className="h-4 w-4" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Linkedin className="h-4 w-4" />
							</Link>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold">For Fundraisers</h3>
						<div className="space-y-2 text-sm">
							<Link
								href="/campaigns/create"
								className="block text-muted-foreground hover:text-primary"
							>
								Start a Campaign
							</Link>
							<Link
								href="/fundraising-tips"
								className="block text-muted-foreground hover:text-primary"
							>
								Fundraising Tips
							</Link>
							<Link
								href="/success-stories"
								className="block text-muted-foreground hover:text-primary"
							>
								Success Stories
							</Link>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold">For Donors</h3>
						<div className="space-y-2 text-sm">
							<Link
								href="/campaigns"
								className="block text-muted-foreground hover:text-primary"
							>
								Browse Campaigns
							</Link>
							<Link
								href="/categories"
								className="block text-muted-foreground hover:text-primary"
							>
								Categories
							</Link>
							<Link
								href="/how-it-works"
								className="block text-muted-foreground hover:text-primary"
							>
								How It Works
							</Link>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold">Support</h3>
						<div className="space-y-2 text-sm">
							<Link
								href="/help"
								className="block text-muted-foreground hover:text-primary"
							>
								Help Center
							</Link>
							<Link
								href="/contact"
								className="block text-muted-foreground hover:text-primary"
							>
								Contact Us
							</Link>
							<Link
								href="/privacy"
								className="block text-muted-foreground hover:text-primary"
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms"
								className="block text-muted-foreground hover:text-primary"
							>
								Terms of Service
							</Link>
						</div>
					</div>
				</div>

				<div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} Baksho. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
