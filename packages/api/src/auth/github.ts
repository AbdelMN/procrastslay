import { GitHub } from 'arctic';
import dotenv from 'dotenv';

dotenv.config();
const clientId = process.env.GITHUB_ID ?? '';
const clientSecret = process.env.GITHUB_SECRET ?? '';

// Vérification si les valeurs sont bien définies
if (!clientId || !clientSecret) {
  throw new Error('GH client id and secret must be defined in the .env file');
}

export const github = new GitHub(clientId, clientSecret, null);
