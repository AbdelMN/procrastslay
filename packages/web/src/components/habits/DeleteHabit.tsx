import { Box, Button, DialogFooter } from '@chakra-ui/react';

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDeleteHabit } from '@/queries/hooks/habit';

const DeleteHabit = ({ habitId }: { habitId: string }) => {
  const deleteTask = useDeleteHabit();
  const onClickDelete = async () => {
    deleteTask.mutate(habitId);
  };
  return (
    <DialogRoot placement="center">
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

export default DeleteHabit;
