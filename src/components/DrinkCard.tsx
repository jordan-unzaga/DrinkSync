export type Drink = {
    name?: string;
    description?: string;
    alcoholic?: boolean;
    rating?: number;
    icon?: string;
};

export function DrinkCard(drink: Drink) {
    const {
        name = "Unknown Drink",
        description = "No description available.",
        alcoholic = false,
        rating = 0,
        icon = "/empty.png"
    } = drink;

    return (
        <li className="drink_card">
            <img className="drink_image" src={icon} alt={name} />

            <h3 className="name">{name}</h3>

            <div className="rating">{Number(rating).toFixed(1)}★</div>

            <p className="desc">{description}</p>

            <div className={`tag ${alcoholic ? "alcoholic" : "non-alcoholic"}`}>
                {alcoholic ? "Alcoholic" : "Non-Alcoholic"}
            </div>
        </li>
    );
}
