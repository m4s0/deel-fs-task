import {LOGIN} from "../../endpoints.ts";

export async function login(id: string): Promise<void> {
    const requestInit = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        cors: true,
        body: JSON.stringify({id: id}),
    }

    const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + LOGIN,
        requestInit
    )

    if (response.ok) {
        return
    }

    const text = await response.text()
    throw new Error(text)
}
