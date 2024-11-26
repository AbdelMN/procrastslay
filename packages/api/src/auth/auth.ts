import { Hono } from 'hono';
import { generateState } from 'arctic';
import { github } from './github';
import { getCookie, setCookie } from 'hono/cookie';
import { validateSessionToken } from './sessions';
import { deleteSessionTokenCookie } from './cookies';
const app = new Hono();

app.get('/github', async (c) => {
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

app.get('/session', async (c) => {
  const session = getCookie(c, 'session');
  const user = await validateSessionToken(session);
  console.log(user);
  return c.json({ user });
});

app.get('/logout', async (c) => {
  deleteSessionTokenCookie(c);
  return c.redirect('http://localhost:5173/');
});
export default app;
