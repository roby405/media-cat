export async function getAnimeInfo({ query, year }) {
    const base = "https://api.jikan.moe/v4/anime";
    const searchParams = new URLSearchParams({
        q: query,
        limit: 1
    });
    if (year)
        searchParams.append("start_date", `${year}-01-01`);

    const res = await fetch(`${base}?${searchParams.toString()}`);
    const data = await res.json();
    if (data.data.length === 0) {
        return {
            type: 'error',
            error: `No results found for ${query} ${year ? year : ''}`,
        }
    }
    return {
        type: 'success',
        title: data.data[0].title,
        url: data.data[0].url,
        cover: data.data[0].images.jpg.image_url,
        synopsis: data.data[0].synopsis,
        score: data.data[0].score,
        popularity: data.data[0].popularity,
        genres: data.data[0].genres,
        themes: data.data[0].themes,
    }
}

export async function getMangaInfo({ query, year }) {
    const base = "https://api.jikan.moe/v4/manga";
    const searchParams = new URLSearchParams({
        q: query,
        limit: 1
    });
    if (year)
        searchParams.append("start_date", `${year}-01-01`);

    const res = await fetch(`${base}?${searchParams.toString()}`);
    const data = await res.json();
    if (data.data.length === 0) {
        return {
            type: 'error',
            error: `No results found for ${query} ${year ? year : ''}`,
        }
    }
    return {
        type: 'success',
        title: data.data[0].title,
        url: data.data[0].url,
        cover: data.data[0].images.jpg.image_url,
        synopsis: data.data[0].synopsis,
        score: data.data[0].score,
        popularity: data.data[0].popularity,
        genres: data.data[0].genres,
        themes: data.data[0].themes,
    }
}