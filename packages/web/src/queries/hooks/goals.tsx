import { GoalFormType } from '@/components/goals/GoalFormSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const postGoal = async (goal: GoalFormType) => {
  const { habits, pomodoro, tasks } = goal;
  const result = await ky.post('http://localhost:3000/goals', {
    credentials: 'include',
    json: {
      habit: habits,
      pomodoro: pomodoro,
      tasks: tasks,
      date: '2025-03-18',
    },
  });
  console.log(result);
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['goals'],
      });
    },
  });
};
