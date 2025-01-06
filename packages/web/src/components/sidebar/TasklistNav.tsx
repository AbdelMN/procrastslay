import { Flex, Box, Button, Collapsible, Spinner } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown, FaEllipsis } from 'react-icons/fa6';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate, useMatchRoute } from '@tanstack/react-router';

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';

import EditTaskList from './EditTaskListDialog';
import DeleteTaskList from './DeleteTaskListDialog';
import AddTaskList from './AddTaskList';
import { tasklistQuery } from '@/queries/task';

const TaskListNav = () => {
  const matchRoute = useMatchRoute();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate({ from: '/' });
  const { data, refetch, isPending, isError } = useQuery(tasklistQuery);

  if (isPending || isError) return <Spinner />;

  return (
    <Collapsible.Root
      onOpenChange={(open) => {
        setIsOpen(open.open);
      }}
    >
      <Collapsible.Trigger paddingY="3">
        <Flex align="center">
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          <Box ml="2">Task List</Box>
          <AddTaskList refetch={refetch} />
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Flex direction={'column'}>
          {data.map((list) => (
            <Button
              bgColor={
                matchRoute({ to: `/tasklist/${list.id.toString()}` })
                  ? 'gray.700'
                  : 'transparent'
              }
              onClick={() =>
                navigate({
                  to: `/tasklist/${list.id}`,
                })
              }
              justifyContent={'space-between'}
              key={list.id}
            >
              <Box overflow="hidden" textOverflow="ellipsis">
                {list.title}
              </Box>
              <MenuRoot>
                <MenuTrigger asChild>
                  <FaEllipsis />
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="edit">
                    <EditTaskList taskListId={list.id} refetch={refetch} />
                  </MenuItem>

                  <MenuItem
                    value="delete"
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  >
                    <DeleteTaskList taskListId={list.id} refetch={refetch} />
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
