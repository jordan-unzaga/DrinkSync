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

const drinkDetailsCache = new Map<string, Drink>();

const pageCache = new Map<string, any[]>();


function mapAndCacheApiDrink(d: any): Drink {
    if (drinkDetailsCache.has(d.idDrink)) {
        return drinkDetailsCache.get(d.idDrink)!;
    }

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

    const drink: Drink = {
        id: d.idDrink,
        name: d.strDrink ?? "Unknown",
        description: "",
        alcoholic: d.strAlcoholic === "Alcoholic",
        rating: 0,
        icon: d.strDrinkThumb ?? "/empty.png",
        ingredients,
        instructions: d.strInstructions ?? null,
    };

    drinkDetailsCache.set(drink.id, drink);
    return drink;
}

async function getDrinkDetails(id: string): Promise<Drink | null> {
    if (drinkDetailsCache.has(id)) {
        return drinkDetailsCache.get(id)!;
    }

    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!res.ok) {
        console.error(`Error fetching drink details for ID ${id}: ${res.status}`);
        return null;
    }

    const data = await res.json();
    const apiDrink = data.drinks?.[0];

    if (apiDrink) {
        return mapAndCacheApiDrink(apiDrink);
    }

    return null;
}


export async function fetchDrink(
    page: number = 1,
    query: string = "",
    filter: DrinkFilter = "all"
): Promise<{ drinks: Drink[]; totalPages: number }> {
    const trimmedQuery = query.trim();

    const cacheKey = `${trimmedQuery.toLowerCase()}|${filter}|${page}`;

    // 1) NO QUERY + filter === "all" -> random
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
            .map((d: any) => mapAndCacheApiDrink(d));

        return { drinks, totalPages: Number.POSITIVE_INFINITY };
    }

    // 2) Check page-specific cache
    let pagedApiItems = pageCache.get(cacheKey);
    let totalPages: number = 1;

    if (!pagedApiItems) {
        // 2a) NO QUERY but alcoholic/nonalcoholic filter
        if (trimmedQuery === "" && filter !== "all") {
            const alcoholParam =
                filter === "alcoholic" ? "Alcoholic" : "Non_Alcoholic";

            const listRes = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
                    alcoholParam
                )}`
            );
            if (!listRes.ok) throw new Error(`API error: ${listRes.status}`);

            const data = await listRes.json();
            const allItems: any[] = Array.isArray(data.drinks) ? data.drinks : [];

            if (allItems.length === 0) {
                return { drinks: [], totalPages: 1 };
            }

            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            pagedApiItems = allItems.slice(start, end);

            totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));

        } else {
            // 2b) QUERY present -> search.php
            const res = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                    trimmedQuery
                )}`
            );
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            let cocktails: any[] = Array.isArray(data.drinks) ? data.drinks : [];

            if (filter === "alcoholic") {
                cocktails = cocktails.filter(
                    (d) => d.strAlcoholic === "Alcoholic"
                );
            } else if (filter === "nonalcoholic") {
                cocktails = cocktails.filter(
                    (d) => d.strAlcoholic === "Non alcoholic"
                );
            }

            const allItems = cocktails.filter(Boolean);
            if (allItems.length === 0) {
                return { drinks: [], totalPages: 1 };
            }

            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            pagedApiItems = allItems.slice(start, end);

            totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
        }

        pageCache.set(cacheKey, pagedApiItems);
    }

    let pagedDrinks: Drink[] = [];

    if (trimmedQuery === "" && filter !== "all") {
        // 3a) Filter scenario: Fetch details for the current page (max 6).
        const detailPromises = pagedApiItems.map((item: any) =>
            getDrinkDetails(item.idDrink)
        );

        const detailedResults = await Promise.all(detailPromises);
        pagedDrinks = detailedResults.filter(Boolean) as Drink[];

        if (pageCache.get(cacheKey) && totalPages === 1) {
            totalPages = Number.POSITIVE_INFINITY;
        }

    } else {
        // 3b) Search scenario: Map and cache full API objects.
        pagedDrinks = pagedApiItems.map((d: any) => mapAndCacheApiDrink(d));

        if (pagedDrinks.length === 0) {
            totalPages = 1;
        }
    }

    if (pagedDrinks.length === 0 && page > 1) {
        totalPages = page;
    }

    return { drinks: pagedDrinks, totalPages };
}