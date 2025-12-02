import { useEffect, useRef, useState } from "react";
import { fetchDrink, type Drink, type DrinkFilter } from "../api/fetchDrink";

import "../styles/DrinkCard.css";
import "../styles/Navbar.css";
import DrinkCard from "../components/DrinkCard";
import Navbar from "../components/Navbar";
import {useLocation, useNavigate} from "react-router-dom";

const CACHE_KEY = "drink_page_state_v2";

type CachedState = {
    page: number;
    totalPages: number | null;
    searchQuery: string;
    drinks: Drink[];
    filter: DrinkFilter;
};

export function DrinkPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchVersion, setSearchVersion] = useState(0);
    const [filter, setFilter] = useState<DrinkFilter>("all");

    const [hasHydratedFromCache, setHasHydratedFromCache] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const hasFetchedOnceRef = useRef(false);


    const navigate = useNavigate();
    const location = useLocation();
    const isGuest =
        new URLSearchParams(location.search).get("guest") === "1";

    useEffect(() => {
        if (isGuest) return;

        fetch("/~w62q346/finalproject/drink-sync/server/checkAuth.php", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.logged_in) navigate("/login");
            })
            .catch(() => {
            });
    }, [isGuest, navigate]);

    // hydrate from sessionStorage
    useEffect(() => {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
            try {
                const parsed: Partial<CachedState> = JSON.parse(raw);

                setPage(parsed.page ?? 1);
                setTotalPages(
                    typeof parsed.totalPages === "number" ? parsed.totalPages : null
                );
                setSearchQuery(parsed.searchQuery ?? "");
                setDrinks(parsed.drinks ?? []);
                setFilter((parsed.filter as DrinkFilter) ?? "all");
            } catch {
                sessionStorage.removeItem(CACHE_KEY);
            }
        }

        setHasHydratedFromCache(true);
    }, []);

    // load data
    // load data
    useEffect(() => {
        if (!hasHydratedFromCache) return;

        // if we already have cached drinks for this state, skip first fetch
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
                    searchQuery,
                    filter
                );
                if (cancelled) return;

                setDrinks((prev) => {
                    const existingIds = new Set(prev.map((d) => d.id));
                    const uniqueNew = newDrinks.filter((d) => !existingIds.has(d.id));
                    return [...prev, ...uniqueNew];
                });
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
    }, [page, searchQuery, filter, searchVersion, hasHydratedFromCache]);


    // cache in sessionStorage
    useEffect(() => {
        if (!hasHydratedFromCache) return;

        const cache: CachedState = {
            page,
            totalPages,
            searchQuery,
            drinks,
            filter,
        };

        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch {
            // ignore quota errors
        }
    }, [drinks, page, totalPages, searchQuery, filter, hasHydratedFromCache]);

    // infinite scroll
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

    // search handler (query)
    function handleSearch(query: string) {
        setDrinks([]);
        setPage(1);
        setTotalPages(null);
        setError(null);
        setSearchQuery(query);
        setSearchVersion((v) => v + 1);
    }

    // filter handler (all / alcoholic / nonalcoholic)
    function handleFilterChange(newFilter: DrinkFilter) {
        setDrinks([]);
        setPage(1);
        setTotalPages(null);
        setError(null);
        setFilter(newFilter);
        setSearchVersion((v) => v + 1);
    }

    return (
        <>
            <Navbar
                onSearch={handleSearch}
                filter={filter}
                onFilterChange={handleFilterChange}
                showSearch={true}
            />


            <div className="drink_page">
                {error && <p className="error_text">API error: {error}</p>}

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
