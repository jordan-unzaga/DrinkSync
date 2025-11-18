import React, { useState } from "react";
import { addEntry } from "../api/journal";

type Props = {
    token: string;
};

export const AddDrinkPage: React.FC<Props> = ({ token }) => {
    const [apiDrinkId, setApiDrinkId] = useState("");
    const [apiSource, setApiSource] = useState("external-api");
    const [notes, setNotes] = useState("");
    const [rating, setRating] = useState<number | "">("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        try {
            await addEntry({
                token,
                apiDrinkId,
                apiSource,
                notes,
                rating: rating === "" ? null : Number(rating)
            });
            setStatus("Drink saved!");
            setApiDrinkId("");
            setNotes("");
            setRating("");
        } catch (err: any) {
            setStatus(err.message || "Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Add Drink</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <label>
                    API Drink ID
                    <input
                        type="text"
                        value={apiDrinkId}
                        onChange={(e) => setApiDrinkId(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    API Source
                    <input
                        type="text"
                        value={apiSource}
                        onChange={(e) => setApiSource(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Rating (optional)
                    <input
                        type="number"
                        min={0}
                        max={10}
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value === "" ? "" : Number(e.target.value))
                        }
                    />
                </label>
                <br />
                <label>
                    Notes
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Drink"}
                </button>
                {status && <p>{status}</p>}
            </form>
        </div>
    );
};
