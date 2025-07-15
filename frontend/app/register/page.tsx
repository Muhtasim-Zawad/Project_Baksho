"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, type UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "user" as UserRole,
	});
	const [error, setError] = useState("");
	const { register, loading } = useAuth();
	const router = useRouter();
	const { toast } = useToast();


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		try {
			await register(
				formData.email,
				formData.password,
				formData.name,
			);
			toast({
				title: "Account created!",
				description:
					"Welcome to CrowdFund. Let's make dreams reality together.",
			});
			router.push("/user/dashboard");
		} catch (err: any) {
			setError(err.message || "Failed to create account. Please try again.");
		}
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<Box className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-2xl">Join CrowdFund</CardTitle>
					<CardDescription>
						Create your account to start making a difference
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								placeholder="Enter your full name"
								value={formData.name}
								onChange={(e) =>{
									setFormData({ ...formData, name: e.target.value })
									setError('');
								}
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={(e) =>{
									setFormData({ ...formData, email: e.target.value })
									setError('')
								}
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Create a password"
								value={formData.password}
								onChange={(e) =>{
									setFormData({ ...formData, password: e.target.value })
									setError('');
								}
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm your password"
								value={formData.confirmPassword}
								onChange={(e) =>{
									setFormData({ ...formData, confirmPassword: e.target.value })
									setError('');
								}
								}
								required
							/>
						</div>

					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Account
						</Button>
						<div className="text-center text-sm">
							<span className="text-muted-foreground">
								Already have an account?{" "}
							</span>
							<Link href="/login" className="text-primary hover:underline">
								Sign in
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
