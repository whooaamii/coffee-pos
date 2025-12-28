"use client";

import { createContext, useContext } from "react";
import type { User, Role } from "@prisma/client";

type AuthContextType = {
  user: User;
  role: Role;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user, role: user.role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
