import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { validateSessionToken } from './sessions';

const sessionMiddleware = createMiddleware<{
  Variables: {
    user: {
      id: string;
      notionId: string | null;
      notionUsername: string | null;
      notionAccessToken: string | null;
    };
  };
}>(async (c, next) => {
  const session = getCookie(c, 'session');
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await validateSessionToken(session);
  if (!user.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user.user);

  await next();
});

export default sessionMiddleware;
