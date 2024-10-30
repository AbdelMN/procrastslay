import { serve } from '@hono/node-server';
import { Hono, Context } from 'hono';
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';
import GitHub from '@auth/core/providers/github';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono({ strict: false }).basePath('/');

app.use(
  '*',
  cors({Ò
    origin: (origin) => origin,
    allowHeaders: ['Content-Type'],
    allowMethods: ['*'],
    maxAge: 86400,
    credentials: true,
  }),
);

app.use(
  '*',
  initAuthConfig((c: Context) => ({
    secret: process.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  })),
);

app.use('/api/auth/*', authHandler());

app.use('/api/*', verifyAuth());

app.get('/api/protected', async (c) => {
  const auth = c.get('authUser');
  return c.json(auth);
});

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
