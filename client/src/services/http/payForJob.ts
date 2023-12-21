import {JOBS} from "../../endpoints.ts";

export async function payForJob(jobId: string, userId: string) {
    const requestInit = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'profile_id': userId,
        },
        cors: true,
    }

    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + JOBS + "/" + jobId + "/pay",
        requestInit
    )

    if (response.ok) {
        return
    }

    const text = await response.text()
    throw new Error(text)
}
