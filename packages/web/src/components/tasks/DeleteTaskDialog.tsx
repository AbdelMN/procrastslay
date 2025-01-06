import { Box, Button, DialogFooter } from '@chakra-ui/react';
import { useState } from 'react';
import ky from 'ky';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Task } from '@/queries/task';

const postDeleteTask = async (task: Task) => {
  const response = await ky
    .post('http://localhost:3000/task/delete', {
      credentials: 'include',
      json: { id: task.id },
    })
    .json();

  return response;
};

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.tasklistId],
      });
    },
  });
};

const DeleteTask = ({ task }: { task: Task }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteTask = useDeleteTask();
  const onClickDelete = async () => {
    deleteTask.mutate(task);

    setIsDeleteOpen(false);
  };
  return (
    <DialogRoot
      open={isDeleteOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteOpen(isOpen.open);
      }}
      placement="center"
    >
      <DialogTrigger asChild>
        <Box width={'100%'}>Delete...</Box>
      </DialogTrigger>
      <DialogContent
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Tasklist</DialogTitle>
        </DialogHeader>
        <DialogBody pb="8">
          Are you sure you want to delete this task?
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => {
              onClickDelete();
            }}
          >
            Delete
          </Button>
          <DialogCloseTrigger asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogCloseTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteTask;
