export type Drink = {
    id: string;
    name: string;
    description: string;
    alcoholic: boolean;
    rating: number;
    icon: string;
    ingredients: string[];
    instructions: string | null;
};

export type DrinkFilter = "all" | "alcoholic" | "nonalcoholic";

const PAGE_SIZE = 10;

function mapApiDrinkToDrink(d: any): Drink {
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
        ingredients,
        instructions: d.strInstructions ?? null,
    };
}


export async function fetchDrink(
    page: number = 1,
    query: string = "",
    filter: DrinkFilter = "all"
): Promise<{ drinks: Drink[]; totalPages: number }> {

    // 1) NO QUERY: random drinks
    if (query.trim() === "") {
        // 1a) All drinks → same behavior: PAGE_SIZE random drinks
        if (filter === "all") {
            const promises = Array.from({ length: PAGE_SIZE }, () =>
                fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
                    .then((r) => {
                        if (!r.ok) throw new Error(`API error: ${r.status}`);
                        return r.json();
                    })
            );

            const results = await Promise.all(promises);

            const drinks: Drink[] = results
                .map((res) => res.drinks?.[0])
                .filter(Boolean)
                .map((d: any) => mapApiDrinkToDrink(d));

            // “Infinite” list of random drinks
            return { drinks, totalPages: Number.POSITIVE_INFINITY };
        }

        // 1b) Alcoholic / Non-alcoholic list with real pagination
        const alcoholParam =
            filter === "alcoholic" ? "Alcoholic" : "Non_Alcoholic";

        const res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
                alcoholParam
            )}`
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data.drinks) ? data.drinks : [];

        if (list.length === 0) {
            return { drinks: [], totalPages: 1 };
        }

        const totalPages = Math.ceil(list.length / PAGE_SIZE) || 1;
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const pageSlice = list.slice(start, end);

        // filter.php only returns id/name/thumb → fetch full details
        const detailResults = await Promise.all(
            pageSlice.map((item: any) =>
                fetch(
                    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`
                ).then((r) => {
                    if (!r.ok) throw new Error(`API error: ${r.status}`);
                    return r.json();
                })
            )
        );

        const drinks: Drink[] = detailResults
            .map((res) => res.drinks?.[0])
            .filter(Boolean)
            .map((d: any) => mapApiDrinkToDrink(d));

        return { drinks, totalPages };
    }

    // 2) QUERY: search by name
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            query
        )}`
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    let cocktails: any[] = Array.isArray(data.drinks) ? data.drinks : [];

    // Apply alcohol filter on search results
    if (filter === "alcoholic") {
        cocktails = cocktails.filter(
            (d) => d.strAlcoholic === "Alcoholic"
        );
    } else if (filter === "nonalcoholic") {
        // TheCocktailDB uses "Non alcoholic" for this case
        cocktails = cocktails.filter(
            (d) => d.strAlcoholic === "Non alcoholic"
        );
    }

    const allDrinks: Drink[] = cocktails.map((d: any) =>
        mapApiDrinkToDrink(d)
    );

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const paged = allDrinks.slice(start, end);
    const totalPages = Math.ceil(allDrinks.length / PAGE_SIZE) || 1;

    return { drinks: paged, totalPages };
}

