export type Drink = {
    id: string,
    name: string;
    description: string;
    alcoholic: boolean;
    rating: number;
    icon: string;
    ingredients: string[];
};

const PAGE_SIZE = 10;

export async function fetchDrinks(
    page: number = 1,
    query: string = ""
): Promise<{ drinks: Drink[]; totalPages: number }> {

// if no query
    if (query.trim() === "") {
        const promises = Array.from({ length: PAGE_SIZE }, () =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
                .then((r) => r.json())
        );

        const results = await Promise.all(promises);

        const drinks: Drink[] = results
            .map((res) => res.drinks?.[0])
            .filter(Boolean)
            .map((d: any) => {
                const ingredients: string[] = [];
                for (let i = 1; i <= 15; i++) {
                    const ing = d[`strIngredient${i}`];
                    const measure = d[`strMeasure${i}`];
                    if (ing) {
                        ingredients.push(
                            measure ? `${measure.trim()} ${ing.trim()}` : ing.trim()
                        );
                    }
                }

                return {
                    id: d.idDrink,
                    name: d.strDrink ?? "Unknown",
                    description: "",
                    alcoholic: d.strAlcoholic === "Alcoholic",
                    rating: 0,
                    icon: d.strDrinkThumb ?? "/empty.png",
                    ingredients
                };
            });

        return { drinks, totalPages: Number.POSITIVE_INFINITY };
    }

// if query
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const cocktails = Array.isArray(data.drinks) ? data.drinks : [];

    const allDrinks: Drink[] = cocktails.map((d: any) => {
        const ingredients: string[] = [];
        for (let i = 1; i <= 15; i++) {
            const ing = d[`strIngredient${i}`];
            const measure = d[`strMeasure${i}`];
            if (ing) {
                ingredients.push(
                    measure ? `${measure.trim()} ${ing.trim()}` : ing.trim()
                );
            }
        }

        return {
            id: d.idDrink,
            name: d.strDrink ?? "Unknown",
            description: "",
            alcoholic: d.strAlcoholic === "Alcoholic",
            rating: 0,
            icon: d.strDrinkThumb ?? "/empty.png",
            ingredients
        };
    });

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const paged = allDrinks.slice(start, end);
    const totalPages = Math.ceil(allDrinks.length / PAGE_SIZE) || 1;

    return { drinks: paged, totalPages };
}