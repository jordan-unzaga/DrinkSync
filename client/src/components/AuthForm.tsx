import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.success) navigate("/drinkpage");
        else alert(data.message || "Something went wrong");
    };

    return (
        <div className="auth_page">
            <div className="auth_card">
                <h2 className="auth_title">DrinkSync</h2>
                <p className="auth_subtitle">Login or create an account</p>

                <form className="auth_form" onSubmit={handleSubmit}>
                    <div className="auth_field">
                        <label className="auth_label">Username</label>
                        <input
                            className="auth_input"
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="auth_field">
                        <label className="auth_label">Password</label>
                        <input
                            className="auth_input"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="auth_primary_actions">
                        <button
                            type="submit"
                            className="auth_button_primary"
                            onClick={() => setAction("login")}
                        >
                            Login
                        </button>

                        <button
                            type="submit"
                            className="auth_button_primary"
                            onClick={() => setAction("register")}
                        >
                            Register
                        </button>
                    </div>

                    <div className="auth_guest_action">
                        <button
                            type="button"
                            className="auth_button_ghost"
                            onClick={() => navigate("/drinkpage?guest=1")}
                        >
                            Continue as Guest
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
