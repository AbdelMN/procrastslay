import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

type ReceivedGoalType = {
  id: string;
  habit: { goal: number; completed: number }[];
  pomodoro: { duration: string; goal: number; completed: number }[];
  task: { goal: number; difficulty: string; completed: number }[];
  date: Date;
  active: boolean;
};
const fetchCurrentGoal = async () =>
  (await ky('http://localhost:3000/goals/current', {
    credentials: 'include',
  }).json()) as ReceivedGoalType[];

export const getCurrentGoal = () =>
  queryOptions({ queryKey: ['goals'], queryFn: fetchCurrentGoal });
