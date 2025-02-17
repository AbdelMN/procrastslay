import { Hono } from 'hono';
import sessionMiddleware from './auth/sessionMiddleware';
import { prisma } from './prisma';

const app = new Hono();

app.get('/infos', sessionMiddleware, async (c) => {
  const user = c.get('user');

  if (user) {
    const result = await prisma.user.findFirst({
      where: { id: user.id },
      select: { fuel: true, streak: true },
    });
    return c.json(result);
  }
});

export default app;
