import {AuthContext, AuthContextType} from "./AuthContext.tsx";
import {useContext} from "react";

export function useAuth(): AuthContextType {
    return useContext(AuthContext);
}
