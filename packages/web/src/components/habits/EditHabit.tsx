import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Box, Button, HStack } from '@chakra-ui/react';

import { useRef } from 'react';

import { FormInput } from '../form/FormInput';
import { useEditHabit } from '@/queries/hooks/habit';
import { ReceivedHabitType } from '@/queries/habit';

import { HabitSchema, HabitType } from './HabitSchema';
import FormSelect from '../form/FormSelect';
import { useForm } from '@tanstack/react-form';
import FormDate from '../form/FormDate';
import { DaysCollection, FrequencyTypeCollection } from './habitcollections';

const EditHabit = ({ habit }: { habit: ReceivedHabitType }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const editHabit = useEditHabit();

  const frequencyType = FrequencyTypeCollection;
  const days = DaysCollection;

  const form = useForm({
    defaultValues: {
      ...habit,
    } as HabitType,

    validators: {
      onChange: HabitSchema,
    },

    onSubmit: async ({ value }) => {
      const baseData = {
        id: habit.id,
        name: value.name,
        goalValue: value.goalValue,
        unit: value.unit,
        createdAt: value.createdAt,
      };

      if (value.frequencyType === 'daily') {
        editHabit.mutate({
          ...baseData,
          frequencyType: value.frequencyType,
          days: value.days,
        });
      } else {
        editHabit.mutate({
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
        <Box width={'100%'}>Edit</Box>
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
                return <FormInput label="Habit name" required field={field} />;
              }}
            />
            <form.Field
              name="frequencyType"
              children={(field) => {
                return (
                  <FormSelect
                    valueChangeFn={({ value }) => {
                      field.handleChange(
                        value[0] as 'interval' | 'weekly' | 'daily',
                      );
                      if (value[0] === 'daily') {
                        form.deleteField('frequencyValue');
                      } else {
                        form.deleteField('days');
                      }
                    }}
                    field={field}
                    contentRef={contentRef}
                    required
                    label="Frequency Type"
                    collection={frequencyType}
                  />
                );
              }}
            />

            <HStack>
              <form.Field
                name="goalValue"
                children={(field) => {
                  return (
                    <FormInput label="Goal value" required field={field} />
                  );
                }}
              />

              <form.Field
                name="unit"
                children={(field) => {
                  return <FormInput label="Unit" required field={field} />;
                }}
              />
            </HStack>

            <form.Subscribe
              selector={(state) => [state.values.frequencyType]}
              children={(frequencyType) => {
                console.log(frequencyType);
                if (frequencyType[0] === 'daily') {
                  return (
                    <form.Field
                      name="days"
                      children={(field) => {
                        return (
                          <FormSelect
                            valueChangeFn={({ value }) => {
                              field.handleChange(value);
                            }}
                            field={field}
                            contentRef={contentRef}
                            required
                            label="Days"
                            collection={days}
                          />
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

            <form.Field
              name="createdAt"
              children={(field) => {
                return <FormDate field={field} required label="Start date" />;
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
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditHabit;
