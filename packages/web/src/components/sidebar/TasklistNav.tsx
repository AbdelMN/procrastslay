import { Flex, Box, Button, Collapsible } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa6';
import { useState } from 'react';

const tasklist = [
  { id: 1, title: 'Work', userId: 1 },
  { id: 2, title: 'Personal', userId: 1 },
  { id: 3, title: 'Study', userId: 1 },
];
const TaskListNav = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Flex direction={'column'}>
          {tasklist.map((list) => (
            <Button>{list.title}</Button>
          ))}
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default TaskListNav;
