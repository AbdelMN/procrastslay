import { Box, Flex } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { FaEllipsis } from 'react-icons/fa6';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import DeleteTask from './DeleteTaskDialog';
import EditTask from './EditTaskDialog';
import { type Task } from '@/queries/task';

const Task = ({ task }: { task: Task }) => {
  return (
    <Flex
      justifyContent={'space-between'}
      _hover={{ bg: 'gray.700' }}
      borderRadius="md"
    >
      <Box>
        <Checkbox />
        {task.title}
      </Box>
      <MenuRoot>
        <MenuTrigger asChild>
          <FaEllipsis />
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="edit">
            <EditTask task={task} />
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
    </Flex>
  );
};

export default Task;
