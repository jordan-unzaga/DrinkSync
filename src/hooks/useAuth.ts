import { useEffect, useState } from "react";

export type AuthUser = {
    id: number;
    username: string;
    email: string;
};

const STORAGE_KEY = "auth";

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setUser(parsed.user);
                setToken(parsed.token);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    function login(user: AuthUser, token: string) {
        setUser(user);
        setToken(token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    return { user, token, login, logout };
}
