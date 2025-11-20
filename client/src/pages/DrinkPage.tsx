import { useEffect, useRef, useState } from "react";
import { fetchDrink, type Drink } from "../api/fetchDrink";

import "../styles/DrinkCard.css";
import "../styles/Navbar.css";
import DrinkCard from "../components/DrinkCard";
import Navbar from "../components/Navbar";

const CACHE_KEY = "drink_page_state_v1";

type CachedState = {
    page: number;
    totalPages: number | null;
    searchQuery: string;
    drinks: Drink[];
};

export function DrinkPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchVersion, setSearchVersion] = useState(0);

    const [hasHydratedFromCache, setHasHydratedFromCache] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const hasFetchedOnceRef = useRef(false);

    // try to get from cache
    useEffect(() => {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
            try {
                const parsed: CachedState = JSON.parse(raw);

                setPage(parsed.page ?? 1);
                setTotalPages(
                    typeof parsed.totalPages === "number" ? parsed.totalPages : null
                );
                setSearchQuery(parsed.searchQuery ?? "");
                setDrinks(parsed.drinks ?? []);
            } catch {
                sessionStorage.removeItem(CACHE_KEY);
            }
        }

        setHasHydratedFromCache(true);
    }, []);

// load more data, skips if items already cached
    useEffect(() => {
        if (!hasHydratedFromCache) return;

        if (!hasFetchedOnceRef.current && drinks.length > 0) {
            hasFetchedOnceRef.current = true;
            return;
        }

        hasFetchedOnceRef.current = true;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const { drinks: newDrinks, totalPages } = await fetchDrink(
                    page,
                    searchQuery
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
    }, [page, searchQuery, searchVersion, hasHydratedFromCache]);

    // cache in session storage
    useEffect(() => {
        if (!hasHydratedFromCache) return;

        const cache: CachedState = {
            page,
            totalPages,
            searchQuery,
            drinks,
        };

        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch {
        }
    }, [drinks, page, totalPages, searchQuery, hasHydratedFromCache]);

    // infinite scroll functionality
    useEffect(() => {
        const target = sentinelRef.current;
        if (!target) return;

        if (page === 1 && drinks.length === 0) return;
        if (totalPages !== null && page >= totalPages) return;

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !loading) {
                setPage((p) => p + 1);
            }
        });

        observer.observe(target);
        return () => observer.disconnect();
    }, [loading, page, totalPages, drinks.length]);

// search handler
    function handleSearch(query: string) {
        setDrinks([]);
        setPage(1);
        setTotalPages(null);
        setError(null);
        setSearchQuery(query);
        setSearchVersion((v) => v + 1);
    }

    return (
        <>
            <Navbar onSearch={handleSearch} />

            <div className="drink_page">
                {error && <p className="error_text">API error: {error}</p>}

                {/*<p className="debug_text">
                    Debug: drinks={drinks.length} page={page} query="{searchQuery}"
                </p> */}

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
