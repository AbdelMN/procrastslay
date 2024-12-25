import { Box, Button, VStack } from '@chakra-ui/react';
import { FaHouse, FaSquarePollVertical, FaClock } from 'react-icons/fa6';
import { Separator } from '@chakra-ui/react';
import TaskListNav from './TasklistNav';
const SidebarMenu = () => (
  <VStack>
    <Button
      w="100%"
      bg={'transparent'}
      _hover={{ bg: 'gray.700' }}
      justifyContent={'left'}
    >
      <FaHouse /> Dashboard
    </Button>
    <Button
      w="100%"
      bg={'transparent'}
      _hover={{ bg: 'gray.700' }}
      justifyContent={'left'}
    >
      <FaSquarePollVertical />
      Habits
    </Button>
    <Button
      w="100%"
      bg={'transparent'}
      _hover={{ bg: 'gray.700' }}
      justifyContent={'left'}
    >
      <FaClock />
      Pomodoro
    </Button>
  </VStack>
);

const Sidebar = () => {
  return (
    <Box
      as="nav"
      position="sticky"
      overflowY={'scroll'}
      left={0}
      p={5}
      w="200px"
      top={0}
      h="100vh"
      bg="#dfdfdf"
    >
      <SidebarMenu />
      <Separator />
      <TaskListNav />
    </Box>
  );
};

export default Sidebar;
