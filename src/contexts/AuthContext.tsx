import { createContext } from "react";

export type User = {
    createdAt: string;
    email: string;
    name: string;
    password: string;
    user_id: string;
}

export type AuthContextType = {
    user: User | null;
    token: string | null;
    signin: (email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>(null!);