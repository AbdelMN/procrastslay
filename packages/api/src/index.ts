import { serve } from '@hono/node-server';

import { Hono } from 'hono';
import authRoute from './auth/auth';
import callbackRoute from './auth/notionCallback';
import notionImportRoute from './notion/importTaskList';
import notionTaskListRoute from './taskList';
const app = new Hono({ strict: false }).basePath('/');

app.route('/auth/', authRoute);
app.route('/auth/callback', callbackRoute);
app.route('/notion/import', notionImportRoute);
app.route('notion/tasklist', notionTaskListRoute);
const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
