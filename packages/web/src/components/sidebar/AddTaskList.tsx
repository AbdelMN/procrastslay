import { Button, Input, Stack } from '@chakra-ui/react';
import { FaCirclePlus } from 'react-icons/fa6';
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
import { Field } from '@/components/ui/field';
import { useForm } from 'react-hook-form';

const postTaskList = async (title: string) => {
  const response = await ky
    .post('http://localhost:3000/tasklist', {
      credentials: 'include',
      json: { title: title },
    })
    .json();

  return response;
};

const AddTaskList = ({ refetch }: { refetch: () => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      tasklistName: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    postTaskList(data.tasklistName);
    setIsDialogOpen(false);
    refetch();
  });
  return (
    <DialogRoot
      open={isDialogOpen}
      onOpenChange={(isOpen) => setIsDialogOpen(isOpen.open)}
      placement="center"
    >
      <DialogTrigger asChild>
        <FaCirclePlus
          color="#d4d4d8"
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </DialogTrigger>
      <DialogContent
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add a tasklist</DialogTitle>
        </DialogHeader>
        <DialogBody pb="8">
          <form onSubmit={onSubmit}>
            <Stack gap="4" align="flex-start" maxW="sm">
              <Field label="Tasklist Name">
                <Input {...register('tasklistName')} />
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

export default AddTaskList;
