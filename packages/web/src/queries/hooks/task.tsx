import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const patchTask = async ({
  id,
  title,
  difficulty,
  taskListId,
  completed,
}: {
  id: number;
  title: string;
  difficulty: number;
  taskListId: number;
  completed: boolean;
}) => {
  const response = await ky
    .patch(`http://localhost:3000/task/${id}`, {
      credentials: 'include',
      json: {
        title: title,
        difficulty: difficulty,
        tasklistId: taskListId,
        completed: completed,
      },
    })
    .json();
  return response;
};

export const useEditTask = (taskListId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.taskListId],
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskListId],
      });
    },
  });
};
