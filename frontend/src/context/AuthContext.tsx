import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const res = await api.get("/auth/me");
      console.log("AUTH ME RESPONSE:", res.data);
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function login(email: string, password: string) {
    await api.post("/auth/login", { email, password });
    await fetchMe();
  }

  async function signup(fullName: string, email: string, password: string) {
    await api.post("/auth/signup", { fullName, email, password });
    await fetchMe();
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
