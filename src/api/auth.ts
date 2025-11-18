export type User = {
    id: number;
    username: string;
    email: string;
};

export type AuthResponse = {
    token: string;
    user: User;
};

const API_BASE = "http://localhost:3001/api/auth";

export async function loginApi(identifier: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
}

export async function registerApi(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
}
