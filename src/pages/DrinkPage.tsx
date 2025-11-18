import { useEffect, useRef, useState } from "react";
import { fetchDrinks, type Drink } from "../api/fetchDrinks";
import { DrinkCard } from "../components/DrinkCard";
import { Navbar } from "../components/Navbar";
import "../styles/DrinkCard.css";
import "../styles/Navbar.css";


export function DrinkPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const { drinks: newDrinks, totalPages } = await fetchDrinks(
                    page
                );
                if (cancelled) return;
                console.log(drinks)

                setDrinks((prev) => [...prev, ...newDrinks]);
                setTotalPages(totalPages);
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message ?? "Unknown error");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page]);

    useEffect(() => {
        const target = sentinelRef.current;
        if (!target) return;

        if (totalPages !== null && page >= totalPages) return;

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !loading) {
                setPage((p) => p + 1);
            }
        });

        observer.observe(target);
        return () => observer.disconnect();
    }, [loading, page, totalPages]);

    return (
        <>
            <Navbar />
            <div className="drink_page">
                {error && <p className="error_text">API error: {error}</p>}

                <p className="debug_text">
                    Debug: drinks={drinks.length} page={page}
                </p>

                <ul className="drink_list">
                    {drinks.map((drink, i) => (
                        <DrinkCard key={i} {...drink} />
                    ))}
                </ul>

                <div ref={sentinelRef} style={{ height: 1 }} />

                {loading && <p className="loading_text">Loading more…</p>}
            </div>
        </>
    );
}
