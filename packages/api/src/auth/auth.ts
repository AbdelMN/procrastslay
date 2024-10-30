import { Hono } from 'hono';
import { generateState } from 'arctic';
import { github } from './github';
import { setCookie } from 'hono/cookie';

const app = new Hono();

app.get('/', async (c) => {
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  setCookie(c, 'github_oauth_state', state, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    secure: true,
    maxAge: 60 * 10,
  });
  return c.redirect(url.toString());
});

export default app;
