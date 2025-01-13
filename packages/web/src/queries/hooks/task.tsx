import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const patchTask = async ({
  id,
  title,
  difficulty,
  taskListId,
  dueDate,
  completed,
}: {
  id: string;
  title: string;
  difficulty: string;
  taskListId: string;
  dueDate: Date;
  completed: boolean;
}) => {
  const response = await ky
    .patch(`http://localhost:3000/task/${id}`, {
      credentials: 'include',
      json: {
        title: title,
        difficulty: difficulty,
        tasklistId: taskListId,
        dueDate: dueDate,
        completed: completed,
      },
    })
    .json();
  return response;
};

export const useEditTask = (taskListId: string) => {
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
