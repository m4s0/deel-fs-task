import {getItem, removeItem, setItem} from "../services/storage.ts";
import {Profile} from "../types.ts";
import {AuthContext} from "./AuthContext.tsx";
import {login} from "../services/http/login.ts";
import {getProfile} from "../services/http/getProfile.ts";
import {ReactNode, useState} from "react";

const key = "profile_id";

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null);

    const refreshUser = async () => {
        const id = getItem(key);
        if (!id) {
            throw Error('profile_id is null')
        }

        const user = await getProfile(id);
        setUser(user)
    };

    const signIn = async (id: string) => {
        await login(id)
        setItem(key, id)
        await refreshUser()
    };

    const signOut = () => {
        removeItem(key)
    };

    const value = {user, refreshUser, signIn, signOut};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
