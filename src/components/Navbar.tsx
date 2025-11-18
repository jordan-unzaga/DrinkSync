type NavbarProps = {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
};

export function Navbar({ isLoggedIn, onLoginClick, onLogoutClick }: NavbarProps) {
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
                            <button
                                type="button"
                                onClick={onLogoutClick}
                                className="nav_link"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/about" className="nav_link">About</a>
                            <button
                                type="button"
                                className="nav_link drinks_btn"
                                onClick={onLoginClick}
                            >
                                Login
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
