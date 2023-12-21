import {createContext} from "react";
import {Profile} from "../types.ts";

export interface AuthContextType {
    user: Profile | null;
    refreshUser: () => void;
    signIn: (id: string) => void;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);
