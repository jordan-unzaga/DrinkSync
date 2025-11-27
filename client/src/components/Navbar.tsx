import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

type NavbarProps = {
    onSearch: (query: string) => void;
};

export default function Navbar({ onSearch }: NavbarProps) {
    const [term, setTerm] = useState("");
    const navigate = useNavigate();

    function handleLogout() {
        fetch("https://csci331vm.cs.montana.edu/~w62q346/finalproject/drink-sync/server/logout.php", {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.clear();
                navigate("/login");
            }
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSearch(term.trim());
    }

    return (
        <header className="nav">
            <div className="nav_inner">

                <div className="nav_left">

                    <div className="nav_brand">
                        <img src={`${process.env.PUBLIC_URL}/DrinkSyncLogo.png`} alt="Drink Sync Logo" className="nav_logo" />
                        <span>DRINK SYNC</span>
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

                    <button onClick={handleLogout}>Logout</button>

                </div>



                <div className="nav_right">
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
            </div>
        </header>
    );
}
