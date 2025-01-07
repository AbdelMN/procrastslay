import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

export type Tasklist = {
  id: string;
  title: string;
  userId: number;
};

export type TaskToCreate = {
  title: string;
  difficulty: number;
  tasklistId: string;
};

export type Task = {
  id: string;
  title: string;
  difficulty: number;
  tasklistId: string;
  completed: boolean;
};

const fetchTasklist = async () =>
  ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  }).json() as unknown as Tasklist[];

const fetchTasks = async (tasklistId: string) =>
  ky(`http://localhost:3000/tasklist/${tasklistId}/tasks`, {
    credentials: 'include',
  }).json() as unknown as Task[];

export const postTask = async ({
  title,
  difficulty,
  tasklistId,
}: TaskToCreate) =>
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

export const getTasksQuery = (id: string) =>
  queryOptions({
    queryKey: ['tasks', id],
    queryFn: () => fetchTasks(id),
  });
