import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState<"login" | "register">("login");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const endpoint =
            action === "login"
                ? "https://csci331vm.cs.montana.edu/~w62q346/finalproject/drink-sync/server/login.php"
                : "https://csci331vm.cs.montana.edu/~w62q346/finalproject/drink-sync/server/register.php";

        const response = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            navigate("/drinkpage");
        } else {
            alert(data.message || "Something went wrong jit");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                        type="submit"
                        onClick={() => setAction("login")}
                        value="login"
                    >
                        Login
                    </button>

                    <button
                        type="submit"
                        onClick={() => setAction("register")}
                        value="register"
                    >
                        Register
                    </button>
                </div>

                <div style={{ marginTop: "16px" }}>
                    <button
                        type="button"
                        onClick={() => navigate("/drinkpage?guest=1")}
                    >
                        Continue as Guest
                    </button>
                </div>
            </form>
        </div>
    );
}
