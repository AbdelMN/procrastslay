import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { HabitType } from '../habit';

const completeHabit = async ({
  habitId,
  count,
  date,
}: {
  habitId: string;
  count: number;
  date: Date;
}) =>
  await ky
    .post('http://localhost:3000/habit/complete', {
      credentials: 'include',
      json: {
        habitId: habitId,
        count: count,
        date: date,
      },
    })
    .json();

const patchHabit = async (habit: HabitType & { id: string }) =>
  await ky
    .patch(`http://localhost:3000/habit/${habit.id}`, {
      credentials: 'include',
      json: {
        ...habit,
      },
    })
    .json();

const postDeleteHabit = async (habitId: string) => {
  const response = await ky
    .post('http://localhost:3000/habit/delete', {
      credentials: 'include',
      json: { id: habitId },
    })
    .json();

  return response;
};
export const useCompleteHabit = (day?: Date) => {
  const queryClient = useQueryClient();
  console.log(day);
  return useMutation({
    mutationFn: completeHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: day ? ['habits', day] : ['habits'],
      });
    },
  });
};

export const useEditHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['habits'],
      });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['habits'],
      });
    },
  });
};
