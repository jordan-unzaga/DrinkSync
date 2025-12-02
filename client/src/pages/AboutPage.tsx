import "../styles/Navbar.css";
import "../styles/AboutPage.css";
import Navbar from "../components/Navbar";

export default function AboutPage() {
    return (
        <>
            <Navbar showSearch = {false} />


            <div className="about_page">
                <h1>About DrinkSync</h1>

                <p>
                    A web app where you are suggested random mixed drinks, look up recipes you’re curious about, and save recipes you enjoy!
                </p>

                <h2>Features</h2>
                <ul>
                    <li>Browse drinks fetched live from CocktailDB API</li>
                    <li>Detailed drink pages with ingredients + instructions</li>
                    <li>User accounts and Savable drinks</li>
                    <li>Infinite Scroll!</li>
                </ul>

                <h2>Technology</h2>
                <ul>
                    <li>React + TypeScript (frontend)</li>
                    <li>React Router for navigation</li>
                    <li>Custom CSS for styling</li>
                    <li>MariaDB and PHP</li>
                </ul>
            </div>
        </>
    );
}