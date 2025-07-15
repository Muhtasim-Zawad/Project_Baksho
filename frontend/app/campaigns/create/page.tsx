"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
	"Education",
	"Health",
	"Business",
	"Creative",
	"Environment",
	"Community",
	"Emergency",
	"Technology",
];

interface IncentiveTier {
	id: string;
	amount: number;
	title: string;
	description: string;
	estimatedDelivery: string;
	quantity?: number;
}

export default function CreateCampaignPage() {
	const { user } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		goal: "",
		duration: "30",
		location: "",
		story: "",
		risks: "",
		timeline: "",
	});

	const [incentiveTiers, setIncentiveTiers] = useState<IncentiveTier[]>([]);
	const [newTier, setNewTier] = useState<Partial<IncentiveTier>>({
		amount: 0,
		title: "",
		description: "",
		estimatedDelivery: "",
		quantity: undefined,
	});

	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Authentication Required</CardTitle>
						<CardDescription>
							Please log in to create a campaign
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<a href="/login">Log In</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			// Mock image upload - in real app, upload to cloud storage
			const newImages = Array.from(files).map(
				(file, index) =>
					`/placeholder.svg?height=200&width=400&text=${file.name}`
			);
			setUploadedImages([...uploadedImages, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		setUploadedImages(uploadedImages.filter((_, i) => i !== index));
	};

	const addIncentiveTier = () => {
		if (newTier.amount && newTier.title && newTier.description) {
			const tier: IncentiveTier = {
				id: Date.now().toString(),
				amount: newTier.amount,
				title: newTier.title,
				description: newTier.description,
				estimatedDelivery: newTier.estimatedDelivery || "",
				quantity: newTier.quantity,
			};
			setIncentiveTiers([...incentiveTiers, tier]);
			setNewTier({
				amount: 0,
				title: "",
				description: "",
				estimatedDelivery: "",
				quantity: undefined,
			});
		}
	};

	const removeTier = (id: string) => {
		setIncentiveTiers(incentiveTiers.filter((tier) => tier.id !== id));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual submission
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast({
				title: "Campaign Created!",
				description: "Your campaign has been submitted for review.",
			});

			router.push("/organizer/dashboard");
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create campaign. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const steps = [
		{ title: "Basic Info", description: "Campaign details" },
		{ title: "Story & Media", description: "Tell your story" },
		{ title: "Incentives", description: "Reward your backers" },
		{ title: "Review", description: "Final review" },
	];

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
			<div className="container py-8 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Create Your Campaign</h1>
					<p className="text-muted-foreground">
						Share your vision and start raising funds for your project
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						{steps.map((step, index) => (
							<div key={index} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
										index <= currentStep
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{index + 1}
								</div>
								<div className="ml-2 hidden sm:block">
									<p className="text-sm font-medium">{step.title}</p>
									<p className="text-xs text-muted-foreground">
										{step.description}
									</p>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`w-12 h-0.5 mx-4 ${
											index < currentStep ? "bg-primary" : "bg-muted"
										}`}
									/>
								)}
							</div>
						))}
					</div>
					<Progress value={(currentStep / (steps.length - 1)) * 100} />
				</div>

				<Tabs value={currentStep.toString()} className="space-y-6">
					{/* Step 1: Basic Info */}
					<TabsContent value="0">
						<Card>
							<CardHeader>
								<CardTitle>Basic Campaign Information</CardTitle>
								<CardDescription>
									Let's start with the essentials of your campaign
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="title">Campaign Title *</Label>
									<Input
										id="title"
										placeholder="Give your campaign a compelling title"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Short Description *</Label>
									<Textarea
										id="description"
										placeholder="Briefly describe what your campaign is about"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="category">Category *</Label>
										<Select
											value={formData.category}
											onValueChange={(value) =>
												setFormData({ ...formData, category: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="location">Location</Label>
										<Input
											id="location"
											placeholder="Where is your project located?"
											value={formData.location}
											onChange={(e) =>
												setFormData({ ...formData, location: e.target.value })
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="goal">Funding Goal ($) *</Label>
										<div className="relative">
											<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												id="goal"
												type="number"
												placeholder="0"
												className="pl-10"
												value={formData.goal}
												onChange={(e) =>
													setFormData({ ...formData, goal: e.target.value })
												}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="duration">Campaign Duration (days)</Label>
										<Select
											value={formData.duration}
											onValueChange={(value) =>
												setFormData({ ...formData, duration: value })
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="15">15 days</SelectItem>
												<SelectItem value="30">30 days</SelectItem>
												<SelectItem value="45">45 days</SelectItem>
												<SelectItem value="60">60 days</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Step 2: Story & Media */}
					<TabsContent value="1">
						<Card>
							<CardHeader>
								<CardTitle>Tell Your Story</CardTitle>
								<CardDescription>
									Share the details and upload media to make your campaign
									compelling
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="story">Campaign Story *</Label>
									<Textarea
										id="story"
										placeholder="Tell the full story of your campaign. What problem are you solving? Why should people support you?"
										value={formData.story}
										onChange={(e) =>
											setFormData({ ...formData, story: e.target.value })
										}
										rows={8}
									/>
								</div>

								<div className="space-y-2">
									<Label>Campaign Images</Label>
									<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
										<div className="text-center">
											<Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
											<div className="mt-4">
												<label htmlFor="images" className="cursor-pointer">
													<span className="mt-2 block text-sm font-medium text-primary hover:text-primary/80">
														Upload images
													</span>
													<input
														id="images"
														type="file"
														multiple
														accept="image/*"
														className="hidden"
														onChange={handleImageUpload}
													/>
												</label>
												<p className="mt-1 text-xs text-muted-foreground">
													PNG, JPG, GIF up to 10MB each
												</p>
											</div>
										</div>
									</div>

									{uploadedImages.length > 0 && (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
											{uploadedImages.map((image, index) => (
												<div key={index} className="relative">
													<img
														src={image || "/placeholder.svg"}
														alt={`Upload ${index + 1}`}
														className="w-full h-32 object-cover rounded-lg"
													/>
													<Button
														variant="destructive"
														size="icon"
														className="absolute top-2 right-2 h-6 w-6"
														onClick={() => removeImage(index)}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											))}
										</div>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="risks">Risks & Challenges</Label>
									<Textarea
										id="risks"
										placeholder="What are the potential risks and how will you address them?"
										value={formData.risks}
										onChange={(e) =>
											setFormData({ ...formData, risks: e.target.value })
										}
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="timeline">Project Timeline</Label>
									<Textarea
										id="timeline"
										placeholder="What's your timeline for completing this project?"
										value={formData.timeline}
										onChange={(e) =>
											setFormData({ ...formData, timeline: e.target.value })
										}
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Step 3: Incentives */}
					<TabsContent value="2">
						<Card>
							<CardHeader>
								<CardTitle>Incentive Tiers</CardTitle>
								<CardDescription>
									Create rewards to thank your supporters
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Add New Tier */}
								<div className="border rounded-lg p-4 space-y-4">
									<h3 className="font-medium">Add Incentive Tier</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="tierAmount">Minimum Donation ($)</Label>
											<Input
												id="tierAmount"
												type="number"
												placeholder="25"
												value={newTier.amount || ""}
												onChange={(e) =>
													setNewTier({
														...newTier,
														amount: Number(e.target.value),
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="tierQuantity">Quantity (optional)</Label>
											<Input
												id="tierQuantity"
												type="number"
												placeholder="Unlimited"
												value={newTier.quantity || ""}
												onChange={(e) =>
													setNewTier({
														...newTier,
														quantity: Number(e.target.value) || undefined,
													})
												}
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="tierTitle">Reward Title</Label>
										<Input
											id="tierTitle"
											placeholder="Thank you postcard"
											value={newTier.title || ""}
											onChange={(e) =>
												setNewTier({ ...newTier, title: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="tierDescription">Description</Label>
										<Textarea
											id="tierDescription"
											placeholder="Describe what supporters will receive"
											value={newTier.description || ""}
											onChange={(e) =>
												setNewTier({ ...newTier, description: e.target.value })
											}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="tierDelivery">Estimated Delivery</Label>
										<Input
											id="tierDelivery"
											placeholder="March 2024"
											value={newTier.estimatedDelivery || ""}
											onChange={(e) =>
												setNewTier({
													...newTier,
													estimatedDelivery: e.target.value,
												})
											}
										/>
									</div>
									<Button onClick={addIncentiveTier} className="w-full">
										<Plus className="h-4 w-4 mr-2" />
										Add Tier
									</Button>
								</div>

								{/* Existing Tiers */}
								{incentiveTiers.length > 0 && (
									<div className="space-y-4">
										<h3 className="font-medium">Your Incentive Tiers</h3>
										{incentiveTiers.map((tier) => (
											<div key={tier.id} className="border rounded-lg p-4">
												<div className="flex items-start justify-between">
													<div className="space-y-2 flex-1">
														<div className="flex items-center gap-2">
															<Badge variant="outline">${tier.amount}+</Badge>
															{tier.quantity && (
																<Badge variant="secondary">
																	Limited: {tier.quantity}
																</Badge>
															)}
														</div>
														<h4 className="font-medium">{tier.title}</h4>
														<p className="text-sm text-muted-foreground">
															{tier.description}
														</p>
														{tier.estimatedDelivery && (
															<p className="text-xs text-muted-foreground">
																Estimated delivery: {tier.estimatedDelivery}
															</p>
														)}
													</div>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => removeTier(tier.id)}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Step 4: Review */}
					<TabsContent value="3">
						<Card>
							<CardHeader>
								<CardTitle>Review Your Campaign</CardTitle>
								<CardDescription>
									Review all details before submitting for approval
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<Alert>
									<AlertDescription>
										Your campaign will be reviewed by our team before going
										live. This usually takes 1-2 business days.
									</AlertDescription>
								</Alert>

								<div className="space-y-4">
									<div>
										<h3 className="font-semibold mb-2">Campaign Details</h3>
										<div className="bg-muted/50 rounded-lg p-4 space-y-2">
											<p>
												<strong>Title:</strong> {formData.title}
											</p>
											<p>
												<strong>Category:</strong> {formData.category}
											</p>
											<p>
												<strong>Goal:</strong> ${formData.goal}
											</p>
											<p>
												<strong>Duration:</strong> {formData.duration} days
											</p>
											<p>
												<strong>Location:</strong> {formData.location}
											</p>
										</div>
									</div>

									<div>
										<h3 className="font-semibold mb-2">Story</h3>
										<div className="bg-muted/50 rounded-lg p-4">
											<p className="text-sm">{formData.story}</p>
										</div>
									</div>

									<div>
										<h3 className="font-semibold mb-2">Media</h3>
										<div className="bg-muted/50 rounded-lg p-4">
											<p className="text-sm">
												{uploadedImages.length} images uploaded
											</p>
										</div>
									</div>

									<div>
										<h3 className="font-semibold mb-2">Incentive Tiers</h3>
										<div className="bg-muted/50 rounded-lg p-4">
											<p className="text-sm">
												{incentiveTiers.length} tiers created
											</p>
										</div>
									</div>
								</div>

								<Button
									onClick={handleSubmit}
									className="w-full"
									size="lg"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Submitting..." : "Submit for Review"}
								</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Navigation */}
				<div className="flex justify-between mt-8">
					<Button
						variant="outline"
						onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
						disabled={currentStep === 0}
					>
						Previous
					</Button>
					<Button
						onClick={() =>
							setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
						}
						disabled={currentStep === steps.length - 1}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
