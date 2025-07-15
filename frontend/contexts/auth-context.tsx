"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "donor" | "organizer" | "admin";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	avatar?: string;
	preferences?: string[];
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		name: string,
		role: UserRole
	) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for stored user session
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			// Mock login - replace with actual API call
			const mockUser: User = {
				id: "1",
				email,
				name: email.split("@")[0],
				role: email.includes("admin") ? "admin" : "donor",
				avatar: "/placeholder-user.jpg?height=40&width=40",
			};
			setUser(mockUser);
			localStorage.setItem("user", JSON.stringify(mockUser));
		} finally {
			setLoading(false);
		}
	};

	const register = async (
		email: string,
		password: string,
		name: string,
		role: UserRole
	) => {
		setLoading(true);
		try {
			// Mock registration - replace with actual API call
			const mockUser: User = {
				id: Date.now().toString(),
				email,
				name,
				role,
				avatar: "/placeholder-user.jpg?height=40&width=40",
			};
			setUser(mockUser);
			localStorage.setItem("user", JSON.stringify(mockUser));
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
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
