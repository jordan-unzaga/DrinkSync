import type { Drink } from "../api/fetchDrinks";

export default function DrinkCard({ name, rating, icon, alcoholic, ingredients }: Drink) {
    return (
        <li className="drink_card">
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
        </li>
    );
}