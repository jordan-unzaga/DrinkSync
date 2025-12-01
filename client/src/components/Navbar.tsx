import { useState } from "react";
import type { DrinkFilter } from "../api/fetchDrink";
import "../styles/Navbar.css";

type NavbarProps = {
    onSearch: (query: string) => void;
    filter: DrinkFilter;
    onFilterChange: (filter: DrinkFilter) => void;
};

export default function Navbar({ onSearch, filter, onFilterChange }: NavbarProps) {
    const [term, setTerm] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSearch(term);
    }

    return (
        <nav className="navbar">
            <div className="nav_left">
                <a href="/" className="nav_logo">DrinkSync</a>
            </div>

            <div className="nav_right">
                <form className="nav_search" onSubmit={handleSubmit}>
                    <select
                        className="nav_filter_dropdown"
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value as DrinkFilter)}
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
        </nav>
    );
}
