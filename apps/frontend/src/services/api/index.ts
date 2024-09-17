import Client from './Client';

export const petApi = new Client({
  baseURL: process.env.API_BASE_URL,
});
