import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const completeHabit = async ({
  habitId,
  count,
  date,
}: {
  habitId: string;
  count: number;
  date: Date;
}) => {
  console.log(habitId);
  const reponse = await ky
    .post('http://localhost:3000/habit/complete', {
      credentials: 'include',
      json: {
        habitId: habitId,
        count: count,
        date: date,
      },
    })
    .json();
  return reponse;
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
