"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import { axiosPrivate } from "@/hooks/useAxiosPrivate";

export type UserRole = "user" | "admin";
export interface SocialMedia {
	twitter: string;
	facebook: string;
	instagram: string;
	linkedin: string;
}

export interface User {
	_id: string;
	email: string;
	name: string;
	role: UserRole;
	avatar?: string;
	preferences?: string[];
	isbanned: boolean;
	lastLogin: Date;
	socialMedia: SocialMedia;
	website: string;
	bio: string;
	location: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		name: string
		//role: UserRole
	) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				setLoading(false);
				return;
			}

			try {
				const res = await axiosPrivate.get("/api/users/get-profile");
				if (res.status === 200) {
					setUser(res.data);
				}
			} catch (error: any) {
				console.error("Failed to fetch user profile:", error);
				if (error.response?.status === 401) {
					logout();
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const res = await axiosPublic.post("/api/users/auth/login", {
				email,
				password,
			});
			if (res.status == 200) {
				const { accessToken, refreshToken, user } = res?.data;

				localStorage.setItem("accessToken", accessToken);
				localStorage.setItem("refreshToken", refreshToken);
				setUser(user);
			}
			console.log(res);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to create account.";
			throw new Error(message);
		} finally {
			setLoading(false);
		}
	};

	const register = async (email: string, password: string, name: string) => {
		setLoading(true);
		try {
			const res = await axiosPublic.post("/api/users/auth/signup", {
				email,
				password,
				name,
			});

			if (res.status === 201) {
				const { accessToken, refreshToken, user } = res.data;

				localStorage.setItem("accessToken", accessToken);
				localStorage.setItem("refreshToken", refreshToken);
				setUser(user);
			}
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to create account.";
			throw new Error(message);
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
