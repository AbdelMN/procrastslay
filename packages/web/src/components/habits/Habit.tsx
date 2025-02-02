import { Card, Heading, HStack, ProgressCircleRoot } from '@chakra-ui/react';

import { FaCircleCheck, FaEllipsis } from 'react-icons/fa6';
import { ProgressCircleRing } from '../ui/progress-circle';

import { ReceivedHabitType } from '@/queries/habit';
import { useCompleteHabit } from '@/queries/hooks/habit';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import EditHabit from './EditHabit';
import DeleteHabit from './DeleteHabit';
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

const Habit = ({ habit, date }: { habit: ReceivedHabitType; date?: Date }) => {
  const completeHabit = useCompleteHabit(date);
  const completions = !date
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
          date: date,
        },
      ];

  return (
    <Card.Root width={'700px'} size="sm">
      <Card.Header></Card.Header>
      <Card.Body color="fg.muted">
        <HStack justifyContent={'space-between'}>
          <Heading size="md"> {habit.name} </Heading>
          {date ? (
            <ProgressCircleRoot
              colorPalette={'gray'}
              size={'sm'}
              value={Math.min(
                (completions[0].count * 100) / habit.goalValue,
                100,
              )}
            >
              {!Math.min(
                (completions[0].count * 100) / habit.goalValue,
                100,
              ) ? (
                <ProgressCircleRing
                  borderRadius={'20px'}
                  _hover={{ bg: 'gray.700' }}
                  onClick={() => {
                    completeHabit.mutate({
                      habitId: habit.id,
                      count: completions[0].count + 1,
                      date: new Date(completions[0].date),
                    });
                  }}
                />
              ) : (
                <FaCircleCheck
                  color={'gray'}
                  size={'32px'}
                  onClick={() => {
                    completeHabit.mutate({
                      habitId: habit.id,
                      count: 0,
                      date: new Date(completions[0].date),
                    });
                  }}
                />
              )}
            </ProgressCircleRoot>
          ) : (
            <HStack>
              {completions.map((completion) => (
                <ProgressCircleRoot
                  colorPalette={'gray'}
                  size={'sm'}
                  value={Math.min(
                    (completion.count * 100) / habit.goalValue,
                    100,
                  )}
                >
                  {!Math.min(
                    (completion.count * 100) / habit.goalValue,
                    100,
                  ) ? (
                    <ProgressCircleRing
                      borderRadius={'20px'}
                      _hover={{ bg: 'gray.700' }}
                      onClick={() => {
                        completeHabit.mutate({
                          habitId: habit.id,
                          count: completion.count + 1,
                          date: new Date(completion.date),
                        });
                      }}
                    />
                  ) : (
                    <FaCircleCheck
                      color={'gray'}
                      size={'32px'}
                      onClick={() => {
                        completeHabit.mutate({
                          habitId: habit.id,
                          count: 0,
                          date: new Date(completion.date),
                        });
                      }}
                    />
                  )}
                </ProgressCircleRoot>
              ))}

              <MenuRoot>
                <MenuTrigger asChild>
                  <FaEllipsis />
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="edit">
                    <EditHabit habitId={habit.id} />
                  </MenuItem>

                  <MenuItem
                    value="delete"
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  >
                    <DeleteHabit habitId={habit.id} />
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </HStack>
          )}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default Habit;
