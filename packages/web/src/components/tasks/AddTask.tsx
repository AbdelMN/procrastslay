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
import { useQuery } from '@tanstack/react-query';
const fetchTasklist = async () => {
  const response = await ky('http://localhost:3000/tasklist', {
    credentials: 'include',
  });

  return response.json();
};

const AddTask = ({ taskListId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ['tasklist'],
    queryFn: fetchTasklist,
    enabled: true,
    retry: false,
  });
  console.log(data);

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
        label:
          'Mega HardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHardHard',
        value: '3',
      },
    ],
  });
  const form = useForm({
    defaultValues: {
      title: '',
      tasklist: [''],
      difficulty: [''],
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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

        <form.Field
          name="tasklist"
          children={(field) => {
            return (
              <>
                <SelectRoot
                  itemToValue={(item) => {
                    console.log('t');
                  }}
                  name={field.name}
                  value={field.state.value}
                  onValueChange={({ value }) => {
                    field.handleChange(value);
                  }}
                  collection={tasklist}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasklist.items.map((movie) => (
                      <SelectItem item={movie} key={movie.value}>
                        {movie.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </>
            );
          }}
        />
        <Flex
          direction={'row'}
          justifyContent={'space-between'}
          alignItems="center"
          gap={1}
        >
          <form.Field
            name="difficulty"
            children={(field) => {
              return (
                <Box width={'100%'}>
                  <SelectRoot
                    name={field.name}
                    value={field.state.value}
                    onValueChange={({ value }) => {
                      field.handleChange(value);
                    }}
                    collection={difficulty}
                  >
                    <SelectTrigger width="100%">
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

          <Flex direction={'row'} gap={1}>
            <Button>Cancel</Button>
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
