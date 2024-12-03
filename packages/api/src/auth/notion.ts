import { Notion } from 'arctic';
import dotenv from 'dotenv';

dotenv.config();
const clientId = process.env.NOTION_ID ?? '';
const clientSecret = process.env.NOTION_SECRET ?? '';
const redirectURI = process.env.NOTION_REDIRECT_URI ?? '';
if (!clientId || !clientSecret) {
  throw new Error('GH client id and secret must be defined in the .env file');
}
export const notion = new Notion(clientId, clientSecret, redirectURI);
