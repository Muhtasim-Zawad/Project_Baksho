"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import { axiosPrivate } from "@/hooks/useAxiosPrivate";

// --- Supporting Types ---
export interface CampaignUpdate {
	id: string;
	content: string;
	date: Date;
}

export interface FAQ {
	question: string;
	answer: string;
}

export type CampaignStatus =
	| "draft"
	| "pending"
	| "active"
	| "completed"
	| "suspended"
	| "failed";

export interface Campaign {
	id: string;
	title: string;
	description: string;
	story: string;
	category: string;
	tags: string[];
	goalAmount: number;
	currentAmount: number;
	startDate: Date;
	endDate: Date;
	status: CampaignStatus;
	isFeatured: boolean;
	isUrgent: boolean;
	risks: string;
	timeline: string;
	location: string;
	organizerId: string;
	images: string[];
	updates: CampaignUpdate[];
	faqs: FAQ[];
	stats: {
		backersCount: number;
		commentsCount: number;
		sharesCount: number;
		likesCount: number;
	};
	createdAt: Date;
	updatedAt: Date;
}

interface CampaignContextType {
	campaigns: Campaign[];
	loading: boolean;
	createCampaign: (data: Partial<Campaign>) => Promise<void>;
	approveCampaign: (id: string) => Promise<void>;
	rejectCampaign: (id: string, reason?: string) => Promise<void>;
	updateCampaignInfo: (id: string, updates: Partial<Campaign>) => Promise<void>;
	fetchCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
	undefined
);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchCampaigns = async () => {
		setLoading(true);
		try {
			const res = await axiosPublic.get("/api/campaigns");
			if (res.status === 200) {
				setCampaigns(res.data);
			}
		} catch (error) {
			console.error("Failed to fetch campaigns:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CampaignContext.Provider
			value={{
				campaigns,
				loading,
				createCampaign,
				approveCampaign,
				rejectCampaign,
				updateCampaignInfo,
				fetchCampaigns,
			}}
		>
			{children}
		</CampaignContext.Provider>
	);
}

export function useCampaign() {
	const context = useContext(CampaignContext);
	if (context === undefined) {
		throw new Error("useCampaign must be used within a CampaignProvider");
	}
	return context;
}
