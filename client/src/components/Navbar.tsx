import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav_links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
                </li>
                <li>
                    <NavLink to="/drinks" className={({ isActive }) => (isActive ? "active" : "")}>Drinks</NavLink>
                </li>
            </ul>
            <button className="login_btn">Login</button>
        </nav>
    );
}