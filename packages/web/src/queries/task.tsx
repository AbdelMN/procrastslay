import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

export type Tasklist = {
  id: number;
  title: string;
  userId: number;
};

export type Task = {
  title: string;
  difficulty: number;
  tasklistId: number;
};

const fetchTasklist = async () =>
  ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  }).json() as unknown as Tasklist[];

export const postTask = async ({ title, difficulty, tasklistId }: Task) =>
  ky
    .post('http://localhost:3000/task', {
      credentials: 'include',
      json: { title: title, difficulty: difficulty, tasklistId: tasklistId },
    })
    .json() as unknown as Task;

export const tasklistQuery = queryOptions({
  queryKey: ['tasklist'],
  queryFn: fetchTasklist,
});
