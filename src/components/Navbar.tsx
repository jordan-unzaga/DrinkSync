import { useState, FormEvent } from "react";

type NavbarProps = {
    onSearch: (query: string) => void;
};

export function Navbar({ onSearch }: NavbarProps) {
    const [term, setTerm] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSearch(term.trim());
    }

    return (
        <header className="nav">
            <div className="nav_inner">
                <div className="nav_brand">
                    <span role="img" aria-label="drink">🍹</span>
                    <span>Drink Sync</span>
                </div>

                <nav className="nav_links">
                    <a href="/" className="nav_link">Home</a>
                    <a href="/drinks" className="nav_link">Drinks</a>
                    <a href="/about" className="nav_link">About</a>
                </nav>

                <form className="nav_search" onSubmit={handleSubmit}>
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
        </header>
    );
}
