import { Hono } from 'hono';
import { generateSessionToken, createSession } from './sessions';
import { setSessionTokenCookie } from './cookies';
import { github } from './github';
import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import type { OAuth2Tokens } from 'arctic';
import { prisma } from '../prisma';
const app = new Hono();
app.get('/', async (c: Context) => {
  const { code, state } = c.req.query();

  const storedState = getCookie(c, 'github_oauth_state');
  if (storedState !== state) {
    return c.text('Invalid state', 400);
  }

  if (!code || !state) {
    return c.text('Invalid request', 400);
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    return c.text('Failed to get access token', 400);
  }
  console.log('toksen' + tokens.accessToken());
  const githubResponse = await fetch(
    // TODO: use the github client
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `token ${tokens.accessToken()}`,
      },
    },
  );

  const githubUser = await githubResponse.json();

  const githubId: number = githubUser.id;
  console.log(githubUser);
  const githubUsername: string = githubUser.login;
  const existingUser = await prisma.user.findUnique({
    where: {
      githubId,
    },
  });

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(c, sessionToken, session.expiresAt);
    console.log(existingUser);
    return c.redirect('http://localhost:5173/');
  }

  const user = await prisma.user.create({
    data: {
      githubId,
      githubUsername,
    },
  });
  console.log('user:' + user);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(c, sessionToken, session.expiresAt);
  console.log('session:' + session);
  return c.redirect('http://localhost:5173/dashboard');
});

export default app;
