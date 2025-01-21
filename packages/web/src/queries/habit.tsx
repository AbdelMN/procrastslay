import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';
export type HabitType = {
  id: string;
  userId: string;
  name: string;
  completionMode: string;
  goalValue: number;
  unit?: string;
  createdAt: string;
  completions: HabitCompletion[] | [];
} & (
  | {
      frequencyType: 'interval' | 'weekly';
      frequencyValue: number;
    }
  | {
      frequencyType: 'daily';
      days: string[];
    }
);

type HabitCompletion = {
  id: string;
  habitId: string;
  count: number;
  date: Date;
};

const fetchHabits = async () =>
  ky('http://localhost:3000/habit', {
    credentials: 'include',
  }).json() as unknown as HabitType[];

const fetchHabitsbyDate = async (date: Date) =>
  ky
    .post('http://localhost:3000/habit/getbydate', {
      credentials: 'include',
      json: {
        date: date.toISOString(),
      },
    })
    .json() as unknown as HabitType[];

export const getHabits = (day?: string) =>
  queryOptions({
    queryKey: day ? ['habits', day] : ['habits'],
    queryFn: day ? () => fetchHabitsbyDate(new Date(day)) : fetchHabits,
  });
