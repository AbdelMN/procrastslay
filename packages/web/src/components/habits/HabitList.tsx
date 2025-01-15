import Habit from './Habit';
const mockData = [
  {
    id: 'habit-1',
    userId: '1',
    name: 'Drink Water',
    frequencyType: 'daily',

    days: '["Monday", "Wednesday", "Friday"]',
    completionMode: 'oneTime',
    goalValue: 1,
    unit: 'cups',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'habit-2',
    userId: '1',
    name: 'Workout',
    frequencyType: 'weekly',
    frequencyValue: 3,

    completionMode: 'cumulative',
    goalValue: 3,
    unit: 'seances',
    createdAt: '2025-01-02T08:00:00Z',
  },
  {
    id: 'habit-3',
    userId: '1',
    name: 'Read a Book',
    frequencyType: 'interval',
    frequencyValue: 3,

    completionMode: 'cumulative',
    goalValue: 20,
    unit: 'pages',
    createdAt: '2025-01-03T08:00:00Z',
  },
];

const HabitList = () => {
  return (
    <>
      {mockData.map((habit) => {
        return <Habit habit={habit} />;
      })}
    </>
  );
};
export default HabitList;
