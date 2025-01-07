import { Box, Button, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Field } from '@/components/ui/field';

const editTaskList = async (id: string, title: string) => {
  const response = await ky
    .patch(`http://localhost:3000/tasklist/${id}`, {
      credentials: 'include',
      json: { title: title },
    })
    .json();
  return response;
};

const EditTaskList = ({
  taskListId,
  refetch,
}: {
  taskListId: string;
  refetch: () => void;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      newTasklistName: '',
    },
  });

  return (
    <DialogRoot
      open={isEditOpen}
      onOpenChange={(isOpen) => setIsEditOpen(isOpen.open)}
      placement="center"
    >
      <DialogTrigger asChild>
        <Box width={'100%'}>Edit</Box>
      </DialogTrigger>
      <DialogContent onClick={(event) => event.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit a tasklist</DialogTitle>
        </DialogHeader>
        <DialogBody pb="8">
          <form
            onSubmit={handleSubmit((data) => {
              console.log();
              editTaskList(taskListId, data.newTasklistName);
              setIsEditOpen(false);
              refetch();
            })}
          >
            <Stack gap="4" align="flex-start" maxW="sm">
              <Field label="New tasklist Name">
                <Input {...register('newTasklistName')} />
              </Field>

              <Button type="submit">Confirm </Button>
            </Stack>
          </form>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditTaskList;
