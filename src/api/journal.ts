const API_BASE = "http://localhost:3001/api/journal";

export type JournalEntry = {
    id: number;
    api_drink_id: string;
    api_source: string;
    notes: string | null;
    rating: number | null;
    drank_at: string;
    created_at: string;
};

export async function getEntries(token: string): Promise<JournalEntry[]> {
    const res = await fetch(`${API_BASE}/entries`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to load entries");
    }

    return data;
}

export async function addEntry(params: {
    token: string;
    apiDrinkId: string;
    apiSource: string;
    notes?: string;
    rating?: number | null;
    drankAt?: string;
}): Promise<{ id: number }> {
    const { token, ...body } = params;

    const res = await fetch(`${API_BASE}/entries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to add drink");
    }

    return data;
}
