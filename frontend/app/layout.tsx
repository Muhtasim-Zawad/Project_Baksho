import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Baksho - Make Dreams Reality",
	description: "A modern crowdfunding platform to support innovative projects",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<html lang="en">
				<body className={inter.className}>
					<AuthProvider>
						<NotificationProvider>
							<Navbar />
							{children}
							<Footer />
							<Toaster />
						</NotificationProvider>
					</AuthProvider>
				</body>
			</html>
		</ThemeProvider>
	);
}
