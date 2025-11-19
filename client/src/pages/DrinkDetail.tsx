import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/DrinkCard.css";
import "../styles/DrinkDetail.css";
import "../styles/Navbar.css";
import Navbar from "../components/Navbar";
import type { Drink } from "../api/fetchDrinks";

export default function DrinkDetail() {
    const { id } = useParams();
    const location = useLocation();
    const drink = location.state as Drink | undefined;

    const [instructions, setInstructions] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDetail() {
            if (!id) return;
            const res = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
            );
            const json = await res.json();
            setInstructions(json.drinks?.[0]?.strInstructions ?? null);
        }
        fetchDetail();
    }, [id]);

    if (!drink) {
        return <p>Error: drink data missing.</p>;
    }

    return (
        <>
            <Navbar onSearch={() => {}} />

            <div className="drink_detail_page">
                <div className="drink_card drink_card--large">
                    <img src={drink.icon} alt={drink.name} className="drink_image" />

                    <h2 className="name">{drink.name}</h2>

                    <div
                        className={`tag ${drink.alcoholic ? "alcoholic" : "non-alcoholic"}`}
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
                    <p>{instructions ?? "Loading..."}</p>
                </div>
            </div>
        </>
    );
}
