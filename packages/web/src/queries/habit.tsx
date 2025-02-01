import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

export type HabitType = {
  name: string;
  completionMode: string;
  goalValue: number;
  unit?: string;
  createdAt: string;
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

export type ReceivedHabitType = HabitType & {
  id: string;
  completions: HabitCompletion[] | [];
  userId: string;
};

type HabitCompletion = {
  id: string;
  habitId: string;
  count: number;
  date: Date;
};

const fetchHabits = async () =>
  ky('http://localhost:3000/habit', {
    credentials: 'include',
  }).json() as unknown as ReceivedHabitType[];

export const postHabit = async (habit: HabitType) => {
  const { frequencyType, ...habitData } = habit;

  return ky.post('http://localhost:3000/habit', {
    credentials: 'include',
    json: {
      ...habitData,
      frequencyType,
      ...(frequencyType === 'interval' || frequencyType === 'weekly'
        ? { frequencyValue: habit.frequencyValue }
        : {}),
      ...(frequencyType === 'daily' ? { days: habit.days } : {}),
    },
  });
};

const fetchHabitsbyDate = async (date: Date) =>
  ky
    .post('http://localhost:3000/habit/getbydate', {
      credentials: 'include',
      json: {
        date: date.toISOString(),
      },
    })
    .json() as unknown as ReceivedHabitType[];

export const getHabits = (day?: string) =>
  queryOptions({
    queryKey: day ? ['habits', new Date(day)] : ['habits'],
    queryFn: day ? () => fetchHabitsbyDate(new Date(day)) : fetchHabits,
  });
