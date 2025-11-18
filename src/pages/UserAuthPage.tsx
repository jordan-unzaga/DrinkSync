import React, { useState } from "react";
import { loginApi, registerApi, type User } from "../api/auth";

type Props = {
    onClose: () => void;
    onAuthSuccess: (user: User, token: string) => void;
};

export const UserAuthPage: React.FC<Props> = ({ onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "login") {
                const res = await loginApi(identifier, password);
                localStorage.setItem("auth", JSON.stringify(res));
                onAuthSuccess(res.user, res.token);
            } else {
                const res = await registerApi(username, email, password);
                localStorage.setItem("auth", JSON.stringify(res));
                onAuthSuccess(res.user, res.token);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999
            }}
        >
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={mode === "login" ? "tab active" : "tab"}
                        type="button"
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                    <button
                        className={mode === "register" ? "tab active" : "tab"}
                        type="button"
                        onClick={() => setMode("register")}
                    >
                        Create Account
                    </button>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === "login" ? (
                        <>
                            <label>
                                Username or Email
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <label>
                                Username
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? mode === "login"
                                ? "Logging in..."
                                : "Creating..."
                            : mode === "login"
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={onClose}
                    style={{ marginTop: "0.75rem", width: "100%" }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
