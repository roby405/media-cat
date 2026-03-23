import 'dotenv/config';

import { InstallGlobalCommands } from './utils.js';

const TV_COMMAND = {
  name: 'tv',
  description: 'Get information about a movie/TV show',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the movie/TV show',
      required: true
    },
    {
      type: 3,
      name: 'director',
      description: 'The director of the movie/TV show',
      required: false
    },
    {
      type: 3,
      name: 'year',
      description: 'The release year of the movie/TV show',
      required: false
    },
    {
      type: 3,
      name: 'actor',
      description: 'An actor in the movie/TV show',
      required: false 
    }
  ],
  type: 1,
  integration_types: [0, 1],
}

const ANIME_COMMAND = {
  name: 'anime',
  description: 'Get information about an anime',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the anime',
      required: true
    },
    {
      type: 3,
      name: 'year',
      description: 'The release year of the anime',
      required: false
    },
  ],
  type: 1,
  integration_types: [0, 1],
}

const MANGA_COMMAND = {
  name: 'manga',
  description: 'Get information about a manga',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the manga',
      required: true
    },
    {
      type: 3,
      name: 'year',
      description: 'The release year of the manga',
      required: false
    },
  ],
  type: 1,
  integration_types: [0, 1],
}

const GAME_COMMAND = {
  name: 'game',
  description: 'Get information about a game',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the game',
      required: true
    },
    {
      type: 3,
      name: 'year',
      description: 'The release year of the game',
      required: false
    },
  ],
  type: 1,
  integration_types: [0, 1],
}

const BOOK_COMMAND = {
  name: 'book',
  description: 'Get information about a book',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the book',
      required: true
    },
    {
      type: 3,
      name: 'author',
      description: 'The author of the book',
      required: false
    },
    {
      type: 3,
      name: 'year',
      description: 'The release year of the book',
      required: false
    },
  ],
  type: 1,
  integration_types: [0, 1],
}

const VN_COMMAND = {
  name: 'vn',
  description: 'Get information about a visual novel',
  options: [
    {
      type: 3,
      name: 'title',
      description: 'The title of the visual novel',
      required: true
    }
  ],
  type: 1,
  integration_types: [0, 1],
}

const ALL_COMMANDS = [TV_COMMAND, ANIME_COMMAND, GAME_COMMAND, BOOK_COMMAND, VN_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
