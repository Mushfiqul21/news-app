"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type AuthResponse = { user: User; token: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Page load e saved token thakle verify kore user ke ano
  useEffect(() => {
    const saved = localStorage.getItem("token");

    if (!saved) {
      setLoading(false);
      return;
    }

    apiFetch<User>("/me", { token: saved })
      .then((u) => {
        setToken(saved);
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("token"); // token expire/invalid
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function register(data: RegisterData) {
    const res = await apiFetch<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    try {
      await apiFetch("/logout", { method: "POST", token });
    } catch {
      // server e fail korleo local logout hobe
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}