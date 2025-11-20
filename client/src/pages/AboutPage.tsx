import "../styles/Navbar.css";
import "../styles/AboutPage.css";
import Navbar from "../components/Navbar";

export default function AboutPage() {
    return (
        <>
            <Navbar onSearch={() => {}} />

            <div className="about_page">
                <h1>About DrinkSync</h1>

                <p>
                    A web app where you can be suggested random mixed drinks, look up recipes you’re curious about, and save recipes you enjoy!
                </p>

                <h2>Features</h2>
                <ul>
                    <li>Browse drinks fetched live from CocktailDB API</li>
                    <li>Detailed drink pages with ingredients + instructions</li>
                    <li>Planned: user accounts and saved drinks</li>
                </ul>

                <h2>Technology</h2>
                <ul>
                    <li>React + TypeScript (frontend)</li>
                    <li>React Router for navigation</li>
                    <li>Custom CSS for styling</li>
                </ul>
            </div>
        </>
    );
}
