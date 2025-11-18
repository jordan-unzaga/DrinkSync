import { useEffect, useRef, useState } from "react";
import {
    fetchDrinks,
    type Drink,
} from "../api/fetchDrinks";
import { DrinkCard } from "../components/DrinkCard";
import { Navbar } from "../components/Navbar";
import "../styles/DrinkCard.css";
import "../styles/Navbar.css";

const CACHE_KEY = "drink_page_state_v1";

type CachedState = {
    drinks: Drink[];
    page: number;
    totalPages: number | null;
    searchQuery: string;
};

export function DrinkPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [hasHydratedFromCache, setHasHydratedFromCache] = useState(false);
    const [shouldSkipNextLoad, setShouldSkipNextLoad] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
            try {
                const parsed: CachedState = JSON.parse(raw);

                setDrinks(parsed.drinks ?? []);
                setPage(parsed.page ?? 1);
                setTotalPages(
                    typeof parsed.totalPages === "number"
                        ? parsed.totalPages
                        : null
                );
                setSearchQuery(parsed.searchQuery ?? "");

                setShouldSkipNextLoad(true);
            } catch {
                sessionStorage.removeItem(CACHE_KEY);
            }
        }

        setHasHydratedFromCache(true);
    }, []);

    useEffect(() => {
        if (!hasHydratedFromCache) return;

        if (shouldSkipNextLoad) {
            setShouldSkipNextLoad(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const { drinks: newDrinks, totalPages } = await fetchDrinks(
                    page,
                    searchQuery,
                );
                if (cancelled) return;

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
    }, [page, searchQuery, hasHydratedFromCache, shouldSkipNextLoad]);

    useEffect(() => {
        if (!hasHydratedFromCache) return;

        const cache: CachedState = {
            drinks,
            page,
            totalPages,
            searchQuery,
        };

        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch {
        }
    }, [drinks, page, totalPages, searchQuery, hasHydratedFromCache]);

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

    // handlers
    function handleSearch(query: string) {
        setDrinks([]);
        setPage(1);
        setTotalPages(null);
        setError(null);
        setSearchQuery(query);
    }


    return (
        <>
            <Navbar
                onSearch={handleSearch}
            />

            <div className="drink_page">
                {error && <p className="error_text">API error: {error}</p>}

                <p className="debug_text">
                    Debug: drinks={drinks.length} page={page} query="{searchQuery}"
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
