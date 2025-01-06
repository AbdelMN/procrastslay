import {
  Box,
  Input,
  Flex,
  Button,
  createListCollection,
  Spinner,
} from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import ky from 'ky';
import { useForm } from '@tanstack/react-form';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Task, tasklistQuery } from '@/queries/task';

const patchTask = async ({
  id,
  title,
  difficulty,
  taskListId,
}: {
  id: number;
  title: string;
  difficulty: number;
  taskListId: number;
}) => {
  const response = await ky
    .patch(`http://localhost:3000/task/${id}`, {
      credentials: 'include',
      json: { title: title, difficulty: difficulty, tasklistId: taskListId },
    })
    .json();
  return response;
};

const useEditTask = (taskListId: number) => {
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

const EditTask = ({ task }: { task: Task }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const editTask = useEditTask(task.tasklistId);

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
      difficulty: [task.difficulty.toString()],
      duedate: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      editTask.mutate({
        id: task.id,
        title: value.title,
        difficulty: +value.difficulty[0],
        taskListId: +value.tasklist[0],
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

  return (
    <DialogRoot
      open={isEditOpen}
      onOpenChange={(isOpen) => setIsEditOpen(isOpen.open)}
      placement="center"
    >
      <DialogTrigger asChild>
        <Box width={'100%'}>Edit</Box>
      </DialogTrigger>
      <DialogContent
        ref={contentRef}
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Edit a tasklist</DialogTitle>
        </DialogHeader>
        <DialogBody pb="8">
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
                        <SelectContent portalRef={contentRef}>
                          {difficulty.items.map((difficulty) => (
                            <SelectItem
                              item={difficulty}
                              key={difficulty.value}
                            >
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
                        <SelectContent portalRef={contentRef}>
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
                    setIsEditOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm</Button>
              </Flex>
            </Flex>
          </form>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditTask;
