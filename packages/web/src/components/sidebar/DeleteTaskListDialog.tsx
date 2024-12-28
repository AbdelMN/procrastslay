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

const deleteTasklist = async (id: number) => {
  const response = await ky
    .post('http://localhost:3000/tasklist/delete', {
      credentials: 'include',
      json: { id: id },
    })
    .json();

  return response;
};

const DeleteTaskList = ({
  taskListId,
  refetch,
}: {
  taskListId: number;
  refetch: () => void;
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onClickDelete = async (id: number) => {
    await deleteTasklist(id);

    refetch();
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
          Are you sure you want to delete this tasklist?
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => {
              onClickDelete(taskListId);
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

export default DeleteTaskList;
