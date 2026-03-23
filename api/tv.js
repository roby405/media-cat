import 'dotenv/config';

export async function getTvInfo({ query }) {
    const base = "https://api.themoviedb.org/3/search/multi";
    const searchParams = new URLSearchParams({
        query: query,
        include_adult: true
    });
    const res = await fetch(`${base}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
        }
    });
    const data = await res.json();
    const media = data.results[0];
    if (media.media_type === "person") {
        return {
            type: "person",
            name: media.name,
            cover: media.profile_path ? `https://image.tmdb.org/t/p/w500${media.profile_path}` : null,
            known_for: media.known_for?.map((tv) => tv.title || tv.name).filter(Boolean).join(", ") || 'Unknown',
            known_for_department: media.known_for_department || 'Unknown',
            popularity: media.popularity ?? 0,
            id: media.id,
        };
    } else {
        return {
            type: media.media_type,
            id: media.id,
            name: media.title || media.name,
            cover: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
            overview: media.overview || 'No overview available',
            rating: media.vote_average ?? 0,
            vote_count: media.vote_count ?? 0,
            release_date: media.release_date || media.first_air_date || 'Unknown',
            url: `https://www.themoviedb.org/${media.media_type}/${media.id}`,
        };
    }
}