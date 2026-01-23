import { FetchPost } from "./httpClient";

export async function apiLogin(email: string, password: string) {
    try {
        const res = await FetchPost<{ user: any, accessToken: string }>('/login', {
            email,
            password
        });

        return res;
    } catch {
        localStorage.clear()
        window.location.href = '/login';
    }
}