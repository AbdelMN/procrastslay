import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { FaEllipsis } from 'react-icons/fa6';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import DeleteTask from './DeleteTaskDialog';

import { tasklistQuery, type Task } from '@/queries/task';
import { useEditTask } from '@/queries/hooks/task';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';
import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';

const Task = ({ task }: { task: Task }) => {
  const editTask = useEditTask(task.tasklistId);
  const matchRoute = useMatchRoute();
  const navigate = useNavigate({ from: '/' });
  const isUrlEdit = matchRoute({
    to: `/tasklist/${task.tasklistId}/task/${task.id}/edit`,
  });
  type CustomInputProps = React.HTMLProps<HTMLButtonElement>;

  const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick, className }, ref) => (
      <button type="button" className={className} onClick={onClick} ref={ref}>
        {value}
      </button>
    ),
  );
  const { data, isPending, isError } = useQuery(tasklistQuery);

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
      title: task.title,
      tasklist: [task.tasklistId.toString()],
      difficulty: [task.difficulty],
      dueDate: task.dueDate,
    },
    onSubmit: async ({ value }) => {
      editTask.mutate({
        id: task.id,
        title: value.title,
        difficulty: value.difficulty[0],
        taskListId: value.tasklist[0],
        dueDate: value.dueDate,
        completed: task.completed,
      });
      navigate({
        to: `/tasklist/${task.tasklistId}/`,
      });
    },
  });
  if (isPending || isError) return <Spinner />;

  const tasklist = createListCollection({
    items: data.map((item) => ({
      label: item.title,
      value: item.id.toString(),
    })),
  });

  const dueDate = new Date(task.dueDate);

  return !isUrlEdit ? (
    <Flex
      justifyContent={'space-between'}
      _hover={{ bg: 'gray.700' }}
      borderRadius="md"
    >
      <Box>
        <Checkbox
          defaultChecked={task.completed}
          onCheckedChange={({ checked }) => {
            editTask.mutate({
              id: task.id,
              title: task.title,
              difficulty: task.difficulty,
              taskListId: task.tasklistId,
              dueDate: task.dueDate,
              completed: Boolean(checked),
            });
          }}
        />
        {task.title}
      </Box>
      <HStack>
        <Text> {dueDate.toLocaleDateString('fr-FR')} </Text>
        <MenuRoot>
          <MenuTrigger asChild>
            <FaEllipsis />
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              onClick={() =>
                navigate({
                  to: `/tasklist/${task.tasklistId}/task/${task.id}/edit`,
                })
              }
              value="edit"
            >
              Edit
            </MenuItem>

            <MenuItem
              value="delete"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
            >
              <DeleteTask task={task} />
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>
    </Flex>
  ) : (
    <Box>
      {' '}
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
            name="dueDate"
            children={(field) => {
              return (
                <DatePicker
                  selected={field.state.value}
                  onChange={(date) => {
                    if (date) {
                      field.handleChange(date);
                    }
                  }}
                  customInput={<CustomInput />}
                />
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
                    zIndex={'0'}
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
              onClick={() =>
                navigate({
                  to: `/tasklist/${task.tasklistId}/`,
                })
              }
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </Flex>
        </Flex>
      </form>{' '}
    </Box>
  );
};

export default Task;
