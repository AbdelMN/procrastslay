import { createListCollection } from '@chakra-ui/react';

export const FrequencyTypeCollection = createListCollection({
  items: [
    { label: 'Interval', value: 'interval' },
    {
      label: 'Daily',
      value: 'daily',
    },
    { label: 'Weekly', value: 'weekly' },
  ],
});

export const DaysCollection = createListCollection({
  items: [
    { label: 'Monday', value: 'Mon' },
    { label: 'Tuesday', value: 'Tue' },
    { label: 'Wednsday', value: 'Wed' },
    { label: 'Thursday', value: 'Thu' },
    { label: 'Saturday', value: 'Sat' },
    { label: 'Sunday', value: 'Sun' },
  ],
});
