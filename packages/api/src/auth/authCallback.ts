import { Hono } from 'hono';
import { generateSessionToken, createSession } from './sessions';
import { setSessionTokenCookie } from './cookies';
import { github } from './github';
import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import type { OAuth2Tokens } from 'arctic';
import { prisma } from '../prisma';
const app = new Hono();
app.get('/auth/callback', async (c: Context) => {
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

  const githubResponse = await fetch(
    // TODO: use the github client
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `token ${tokens.accessToken}`,
      },
    },
  );

  const githubUser = await githubResponse.json();
  const githubId: number = githubUser.id;
  const githubUsername: string = githubUser.login;
  const existingUser = await prisma.user.findUnique({
    where: {
      githubId,
    },
  });

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(c, sessionToken, session.expiresAt);

    return c.redirect('/');
  }

  await prisma.user.create({
    data: {
      githubId,
      githubUsername,
    },
  });
  const session = await createSession(githubUser.login);
  setSessionTokenCookie(c, session.token, session.expiresAt);
  return c.redirect('/');
});

export default app;
