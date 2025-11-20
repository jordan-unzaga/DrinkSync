import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/DrinkSyncLogo.png";

type NavbarProps = {
    onSearch: (query: string) => void;
};

export default function Navbar({ onSearch }: NavbarProps) {
    const [term, setTerm] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSearch(term.trim());
    }

    return (
        <header className="nav">
            <div className="nav_inner">

                <div className="nav_brand">
                    <img src={logo} alt="Drink Sync Logo" className="nav_logo" />
                </div>

                <nav className="nav_links">
                    <Link to="/" className="nav_link">
                        Home
                    </Link>

                    <a href="#" className="nav_link">
                        Saved Drinks
                    </a>

                    <Link to="/about" className="nav_link">
                        About
                    </Link>
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
