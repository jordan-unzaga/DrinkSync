import React, { useEffect, useState } from "react";
import { getEntries, JournalEntry } from "../api/journal";

type Props = {
    token: string;
};

export const MyDrinksPage: React.FC<Props> = ({ token }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getEntries(token);
                setEntries(data);
            } catch (err: any) {
                setError(err.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    if (loading) return <p>Loading drinks...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!entries.length) return <p>No drinks logged yet.</p>;

    return (
        <div>
            <h2>My Drinks</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {entries.map((e) => (
                    <li
                        key={e.id}
                        style={{
                            padding: "0.75rem",
                            borderBottom: "1px solid #ddd",
                            marginBottom: "0.5rem"
                        }}
                    >
                        <strong>{e.api_source}</strong> – {e.api_drink_id}
                        <div>
                            {e.rating != null && <span>Rating: {e.rating}</span>}
                            {e.notes && <p>{e.notes}</p>}
                        </div>
                        <small>Drank at: {new Date(e.drank_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};
