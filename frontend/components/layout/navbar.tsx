"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Box, Menu, Package, Plus, Search } from "lucide-react";
import { NotificationPanel } from "@/components/notifications/notification-panel";

export function Navbar() {
	const { user, logout } = useAuth();
	const { notifications } = useNotifications();
	const [showNotifications, setShowNotifications] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const getDashboardLink = () => {
		if (!user) return "/login";
		switch (user.role) {
			case "admin":
				return "/admin/dashboard";
			case "organizer":
				return "/organizer/dashboard";
			default:
				return "/donor/dashboard";
		}
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-2">
						<Box className="h-6 w-6 text-primary" />
						<span className="text-xl font-bold">Baksho</span>
					</Link>

					<div className="hidden md:flex items-center gap-6">
						<Link
							href="/campaigns"
							className="text-sm font-medium hover:text-primary"
						>
							Campaigns
						</Link>
						<Link
							href="/categories"
							className="text-sm font-medium hover:text-primary"
						>
							Categories
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium hover:text-primary"
						>
							About
						</Link>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" className="hidden md:flex">
						<Search className="h-4 w-4" />
					</Button>

					{user ? (
						<>
							<Button
								asChild
								variant="default"
								size="sm"
								className="hidden md:flex"
							>
								<Link href="/campaigns/create">
									<Plus className="h-4 w-4 mr-2" />
									Start Campaign
								</Link>
							</Button>

							<div className="relative">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowNotifications(!showNotifications)}
								>
									<Bell className="h-4 w-4" />
									{unreadCount > 0 && (
										<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
											{unreadCount}
										</Badge>
									)}
								</Button>
								{showNotifications && (
									<NotificationPanel
										onClose={() => setShowNotifications(false)}
									/>
								)}
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user.avatar || "/placeholder.svg"}
												alt={user.name}
											/>
											<AvatarFallback>
												{user.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href={getDashboardLink()}>Dashboard</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/profile">Profile</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/settings">Settings</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Button asChild variant="ghost" size="sm">
								<Link href="/login">Login</Link>
							</Button>
							<Button asChild size="sm">
								<Link href="/register">Sign Up</Link>
							</Button>
						</div>
					)}

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<div className="flex flex-col gap-4 mt-8">
								<Link href="/campaigns" className="text-sm font-medium">
									Campaigns
								</Link>
								<Link href="/categories" className="text-sm font-medium">
									Categories
								</Link>
								<Link href="/about" className="text-sm font-medium">
									About
								</Link>
								{user && (
									<Button asChild variant="default" size="sm">
										<Link href="/campaigns/create">
											<Plus className="h-4 w-4 mr-2" />
											Start Campaign
										</Link>
									</Button>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
