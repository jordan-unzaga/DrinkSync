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

const PAGE_SIZE = 6;

// cache: key = `${query}|${filter}`, value = all drinks for that combo
const searchCache = new Map<string, Drink[]>();

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
    const trimmedQuery = query.trim();
    const cacheKey = `${trimmedQuery.toLowerCase()}|${filter}`;

    // 1) NO QUERY + filter === "all" → pure random, 10 at a time, infinite
    if (trimmedQuery === "" && filter === "all") {
        const promises = Array.from({ length: PAGE_SIZE }, () =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(
                (r) => {
                    if (!r.ok) throw new Error(`API error: ${r.status}`);
                    return r.json();
                }
            )
        );

        const results = await Promise.all(promises);

        const drinks: Drink[] = results
            .map((res) => res.drinks?.[0])
            .filter(Boolean)
            .map((d: any) => mapApiDrinkToDrink(d));

        // random should never "run out", so infinite pages
        return { drinks, totalPages: Number.POSITIVE_INFINITY };
    }

    // 2) Everything else (query or alcohol filter) → use cache + real paging
    let cached = searchCache.get(cacheKey);

    if (!cached) {
        // 2a) NO QUERY but alcoholic/nonalcoholic filter
        if (trimmedQuery === "" && filter !== "all") {
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
                searchCache.set(cacheKey, []);
                return { drinks: [], totalPages: 1 };
            }

            // fetch full details ONCE, then we only slice for pages
            const detailResults = await Promise.all(
                list.map((item: any) =>
                    fetch(
                        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`
                    ).then((r) => {
                        if (!r.ok) throw new Error(`API error: ${r.status}`);
                        return r.json();
                    })
                )
            );

            cached = detailResults
                .map((res) => res.drinks?.[0])
                .filter(Boolean)
                .map((d: any) => mapApiDrinkToDrink(d));

            searchCache.set(cacheKey, cached);
        } else {
            // 2b) QUERY present → search.php
            const res = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                    trimmedQuery
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
                // TheCocktailDB uses "Non alcoholic"
                cocktails = cocktails.filter(
                    (d) => d.strAlcoholic === "Non alcoholic"
                );
            }

            cached = cocktails.map((d: any) => mapApiDrinkToDrink(d));
            searchCache.set(cacheKey, cached);
        }
    }

    const allDrinks = cached ?? [];
    if (allDrinks.length === 0) {
        return { drinks: [], totalPages: 1 };
    }

    const totalPages = Math.max(1, Math.ceil(allDrinks.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paged = allDrinks.slice(start, end);

    return { drinks: paged, totalPages };
}
