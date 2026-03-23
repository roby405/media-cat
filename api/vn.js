export const getVNInfo = async ({ name }) => {
    const res = await fetch("https://api.vndb.org/kana/vn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filters: ["search", "=", name],
            fields: "title, image.url, length_minutes, rating, tags.name, tags.rating, description",
        })
    });
    const data = await res.json();
    const vn = data?.results?.[0] || data?.[0] || null;
    if (!vn) {
        return {
            type: 'error',
            error: `No results found for ${name}${year ? ` (${year})` : ''}`
        };
    }

    return {
        type: 'vn',
        name: vn.title,
        cover: vn.image?.url || null,
        length_minutes: vn.length_minutes,
        rating: vn.rating ?? 0,
        tags: vn.tags?.map((t) => t.name).join(', ') || 'Unknown',
        url: `https://vndb.org/v/${vn.id || ''}`,
        synopsis: vn.description || 'No description available',
    };
};