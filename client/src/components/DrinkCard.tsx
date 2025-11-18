import "../styles/Drink.css"

interface DrinkCardProps {
    id: string;
    image: string;
    title: string;
    alcoholic: string;

}

export default function DrinkCard({
    id,
    image,
    title,
    alcoholic
}: DrinkCardProps) {
    return (
        <li className="drink_card">
            <img className="drink_image" src={image} alt="Drink name" />
            <div className="card_meta">
                <h3 className="name">{title}</h3>
                {/*<div className="rating">4.5★</div>*/}

                {/*<div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div> */}
                <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                <div className="tag alcoholic">{alcoholic}</div>
            </div>
        </li>
    )
}
        
        