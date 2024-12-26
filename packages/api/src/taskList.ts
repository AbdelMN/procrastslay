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
      const result = await prisma.tasklist.findMany({
        where: {
          userId: user.user.id,
        },
      });
      return c.json(result);
    }
  }
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const title = body.title;
      const userId = user.user.id;

      const tasklist = await prisma.tasklist.create({
        data: {
          title,
          userId,
        },
      });
      console.log(tasklist);
    }
  }
});
app.post('/delete', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const id = body.id;
      const userId = user.user.id;

      const tasklist = await prisma.tasklist.delete({
        where: {
          id: id,
          userId: user.user.id,
        },
      });
      console.log(tasklist);
    }
  }
});
export default app;
