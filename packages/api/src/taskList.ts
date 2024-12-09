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
      console.log(result);
    }
  }
});

export default app;
