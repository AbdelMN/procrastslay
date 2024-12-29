import { Box } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
const Task = ({ task }) => {
  return (
    <Box _hover={{ bg: 'gray.700' }} borderRadius="md">
      <Checkbox />
      {task.title}
    </Box>
  );
};

export default Task;
