import "../styles/base.css"
import "../styles/drink.css"
import "../styles/navbar.css"
import Navbar from "./Navbar"

export default function Dashboard() {
    return (
        <div>
            <Navbar />
            <h1>Drink Sync</h1>

            <ul className="drink_list">
                <li className="drink_card">
                    <img className="drink_image" src="../images/test_bottle.webp" alt="Drink name" />
                    <div className="card_meta">
                        <h3 className="name">Espresso Martini</h3>
                        <div className="rating">4.5★</div>

                        <div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div>
                        <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                        <div className="tag alcoholic">Alcoholic</div>
                    </div>
                </li>

                <li className="drink_card">
                    <img className="drink_image" src="../images/test_drink.jpg" alt="Drink name" />
                    <div className="card_meta">
                        <h3 className="name">Espresso Martini</h3>
                        <div className="rating">4.5★</div>

                        <div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div>
                        <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                        <div className="tag alcoholic">Alcoholic</div>
                    </div>
                </li>
                <li className="drink_card">
                    <img className="drink_image" src="../images/test_bottle.webp" alt="Drink name" />
                    <div className="card_meta">
                        <h3 className="name">Espresso Martini</h3>
                        <div className="rating">4.5★</div>

                        <div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div>
                        <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                        <div className="tag alcoholic">N/A</div>
                    </div>
                </li>

                <li className="drink_card">
                    <img className="drink_image" src="../images/test_drink.jpg" alt="Drink name" />
                    <div className="card_meta">
                        <h3 className="name">Espresso Martini</h3>
                        <div className="rating">4.5★</div>

                        <div className="flavor"><strong>Flavor:</strong> Coffee, Vanilla, Cocoa</div>
                        <p className="desc">Smooth, slightly sweet, bold espresso kick.</p>
                        <div className="tag alcoholic">Alcoholic</div>
                    </div>
                </li>
            </ul>

        </div>
    )
}