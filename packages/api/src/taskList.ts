import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from './auth/sessions';
import { prisma } from './prisma';

app.get('/', async (c) => {
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const result = await prisma.databases.findMany({
        where: {
          userId: user.user.id,
        },
      });
      const tasklist = result.map((tasklist: any) => {
        return {
          title: tasklist.notionDbName,
          type: tasklist.type,
          id: tasklist.id,
        };
      });
      return c.json(tasklist);
    }
  }
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const ti;
      return c.json(titles);
    }
  }
});

export default app;
