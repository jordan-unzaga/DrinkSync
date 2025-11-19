import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/DrinkDetail.css";
import Navbar from "../components/Navbar";
import "../styles/Navbar.css";


export default function DrinkDetail() {
    const { id } = useParams();
    const location = useLocation();
    const drink = location.state; 

    const [instructions, setInstructions] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDetail() {
            const res = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
            );

            const json = await res.json();
            setInstructions(json.drinks[0].strInstructions);
        }

        fetchDetail();
    }, [id]);

    if (!drink) return <p>Error: drink data missing.</p>;

    return (

        <>
            <Navbar onSearch={function (query: string): void {
                throw new Error("Function not implemented.");
            }}            />

            <div className="drink_detail">
                <img src={drink.icon} alt={drink.name} className="detail_image" />

                <h1>{drink.name}</h1>

                <p className={`tag ${drink.alcoholic ? "alcoholic" : "non-alcoholic"}`}>
                    {drink.alcoholic ? "Alcoholic" : "Non-Alcoholic"}
                </p>

                <h3>Ingredients</h3>
                <ul>
                    {drink.ingredients.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>

                <h3>Instructions</h3>
                <p>{instructions ?? "Loading..."}</p>

                <button
                    className="save_button"
                    //onClick={() => saveDrink(drink)}
                >
                    Save Drink
                </button>
                <button
                    className="remove_button"
                >
                    Remove Drink
                </button>
            </div>
        </>


    );
}

/*
async function saveDrink(drink: any) {
    await fetch("/api/save-drink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drink),
    });
}
    */