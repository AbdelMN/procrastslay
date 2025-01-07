import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

export type Tasklist = {
  id: number;
  title: string;
  userId: number;
};

export type TaskToCreate = {
  title: string;
  difficulty: number;
  tasklistId: number;
};

export type Task = {
  id: number;
  title: string;
  difficulty: number;
  tasklistId: number;
  completed: boolean;
};

const fetchTasklist = async () =>
  ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  }).json() as unknown as Tasklist[];

const fetchTasks = async (tasklistId: number) =>
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

export const getTasksQuery = (id: number) =>
  queryOptions({
    queryKey: ['tasks', id],
    queryFn: () => fetchTasks(id),
  });
