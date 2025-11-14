export type Drink = {
    name: string;
    description: string;
    alcoholic: boolean;
    rating: number;
    icon: string;
};

type ApiResponse = {
    pagination: { count: number; pages: number };
    data: any[];
};

export async function fetchDrinks(
    page: number = 1
): Promise<{ drinks: Drink[]; totalPages: number }> {
    const res = await fetch(
        `https://boozeapi.com/api/v1/cocktails?page=${page}`
    );
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data: ApiResponse = await res.json();
    const cocktails = Array.isArray(data.data) ? data.data : [];

    const drinks: Drink[] = cocktails.map((d: any) => ({
        name: d.name ?? "Unknown",
        description: d.description ?? "No description.",
        alcoholic:
            d.alcoholic ??
            d.is_alcoholic ??
            (typeof d.abv === "number" ? d.abv > 0 : false),
        rating: d.rating ?? 0,
        icon: d.image ?? d.image_url ?? d.thumbnail ?? "/empty.png"
    }));

    const totalPages = data.pagination?.pages ?? 1;

    return { drinks, totalPages };
}
