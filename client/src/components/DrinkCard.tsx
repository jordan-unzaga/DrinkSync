import type { Drink } from "../api/fetchDrink";
import { Link } from "react-router-dom";

export default function DrinkCard(drink: Drink) {
    const { id, name, rating, icon, alcoholic, ingredients } = drink;

    return (
        <li className="drink_card">
            <Link
                to={`/drink/${id}`}
                state={drink}
                className="no_underline"
            >
                <img src={icon} alt={name} className="drink_image" />
                <h2 className="name">{name}</h2>

                <div className={`tag ${alcoholic ? "alcoholic" : "non-alcoholic"}`}>
                    {alcoholic ? "Alcoholic" : "Non-Alcoholic"}
                </div>

                <div className="ingredients">
                    <h4>Ingredients</h4>
                    <ul>
                        {ingredients.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </Link>
        </li>
    );
}
