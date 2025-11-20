import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import type { Drink } from "../api/fetchDrink";

import "../styles/DrinkCard.css";
import "../styles/DrinkDetail.css";
import "../styles/Navbar.css";

type ApiDrink = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strAlcoholic: string;
    strInstructions: string | null;
    [key: string]: any;
};

export default function DrinkDetail() {
    const { id } = useParams();
    const location = useLocation();
    const initialDrink = location.state as Drink | undefined;

    const [drink, setDrink] = useState<Drink | null>(initialDrink ?? null);
    const [instructions, setInstructions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // toast state
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const toastTimeoutRef = useRef<number | undefined>(undefined);

    function showToast(message: string) {
        setToastMessage(message);

        if (toastTimeoutRef.current !== undefined) {
            window.clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = window.setTimeout(() => {
            setToastMessage(null);
        }, 2000); // matches your CSS animation
    }

    function handleSaveClick() {
        // TODO: real save logic later
        showToast("Drink saved!");
    }

    function handleRemoveClick() {
        // TODO: real remove logic later
        showToast("Drink removed.");
    }

    useEffect(() => {
        if (!id) {
            setError("Missing drink id.");
            return;
        }

        async function fetchDetail() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const json = await res.json();

                const apiDrink: ApiDrink | undefined = json.drinks?.[0];
                if (!apiDrink) {
                    throw new Error("Drink not found.");
                }

                const ingredients: string[] = [];
                for (let i = 1; i <= 15; i++) {
                    const key = `strIngredient${i}`;
                    const value = apiDrink[key];
                    if (value && typeof value === "string") {
                        ingredients.push(value);
                    }
                }

                const mappedDrink: Drink = {
                    id: apiDrink.idDrink,
                    name: apiDrink.strDrink,
                    description: "",
                    alcoholic: apiDrink.strAlcoholic.toLowerCase().includes("alcohol"),
                    rating: 0,
                    icon: apiDrink.strDrinkThumb,
                    ingredients,
                };

                setDrink(mappedDrink);
                setInstructions(apiDrink.strInstructions ?? null);
            } catch (err: any) {
                setError(err.message ?? "Failed to load drink.");
            } finally {
                setLoading(false);
            }
        }

        fetchDetail();

        return () => {
            if (toastTimeoutRef.current !== undefined) {
                window.clearTimeout(toastTimeoutRef.current);
            }
        };
    }, [id]);

    return (
        <>
            <Navbar onSearch={() => {}} />

            <div className="drink_detail_page">
                {loading && <p className="loading_text">Loading drink…</p>}
                {error && <p className="error_text">{error}</p>}

                {drink && !loading && !error && (
                    <div className="drink_card drink_card--large">
                        <img src={drink.icon} alt={drink.name} className="drink_image" />

                        <h2 className="name">{drink.name}</h2>

                        <div
                            className={`tag ${
                                drink.alcoholic ? "alcoholic" : "non-alcoholic"
                            }`}
                        >
                            {drink.alcoholic ? "Alcoholic" : "Non-Alcoholic"}
                        </div>

                        <div className="ingredients">
                            <h4>Ingredients</h4>
                            <ul>
                                {drink.ingredients.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <h3>Instructions</h3>
                        <p>{instructions ?? "No instructions available."}</p>

                        <div className="button_row">
                            <button className="save_button" onClick={handleSaveClick}>
                                Save Drink
                            </button>
                            <button className="remove_button" onClick={handleRemoveClick}>
                                Remove Drink
                            </button>
                        </div>
                    </div>
                )}

                {toastMessage && (
                    <div className="toast_popup">
                        {toastMessage}
                    </div>
                )}
            </div>
        </>
    );
}
