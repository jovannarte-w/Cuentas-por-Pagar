"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  rol: "administrador" | "auxiliar" | "presidente" | "consulta";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de demostración para desarrollo
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@cenvalle.com": {
    password: "Cenvalle@Admin2024",
    user: {
      id: "0",
      email: "admin@cenvalle.com",
      name: "Administrador",
      rol: "administrador",
    },
  },
  "auxiliar@cenvalle.com": {
    password: "Auxiliar@Tesoreria2024",
    user: {
      id: "1",
      email: "auxiliar@cenvalle.com",
      name: "Auxiliar Contable",
      rol: "auxiliar",
    },
  },
  "presidente@cenvalle.com": {
    password: "Presidente@2024",
    user: {
      id: "2",
      email: "presidente@cenvalle.com",
      name: "Presidente",
      rol: "presidente",
    },
  },
  "gerenciageneral@cenvalle.com": {
    password: "Consulta@2024",
    user: {
      id: "3",
      email: "gerenciageneral@cenvalle.com",
      name: "Gerencia General",
      rol: "consulta",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email];

    if (!demoUser || demoUser.password !== password) {
      throw new Error("Email o contraseña incorrectos");
    }

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUser(demoUser.user);
    localStorage.setItem("auth_user", JSON.stringify(demoUser.user));
  };

  const register = async (email: string, password: string, name: string) => {
    if (DEMO_USERS[email]) {
      throw new Error("El email ya está registrado");
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      rol: "consulta", // Rol por defecto para nuevos usuarios
    };

    // Guardar en "base de datos" (localStorage)
    const users = JSON.parse(localStorage.getItem("registered_users") || "{}");
    users[email] = { password, user: newUser };
    localStorage.setItem("registered_users", JSON.stringify(users));

    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
