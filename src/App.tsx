import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { DrinkCard } from "./components/DrinkCard";
import { UserAuthPage } from "./pages/UserAuthPage";
import type { User } from "./api/auth";

type AuthState = {
    user: User | null;
    token: string | null;
};

const STORAGE_KEY = "auth";

const App: React.FC = () => {
    const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setAuth({ user: parsed.user, token: parsed.token });
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    function handleAuthSuccess(user: User, token: string) {
        setAuth({ user, token });
    }

    function handleLogout() {
        setAuth({ user: null, token: null });
        localStorage.removeItem(STORAGE_KEY);
    }

    const isLoggedIn = !!auth.user;

    const demoDrink = {
        name: "Test Drink",
        description: isLoggedIn
            ? "You are logged in — real journal entries come next."
            : "Login to start saving your drinks.",
        alcoholic: true,
        rating: 4.5,
        icon: "/empty.png"
    };

    return (
        <>
            <Navbar
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowAuth(true)}
                onLogoutClick={handleLogout}
            />

            <ul className="drink_list">
                <DrinkCard {...demoDrink} />
            </ul>

            {showAuth && (
                <UserAuthPage
                    onClose={() => setShowAuth(false)}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
        </>
    );
};

export default App;
