
export default function DrinkCard() {
    return (
        <div className="drink_card">
            <img className="drink_image" src="images/test_bottle.webp" alt="Drink name" />
            <div className="card_meta">
                <h3 className="name">Espresso Martini</h3>
                <div className="rating">4.5★</div>

                <div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div>
                <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                <div className="tag alcoholic">Alcoholic</div>
            </div>
        </div>
    )
}
        
        