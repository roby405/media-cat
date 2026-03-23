import 'dotenv/config';

const accessToken = await getAccessToken();

async function getAccessToken() {
  const base = "https://api.igdb.com/v4";
  const accessSearchParams = new URLSearchParams({
    client_id: process.env.IGDB_ID,
    client_secret: process.env.IGDB_SECRET,
    grant_type: "client_credentials"
  });
  const accessRes = await fetch(`https://id.twitch.tv/oauth2/token?${accessSearchParams.toString()}`, {
    method: "POST"
  });
  const accessData = await accessRes.json();
  return accessData.access_token;
}

export async function getGameInfo({ title, year }) {
  const base = "https://api.igdb.com/v4";
  const res = await fetch(`${base}/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_ID,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain"
    },
    body: `search "${title}"; fields name,summary,cover.url,first_release_date,rating,genres.name,involved_companies.company.name; limit 1;`
  });

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return {
      type: 'error',
      error: `No results found for ${title}${year ? ` (${year})` : ''}`
    };
  }

  const game = data[0];
  const cover = game.cover?.url ? game.cover.url.replace('t_thumb', 't_cover_big').replace('t_1080p', 't_720p') : null;
  const release_date = game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : undefined;

  return {
    type: 'game',
    name: game.name,
    summary: game.summary || 'No summary available',
    cover,
    rating: game.rating ?? 0,
    release_date,
    genres: game.genres?.map((g) => g.name).join(', ') || 'Unknown',
    developers: game.involved_companies
      ?.map((ic) => ic.company?.name)
      .filter(Boolean)
      .join(', ') || 'Unknown',
    url: `https://www.igdb.com/games/${encodeURIComponent((game.name || '').toLowerCase().replace(/\s+/g, '-'))}`,
  };
}
