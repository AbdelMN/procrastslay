import {
  Box,
  Button,
  Input,
  createListCollection,
  Flex,
} from '@chakra-ui/react';

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

import ky from 'ky';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchTasklist = async () => {
  const response = await ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  });

  return response.json();
};

const postTask = async ({
  title,
  difficulty,
  tasklistId,
}: {
  title: string;
  difficulty: number;
  tasklistId: number;
}) => {
  const response = await ky
    .post('http://localhost:3000/task', {
      credentials: 'include',
      json: { title: title, difficulty: difficulty, tasklistId: tasklistId },
    })
    .json();
  console.log(response);
  return response;
};
const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.tasklistId],
      });
    },
  });
};
const AddTask = ({ taskListId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const addTask = useAddTask();
  const { data } = useQuery({
    queryKey: ['tasklist'],
    queryFn: fetchTasklist,
    enabled: true,
    retry: false,
  });

  const tasklist = data
    ? createListCollection({
        items: data.map((item) => ({
          label: item.title,
          value: item.id.toString(),
        })),
      })
    : null;

  const difficulty = createListCollection({
    items: [
      { label: 'Easy', value: '1' },
      { label: 'Hard', value: '2' },
      {
        label: 'Mega Hard',
        value: '3',
      },
    ],
  });
  const form = useForm({
    defaultValues: {
      title: '',
      tasklist: [taskListId.toString()],
      difficulty: [''],
      duedate: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      addTask.mutate({
        title: value.title,
        difficulty: +value.difficulty[0],
        tasklistId: +value.tasklist[0],
      });
    },
  });

  return isOpen ? (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => {
            return (
              <>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            );
          }}
        />
        <Flex direction={'row'} alignItems="center" gap={1}>
          <form.Field
            name="difficulty"
            children={(field) => {
              return (
                <Box>
                  <SelectRoot
                    name={field.name}
                    value={field.state.value}
                    onValueChange={({ value }) => {
                      field.handleChange(value);
                    }}
                    collection={difficulty}
                    width="100px"
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulty.items.map((difficulty) => (
                        <SelectItem item={difficulty} key={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Box>
              );
            }}
          />
          <form.Field
            name="duedate"
            children={(field) => {
              return (
                <Box>
                  <Input
                    width={'150px'}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Box>
              );
            }}
          />
        </Flex>
        <Flex
          direction={'row'}
          justifyContent={'space-between'}
          alignItems="center"
          gap={1}
        >
          <form.Field
            name="tasklist"
            children={(field) => {
              return (
                <>
                  <SelectRoot
                    name={field.name}
                    value={field.state.value}
                    onValueChange={({ value }) => {
                      field.handleChange(value);
                    }}
                    collection={tasklist}
                  >
                    <SelectTrigger clearable>
                      <SelectValueText placeholder="Select tasklist" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasklist.items.map((tasklist) => (
                        <SelectItem item={tasklist} key={tasklist.value}>
                          {tasklist.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </>
              );
            }}
          />
          <Flex direction={'row'} gap={1}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  ) : (
    <Button onClick={() => setIsOpen(true)}>Add Task</Button>
  );
};

export default AddTask;
