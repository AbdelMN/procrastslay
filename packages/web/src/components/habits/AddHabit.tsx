import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { postHabit } from '@/queries/habit';
import { Button, createListCollection, Input } from '@chakra-ui/react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { FormInput } from '../form/FormInput';
import { HabitSchema, HabitType } from './HabitSchema';

const AddHabit = ({ filter }: { filter?: string }) => {
  const queryClient = useQueryClient();

  const contentRef = useRef<HTMLDivElement>(null);
  const addHabit = useMutation({
    mutationFn: postHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: filter ? ['habits', new Date(filter)] : ['habits'],
      });
    },
  });

  const frequencyType = createListCollection({
    items: [
      { label: 'Interval', value: 'interval' },
      {
        label: 'Daily',
        value: 'daily',
      },
      { label: 'Weekly', value: 'weekly' },
    ],
  });
  const days = createListCollection({
    items: [
      { label: 'Monday', value: 'mo' },
      { label: 'Tuesday', value: 'tu' },
      { label: 'Wednsday', value: 'we' },
      { label: 'Thursday', value: 'th' },
      { label: 'Saturday', value: 'sa' },
      { label: 'Sunday', value: 'su' },
    ],
  });

  const form = useForm({
    defaultValues: {
      name: 'Drink water',
      goalValue: 1,
      unit: 'cups',
      createdAt: filter
        ? new Date(filter).toISOString()
        : new Date().toISOString(),

      frequencyType: 'daily',
    } as HabitType,
    validators: {
      onChange: HabitSchema,
    },

    onSubmit: async ({ value }) => {
      const baseData = {
        name: value.name,
        goalValue: value.goalValue,
        unit: value.unit,
        createdAt: value.createdAt,
      };

      if (value.frequencyType === 'daily') {
        addHabit.mutate({
          ...baseData,
          frequencyType: value.frequencyType,
          days: value.days,
        });
      } else {
        addHabit.mutate({
          ...baseData,
          frequencyType: value.frequencyType,
          frequencyValue: +value.frequencyValue,
        });
      }
    },
  });

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add habit
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>Add a habit</DialogHeader>
        <DialogBody>
          {' '}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              children={(field) => {
                return (
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></Input>
                );
              }}
            />

            <form.Field
              name="frequencyType"
              children={(field) => {
                return (
                  <SelectRoot
                    name={field.name}
                    value={[field.state.value]}
                    onValueChange={({ value }) => {
                      field.handleChange(
                        value[0] as 'interval' | 'weekly' | 'daily',
                      );
                      if (value[0] === 'daily') {
                        form.deleteField('frequencyValue');
                      } else {
                        form.deleteField('days');
                      }
                    }}
                    collection={frequencyType}
                    width="100px"
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select frequency Type" />
                    </SelectTrigger>
                    <SelectContent portalRef={contentRef}>
                      {frequencyType.items.map((frequencyType) => (
                        <SelectItem
                          item={frequencyType}
                          key={frequencyType.value}
                        >
                          {frequencyType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                );
              }}
            />
            <form.Field
              name="unit"
              children={(field) => {
                return (
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></Input>
                );
              }}
            />
            <form.Field
              name="goalValue"
              children={(field) => {
                return <FormInput label="Goal value" required field={field} />;
              }}
            />

            <form.Subscribe
              selector={(state) => [state.values.frequencyType]}
              children={(frequencyType) => {
                console.log(frequencyType);
                if (frequencyType[0] === 'daily') {
                  return (
                    <form.Field
                      name="days"
                      children={(field) => {
                        console.log(field.name);
                        return (
                          <SelectRoot
                            name={field.name}
                            value={field.state.value as string[]}
                            onValueChange={({ value }) => {
                              field.handleChange(value);
                            }}
                            collection={days}
                            width="100px"
                          >
                            <SelectTrigger>
                              <SelectValueText placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent portalRef={contentRef}>
                              {days.items.map((frequencyType) => (
                                <SelectItem
                                  item={frequencyType}
                                  key={frequencyType.value}
                                >
                                  {frequencyType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        );
                      }}
                    />
                  );
                }
              }}
            />

            <form.Subscribe
              selector={(state) => [state.values.frequencyType]}
              children={(frequencyType) => {
                console.log(frequencyType);
                if (
                  frequencyType[0] === 'weekly' ||
                  frequencyType[0] === 'interval'
                ) {
                  return (
                    <form.Field
                      name="frequencyValue"
                      children={(field) => {
                        console.log(field.name);
                        return (
                          <FormInput
                            label="Frequency value"
                            required
                            field={field}
                          />
                        );
                      }}
                    />
                  );
                }
              }}
            />
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.values,
              ]}
              children={([canSubmit, isSubmitting, values]) => {
                console.log(values);
                return (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Submit'}
                  </Button>
                );
              }}
            />
          </form>{' '}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddHabit;
