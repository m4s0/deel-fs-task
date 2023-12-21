import {JOBS} from "../../endpoints.ts";
import {Job} from "../../types.ts";

export async function getJobsBelongsToContractor(profileId: string | null): Promise<Job[]> {
    const requestInit = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'profile_id': profileId,
        },
        cors: true
    }

    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + JOBS,
        requestInit
    )

    if (response.ok) {
        return await response.json()
    }

    const text = await response.text()
    throw new Error(text)
}
