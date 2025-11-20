import type { Drink } from "../api/fetchDrink";
import { Link } from "react-router-dom"

export default function DrinkCard({ id, name, rating, icon, alcoholic, ingredients }: Drink) {
    return (
        <li className="drink_card">
            <Link
                to={`/drink/${id}`}
                state={{ id, name, rating, icon, alcoholic, ingredients }}
                className="no_underline"
            >
                <img src={icon} alt={name} className="drink_image" />

                <h2 className="name">{name}</h2>

                {/*<div className="rating">Rating: {rating}</div>*/}

                <div
                    className={`tag ${alcoholic ? "alcoholic" : "non-alcoholic"}`}
                >
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