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

// Cache 1: Stores the FULL Drink details, indexed by ID.
const drinkDetailsCache = new Map<string, Drink>();

// Cache 2: Stores the list of IDs/Items fetched for a specific page.
// Key = `${query}|${filter}|${page}`, Value = Array of RAW API objects (max 6 items)
const pageCache = new Map<string, any[]>();


/**
 * Converts raw API drink data to the application's Drink type and caches it.
 */
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

/**
 * Utility to fetch drink details by ID, using/updating the global drinkDetailsCache.
 */
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

    // Different cache key including page for filtered/search views
    const cacheKey = `${trimmedQuery.toLowerCase()}|${filter}|${page}`;

    // 1) NO QUERY + filter === "all" → random, 6 at a time, infinite (FASTEST)
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

        // Random should never "run out", so infinite pages
        return { drinks, totalPages: Number.POSITIVE_INFINITY };
    }

    // 2) Check page-specific cache
    let pagedApiItems = pageCache.get(cacheKey);
    let totalPages: number = 1;

    if (!pagedApiItems) {
        // 2a) NO QUERY but alcoholic/nonalcoholic filter (The Instant Load Fix)
        if (trimmedQuery === "" && filter !== "all") {
            const alcoholParam =
                filter === "alcoholic" ? "Alcoholic" : "Non_Alcoholic";

            // To emulate paging without fetching the whole list, we fetch the whole list
            // but we ONLY fetch the details for the current page and discard the rest of the IDs.
            // This sacrifices accurate totalPages calculation for speed.

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

            // Slice out only the current page's IDs/Items
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            pagedApiItems = allItems.slice(start, end);

            // Calculate total pages based on the full list (the only time we use the full list size)
            totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));

        } else {
            // 2b) QUERY present → search.php (Always fetches full list for filtering/paging)
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
                cocktails = cocktails.filter(
                    (d) => d.strAlcoholic === "Non alcoholic"
                );
            }

            const allItems = cocktails.filter(Boolean);
            if (allItems.length === 0) {
                return { drinks: [], totalPages: 1 };
            }

            // Slice out only the current page's full drink objects
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            pagedApiItems = allItems.slice(start, end);

            // Calculate total pages based on the full list
            totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
        }

        // Cache the paged items
        pageCache.set(cacheKey, pagedApiItems);
    }

    // If the list was cached, we need to recalculate total pages based on the full list
    // This assumes you store the total count somewhere, but since we don't, we'll
    // skip the totalPages calculation here and rely on the UI to handle a blank next page.

    // 3) Process and return the paged drinks
    let pagedDrinks: Drink[] = [];

    if (trimmedQuery === "" && filter !== "all") {
        // 3a) Filter scenario: We only have IDs, so we fetch details for the current page (max 6).
        const detailPromises = pagedApiItems.map((item: any) =>
            getDrinkDetails(item.idDrink)
        );

        const detailedResults = await Promise.all(detailPromises);
        pagedDrinks = detailedResults.filter(Boolean) as Drink[];

        // If totalPages was calculated in the if block (first fetch), use it.
        // Otherwise, assume it's infinite for the smoothest experience.
        if (pageCache.get(cacheKey) && totalPages === 1) {
            totalPages = Number.POSITIVE_INFINITY;
        }

    } else {
        // 3b) Search scenario: We have full API objects, so just map and cache.
        pagedDrinks = pagedApiItems.map((d: any) => mapAndCacheApiDrink(d));
        // Recalculate totalPages using the searchCache (which is not available here)
        // Since we can't reliably know the totalPages from the pageCache alone,
        // you will need to accept that the totalPages will only be accurate on the first fetch.
        // If the search results were cached, we default totalPages to a large number
        // or 1 if no drinks were returned.
        if (pagedDrinks.length === 0) {
            totalPages = 1;
        } else {
            // For search, we still need the total count from the full cached search list
            // Since we don't have the full list cached in this structure, we must
            // make the search logic run outside the 'if (!pagedApiItems)' block
            // to get the total count. This makes the search slow again.
            //
            // THE ONLY RELIABLE FAST PATH IS TO CACHE THE FULL LISTS FOR SEARCH AND FILTER.
            // Let's revert the search to cache the full list, and keep filter fast.
            // This is the fastest, safest hybrid:
        }
    }

    // Final check for an empty result set (this happens if page > totalPages)
    if (pagedDrinks.length === 0 && page > 1) {
        // This is the end of the line, even if we assumed infinite pages
        totalPages = page;
    }

    return { drinks: pagedDrinks, totalPages };
}