import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getGameInfo } from './api/game.js';
import { getTvInfo } from './api/tv.js';
import { getAnimeInfo, getMangaInfo } from './api/anime.js';
import { getBookInfo } from './api/book.js';
import { getVNInfo } from './api/vn.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data } = req.body;
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    if (name === 'tv') {
      const tvInfo = await getTvInfo({ query: data.options[0].value });
      if (tvInfo.type === 'person') {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                title: tvInfo.name,
                description: `${tvInfo.known_for_department} - Popularity: ${tvInfo.popularity}`,
                color: 0x0099ff,
                thumbnail: tvInfo.cover ? { url: tvInfo.cover } : undefined,
                fields: [
                  { name: 'Known for', value: tvInfo.known_for || 'N/A', inline: false },
                  { name: 'TMDB ID', value: tvInfo.id.toString(), inline: true },
                ],
              },
            ],
          },
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: tvInfo.name,
              url: tvInfo.url || `https://www.themoviedb.org/${tvInfo.type}/${tvInfo.id}`,
              description: tvInfo.overview,
              color: 0x0099ff,
              image: tvInfo.cover ? { url: tvInfo.cover } : undefined,
              fields: [
                { name: 'Rating', value: tvInfo.rating ? Number(tvInfo.rating).toFixed(2) : 'Unknown', inline: true },
                { name: 'Release Date', value: tvInfo.release_date || 'Unknown', inline: true },
                { name: 'Vote Count', value: tvInfo.vote_count?.toString() || 'Unknown', inline: true },
              ],
            },
          ],
        },
      });
    }
    if (name === 'anime' || name === 'manga') {
      const query = data.options[0].value;
      const anime = name === 'anime' ? await getAnimeInfo({ query }) : await getMangaInfo({ query });
      if (anime.type === 'error') {
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: anime.error } });
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: anime.title,
              url: anime.url,
              description: anime.synopsis,
              color: 0x0099ff,
              image: anime.cover ? { url: anime.cover } : undefined,
              fields: [
                { name: 'Score', value: anime.score ? anime.score.toString() : 'Unknown', inline: true },
                { name: 'Popularity', value: anime.popularity ? `#${anime.popularity.toString()}` : 'Unknown', inline: true },
                { name: 'Genres', value: anime.genres?.map((g) => g.name).join(', ') || 'Unknown', inline: false },
              ],
            },
          ],
        },
      });
    }

    if (name === 'game') {
      const query = data.options[0].value;
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      });
      try {
        const game = await getGameInfo({ title: query });
        if (game.type === 'error') {
          return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: game.error } });
        }
        console.log(game);
        const response = await fetch(`https://discord.com/api/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            embeds: [
              {
                title: game.name,
                url: game.url,
                description: game.summary.slice(0, 200) + '...',
                color: 0x0099ff,
                image: game.cover ? { url: `https:${game.cover}` } : undefined,
                fields: [
                  { name: 'Rating', value: game.rating ? game.rating.toFixed(2).toString() : 'Unknown', inline: true },
                  { name: 'Release Date', value: game.release_date || 'Unknown', inline: true },
                  { name: 'Genres', value: game.genres || 'Unknown', inline: false },
                  { name: 'Developers', value: game.developers || 'Unknown', inline: false },
                ],
              },
            ],
          }),
        });
      } catch (err) {
        console.error('Error sending message:', err);
      }
      return;
    }

    if (name === 'book') {
      const query = data.options[0].value;
      console.log(`Searching for book: ${query}`);
      const book = await getBookInfo({ title: query });
      console.log(book);
      if (book.type === 'error') {
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: book.error } });
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: book.title,
              url: book.url,
              description: book.description.slice(0, 500) + '...' || 'No description available',
              color: 0x0099ff,
              fields: [
                { name: 'Author(s)', value: book.authors || 'Unknown', inline: true },
                { name: 'Release Year', value: book.release_year?.toString() || 'Unknown', inline: true },
              ],
            },
          ],
        },
      });
    }

    if (name === 'vn') {
      const query = data.options[0].value;
      const vn = await getVNInfo({ name: query });
      if (vn.type === 'error') {
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: vn.error } });
      }
      console.log(vn);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: vn.name,
              url: vn.url,
              description: vn.synopsis.slice(0, 200) + '...' || 'No description available',
              color: 0x0099ff,
              thumbnail: vn.cover ? { url: vn.cover } : undefined,
              fields: [
                { name: 'Rating', value: vn.rating ? ((vn.rating)/10).toFixed(2).toString() : 'Unknown', inline: true },
                { name: 'Length', value: vn.length_minutes ? `${vn.length_minutes} minutes` : 'Unknown', inline: true },
                { name: 'Tags', value: vn.tags.slice(0, 100) || 'Unknown', inline: false },
              ],
            },
          ],
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
