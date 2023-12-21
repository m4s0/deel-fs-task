import {DEPOSIT} from "../../endpoints.ts";

export async function deposit(amount: number, userId: string): Promise<void> {
    const requestInit = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'profile_id': userId,
        },
        cors: true,
        body: JSON.stringify({amount: amount}),
    }

    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + DEPOSIT + "/" + userId,
        requestInit
    )

    if (response.ok) {
        return
    }

    const text = await response.text()
    throw new Error(text)
}
