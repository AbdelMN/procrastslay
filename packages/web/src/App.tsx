import { Box, Heading, Text } from '@chakra-ui/react';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Box>
      <Heading>Welcome to your dashboard!</Heading>
      <Text>This is a sample dashboard.</Text>
      <Dashboard />
    </Box>
  );
};

export default App;
