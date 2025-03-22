import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import authRoute from './auth/auth';
import callbackRoute from './auth/notionCallback';
import taskRoute from './task';
import taskListRoute from './taskList';
import habitRoute from './habits';
import userRoute from './user';
import goalsRoute from './goals';
import trainRoute from './train';
import { cors } from 'hono/cors';

const app = new Hono({ strict: false }).basePath('/');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.route('/auth/', authRoute);
app.route('/auth/callback', callbackRoute);
app.route('/task', taskRoute);
app.route('/tasklist', taskListRoute);
app.route('/habit', habitRoute);
app.route('/user', userRoute);
app.route('/goals', goalsRoute);
app.route('/train', trainRoute);
const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
