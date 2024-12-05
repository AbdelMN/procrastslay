import { Hono } from 'hono';
import { generateSessionToken, createSession } from './sessions';
import { setSessionTokenCookie } from './cookies';
import { notion } from './notion';
import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import type { OAuth2Tokens } from 'arctic';
import { prisma } from '../prisma';
const app = new Hono();
app.get('/', async (c: Context) => {
  const { code, state } = c.req.query();

  const storedState = getCookie(c, 'notion_oauth_state');

  if (storedState !== state) {
    return c.text('Invalid state', 400);
  }

  if (!code || !state) {
    return c.text('Invalid request', 400);
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await notion.validateAuthorizationCode(code);
  } catch (e) {
    return c.text('Failed to get access token', 400);
  }
  console.log('toksen' + tokens.accessToken());
  const notionResponse = await fetch('https://api.notion.com/v1/users/me', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
      'Notion-Version': '2022-06-28',
    },
  });

  const notionUser = await notionResponse.json();

  const notionId: string = notionUser.bot.owner.user.id;

  const notionUsername: string = notionUser.bot.owner.user.name;
  const notionAccessToken: string = tokens.accessToken();
  const existingUser = await prisma.user.findUnique({
    where: {
      notionId,
    },
  });

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(c, sessionToken, session.expiresAt);
    console.log(existingUser);

    return c.redirect('http://localhost:5173/dashboard');
  }

  const user = await prisma.user.create({
    data: {
      notionId,
      notionUsername,
      notionAccessToken,
    },
  });
  console.log('user:' + user);
  console.log(user.notionAccessToken);
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(c, sessionToken, session.expiresAt);

  return c.redirect('http://localhost:5173/dashboard');
});

export default app;
