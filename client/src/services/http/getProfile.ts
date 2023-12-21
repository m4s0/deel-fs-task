import {PROFILES} from "../../endpoints.ts";
import {Profile} from "../../types.ts";

export async function getProfile(id: string): Promise<Profile> {
    const requestInit = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        cors: true
    }

    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + PROFILES + "/" + id,
        requestInit
    )

    if (response.ok) {
        return await response.json()
    }

    const text = await response.text()
    throw new Error(text)
}
