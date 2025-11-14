import {useState} from "react";

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <header className="nav">
            <div className="nav_inner">
                <div className="nav_brand">
                    <span role="img" aria-label="drink">
                        🍹
                    </span>
                    <span>Drink Sync</span>
                </div>

                <nav className="nav_links">
                    <a href="/" className="nav_link">Home</a>

                    {isLoggedIn ? (
                        <>
                            <a href="/drinks" className="nav_link">My Drinks</a>
                            <a href="/add" className="nav_link">Add Drink</a>
                            <a href="/about" className="nav_link">About</a>
                        </>
                    ) : (
                        <>
                            <a href="/about" className="nav_link">About</a>
                            <a className="nav_link drinks_btn">
                                Login
                            </a>
                        </>
                    )}
                    <button
                        onClick={() => setIsLoggedIn(v => !v)}
                        className="nav_toggle_test"
                    >
                        Toggle Login
                    </button>
                </nav>

            </div>
        </header>
    );
}


