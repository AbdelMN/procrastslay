import { postTask, tasklistQuery } from '@/queries/task';
import {
  Button,
  createListCollection,
  Flex,
  Input,
  Spinner,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';

export const Route = createFileRoute('/_auth/tasklist/$tasklistId/task/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tasklistId: taskListId } = Route.useParams();
  const navigate = useNavigate({ from: '/' });
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery(tasklistQuery);
  const addTask = useMutation({
    mutationFn: postTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.tasklistId],
      });
    },
  });

  const form = useForm({
    defaultValues: {
      title: '',
      tasklist: [taskListId],
      difficulty: [''],
      duedate: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      addTask.mutate({
        title: value.title,
        difficulty: value.difficulty[0],
        tasklistId: value.tasklist[0],
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

  return (
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
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          );
        }}
      />
      <Flex direction={'row'} alignItems="center" gap={1}>
        <form.Field
          name="difficulty"
          children={(field) => {
            return (
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
            );
          }}
        />
        <form.Field
          name="duedate"
          children={(field) => {
            return (
              <Input
                width={'150px'}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
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
            );
          }}
        />

        <Flex direction={'row'} gap={1}>
          <Button
            onClick={() =>
              navigate({
                to: `/tasklist/${taskListId}`,
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit">Confirm</Button>
        </Flex>
      </Flex>
    </form>
  );
}
