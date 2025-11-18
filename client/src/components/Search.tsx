import { useEffect, useState } from "react";
import DrinkCard from "./DrinkCard";

export default function Search() {

    const [drinksState, setDrinksState] = useState<any[]>([]);

    useEffect(() => {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
            .then(res=>res.json())
            .then((response) => {
                setDrinksState(response.drinks)
                console.log(response.drinks)
            });
    }, [])

    return (
        <div>
            <ul className="drink_list">
                {drinksState.length !== 0 && drinksState.map((drink:any) => {
                    return (
                        <DrinkCard 
                            id={drink.idDrink}
                            image={drink.strDrinkThumb}
                            title={drink.strDrink}
                            alcoholic={drink.strAlcoholic}
                        />
                    )
                })}
            </ul>
        </div>
    );
}