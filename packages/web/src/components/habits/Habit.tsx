import { Card, Heading, HStack, ProgressCircleRoot } from '@chakra-ui/react';

import { FaCircleCheck } from 'react-icons/fa6';
import { ProgressCircleRing } from '../ui/progress-circle';
import { useState } from 'react';
import { HabitType } from '@/queries/habit';

const mockCompletions = [
  { count: 0 },
  { count: 0 },
  { count: 0 },
  { count: 0 },
  { count: 0 },
  { count: 0 },
  { count: 0 },
];
const Habit = ({
  habit,
  multipleDays = false,
}: {
  habit: HabitType;
  multipleDays: boolean;
}) => {
  const count =
    habit.completions && habit.completions.length > 0
      ? habit.completions[0].count
      : 0;
  console.log(count);
  return (
    <Card.Root width={'700px'} size="sm">
      <Card.Header></Card.Header>
      <Card.Body color="fg.muted">
        <HStack justifyContent={'space-between'}>
          <Heading size="md"> {habit.name} </Heading>
          {!multipleDays ? (
            <ProgressCircleRoot
              colorPalette={'gray'}
              size={'sm'}
              value={(count * 100) / habit.goalValue}
            >
              {!(count == 100) ? (
                <ProgressCircleRing
                  borderRadius={'20px'}
                  _hover={{ bg: 'gray.700' }}
                  onClick={() => {}}
                />
              ) : (
                <FaCircleCheck
                  color={'gray'}
                  size={'32px'}
                  onClick={() => {}}
                />
              )}
            </ProgressCircleRoot>
          ) : (
            <HStack>
              {mockCompletions.map((completion) => (
                <ProgressCircleRoot
                  colorPalette={'gray'}
                  size={'sm'}
                  value={completion.count}
                >
                  {!(count == 100) ? (
                    <ProgressCircleRing
                      borderRadius={'20px'}
                      _hover={{ bg: 'gray.700' }}
                      onClick={() => {}}
                    />
                  ) : (
                    <FaCircleCheck
                      color={'gray'}
                      size={'32px'}
                      onClick={() => {}}
                    />
                  )}
                </ProgressCircleRoot>
              ))}
            </HStack>
          )}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default Habit;
