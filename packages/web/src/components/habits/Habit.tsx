import { Card, Heading, HStack, ProgressCircleRoot } from '@chakra-ui/react';

import { FaCircleCheck } from 'react-icons/fa6';
import { ProgressCircleRing } from '../ui/progress-circle';
import { useState } from 'react';

type Habit = {
  id: string;
  userId: string;
  name: string;
  frequencyType: string;
  frequencyValue?: number;
  days?: string;
  completionMode: string;
  goalValue: number;
  unit?: string;
  createdAt: string;
};
const Habit = ({ habit }: { habit: Habit }) => {
  const [progress, setProgress] = useState(0);

  return (
    <Card.Root width={'700px'} size="sm">
      <Card.Header></Card.Header>
      <Card.Body color="fg.muted">
        <HStack justifyContent={'space-between'}>
          <Heading size="md"> {habit.name} </Heading>

          <ProgressCircleRoot
            colorPalette={'gray'}
            size={'sm'}
            value={progress}
          >
            {!(progress == 100) ? (
              <ProgressCircleRing
                borderRadius={'20px'}
                _hover={{ bg: 'gray.700' }}
                onClick={() => {
                  if (habit.goalValue)
                    setProgress(progress + 100 / habit.goalValue);
                }}
              />
            ) : (
              <FaCircleCheck
                color={'gray'}
                size={'32px'}
                onClick={() => {
                  setProgress(0);
                }}
              />
            )}
          </ProgressCircleRoot>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default Habit;
