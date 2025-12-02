import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import type { DrinkFilter } from "../api/fetchDrink";

type NavbarProps = {
    onSearch: (query: string) => void;
    filter: DrinkFilter;
    onFilterChange: (filter: DrinkFilter) => void;
    // NEW: Optional prop to control search bar visibility
    showSearchBar?: boolean;
};

export default function Navbar({ onSearch, filter, onFilterChange, showSearchBar = true }: NavbarProps) {
    const [term, setTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const isGuest = new URLSearchParams(location.search).get("guest") === "1";

    function guestLink(path: string) {
        return isGuest ? `${path}?guest=1` : path;
    }

    function handleLogout() {
        fetch(
            "https://csci331vm.cs.montana.edu/~w62q346/finalproject/drink-sync/server/logout.php",
            { credentials: "include" }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    sessionStorage.clear();
                    navigate("/login");
                }
            });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSearch(term.trim());
        // Use the function to navigate and preserve the guest status
        navigate(guestLink("/drinkpage"));
    }

    // NEW: clicking brand -> home, clear search, reset filter, refetch random drinks
    function handleBrandClick() {
        // clear local input
        setTerm("");

        // reset filter to "all"
        if (filter !== "all") {
            onFilterChange("all");
        }

        // clear search query so fetchDrink goes into random mode again
        onSearch("");

        // navigate to home (respect guest mode)
        navigate(guestLink("/drinkpage"));
    }

    return (
        <header className="nav">
            <div className="nav_inner">
                {/* LEFT SIDE: brand + links */}
                <div className="nav_left">
                    {/* make brand clickable */}
                    <button
                        type="button"
                        className="nav_brand"
                        onClick={handleBrandClick}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/DrinkSyncLogo.png`}
                            alt="Drink Sync Logo"
                            className="nav_logo"
                        />
                        <span>DRINK SYNC</span>
                    </button>

                    <nav className="nav_links">
                        <Link to={guestLink("/drinkpage")} className="nav_link">
                            Home
                        </Link>

                        {!isGuest && (
                            <Link to="/saveddrinks" className="nav_link">
                                Saved Drinks
                            </Link>
                        )}

                        <Link to={guestLink("/about")} className="nav_link">
                            About
                        </Link>

                        {isGuest ? (
                            <Link to="/login" className="nav_link">
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="nav_link"
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    font: "inherit",
                                    cursor: "pointer",
                                }}
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>

                {/* RIGHT SIDE: search + filter (Conditionally rendered) */}
                {showSearchBar && (
                    <div className="nav_right">
                        <form className="nav_search" onSubmit={handleSubmit}>
                            <select
                                className="nav_filter_dropdown"
                                value={filter}
                                onChange={(e) =>
                                    onFilterChange(e.target.value as DrinkFilter)
                                }
                            >
                                <option value="all">All Drinks</option>
                                <option value="alcoholic">Alcoholic</option>
                                <option value="nonalcoholic">Non-Alcoholic</option>
                            </select>

                            <input
                                type="text"
                                className="nav_search_input"
                                placeholder="Search drinks..."
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                            />

                            <button type="submit" className="nav_search_button">
                                Search
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
}