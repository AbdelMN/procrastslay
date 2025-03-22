import { Hono } from 'hono';
const app = new Hono();
import { prisma } from './prisma';
import sessionMiddleware from './auth/sessionMiddleware';

app.get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');
  if (user) {
    const result = await prisma.train.findUnique({
      where: { userId: user.id },
    });

    return c.json(result);
  }
});

export default app;
