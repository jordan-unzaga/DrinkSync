import { useEffect, useState } from "react";
import DrinkCard from "../components/DrinkCard";
import type { Drink, DrinkFilter} from "../api/fetchDrink";
import "../styles/DrinkCard.css"
import "../styles/Navbar.css"
import Navbar from "../components/Navbar";

export default function SavedDrinksPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSaved() {
            const res = await fetch("/~w62q346/finalproject/drink-sync/server/getSavedDrinks.php", {
                credentials: "include"
            });
            const data = await res.json();

            const ids: string[] = data.drink_ids ?? [];

            const fetched: Drink[] = [];
            for (const id of ids) {
                const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
                const json = await res.json()
                const apiDrink = json.drinks?.[0];
                if (!apiDrink) continue;

                const ingredients: string[] = [];
                for (let i = 1; i <= 15; i++) {
                    const key = `strIngredient${i}`
                    if (apiDrink[key]) ingredients.push(apiDrink[key]);
                }

                fetched.push({
                    id: apiDrink.idDrink,
                    name: apiDrink.strDrink,
                    description: "",
                    alcoholic: !apiDrink.strAlcoholic.includes("Non alcoholic"),
                    rating: 0,
                    icon: apiDrink.strDrinkThumb,
                    ingredients,
                    instructions: apiDrink.strInstructions ?? null
                });
            }
            setDrinks(fetched);
            setLoading(false);
        }

        loadSaved();
    }, []);

    return (
        <>
            <Navbar
                onSearch={() => {}}
                filter={"all"}
                onFilterChange={function (filter: DrinkFilter): void {
                }}
                showSearchBar={false}
            />

            <div className = "drink_page">
                {loading && <p> Loading saved drinks...</p>}
                {!loading && drinks.length ==0 && <p>You have no saved drinks...</p>}

                <ul className = "drink_list">
                    {drinks.map((drink, i) => (
                        <DrinkCard key={i} {...drink} />
                    ))}
                </ul>
            </div>
        </>
    )
}