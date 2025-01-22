import { Card, Heading, HStack, ProgressCircleRoot } from '@chakra-ui/react';

import { FaCircleCheck } from 'react-icons/fa6';
import { ProgressCircleRing } from '../ui/progress-circle';

import { HabitType } from '@/queries/habit';

const getLastDays = () => {
  const daysList = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    daysList.push(date.toISOString().split('T')[0]);
  }
  return daysList;
};

const last7Days = getLastDays();

const Habit = ({
  habit,
  multipleDays = false,
}: {
  habit: HabitType;
  multipleDays: boolean;
}) => {
  const completions = multipleDays
    ? last7Days.map((day) => {
        const test = habit.completions.find(
          (o) => new Date(o.date).toISOString() == new Date(day).toISOString(),
        );
        return !test
          ? { date: day, count: 0 }
          : { date: day, count: test.count };
      })
    : [
        {
          count:
            habit.completions && habit.completions.length > 0
              ? habit.completions[0].count
              : 0,
        },
      ];

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
              value={(completions[0].count * 100) / habit.goalValue}
            >
              {!(completions[0].count == 100) ? (
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
              {completions.map((completion) => (
                <ProgressCircleRoot
                  colorPalette={'gray'}
                  size={'sm'}
                  value={(completion.count * 100) / habit.goalValue}
                >
                  {!(completion.count == 100) ? (
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
