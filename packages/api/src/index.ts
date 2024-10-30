import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import authRoute from './auth/auth';

const app = new Hono({ strict: false }).basePath('/');

app.route('/auth/github', authRoute);

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
