import {
  Flex,
  Box,
  Button,
  Collapsible,
  Input,
  Stack,
  Text,
  DialogFooter,
} from '@chakra-ui/react';
import {
  FaChevronRight,
  FaChevronDown,
  FaCirclePlus,
  FaEllipsis,
} from 'react-icons/fa6';
import { useState } from 'react';
import ky from 'ky';
import { useQuery } from '@tanstack/react-query';
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

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { useForm } from 'react-hook-form';
const fetchTasklist = async () => {
  const response = await ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  });
  return response.json();
};

const postTaskList = async (title: string) => {
  const response = await ky
    .post('http://localhost:3000/tasklist', {
      credentials: 'include',
      json: { title: title },
    })
    .json();
  return response;
};

const deleteTasklist = async (id: number) => {
  const response = await ky
    .post('http://localhost:3000/tasklist/delete', {
      credentials: 'include',
      json: { id: id },
    })
    .json();
  return response;
};
const TaskListNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ['tasklist'],
    queryFn: fetchTasklist,
    enabled: true,
    retry: false,
  });

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
    <Collapsible.Root
      onOpenChange={(open) => {
        console.log(open);
        setIsOpen(open.open);
      }}
    >
      <Collapsible.Trigger paddingY="3">
        <Flex align="center">
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          <Box ml="2">Task List</Box>
          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(isOpen) => setIsDialogOpen(isOpen.open)}
            placement="center"
          >
            <DialogTrigger asChild>
              <FaCirclePlus
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
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Flex direction={'column'}>
          {data && // Vérifie que data existe avant de mapper
            data.map((list) => (
              <Button justifyContent={'space-between'} key={list.id}>
                {list.title}{' '}
                <MenuRoot>
                  <MenuTrigger asChild>
                    <FaEllipsis />
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem value="edit">Edit</MenuItem>

                    <MenuItem
                      value="delete"
                      color="fg.error"
                      _hover={{ bg: 'bg.error', color: 'fg.error' }}
                      onClick={() => console.log(list.id)}
                    >
                      <DialogRoot placement="center">
                        <DialogTrigger>
                          <Text>Delete...</Text>
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
                            Are you sure you want to delete this tasklist ?
                          </DialogBody>
                          <DialogCloseTrigger />
                          <DialogFooter>
                            <Button onClick={() => deleteTasklist(list.id)}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </DialogRoot>
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              </Button>
            ))}
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default TaskListNav;
