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
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { z } from 'zod';
import { FormInput } from '../form/FormInput';

const HabitSchema = z
  .object({
    name: z.string(),
    completionMode: z.string(),
    goalValue: z.coerce.number(),
    unit: z.string().optional(),
    createdAt: z.string(),
    frequencyType: z.enum(['interval', 'weekly', 'daily']),
  })
  .and(
    z.union([
      z.object({
        frequencyType: z.literal('daily'),
        days: z.array(z.string()),
      }),
      z.object({
        frequencyType: z.enum(['interval', 'weekly']),
        frequencyValue: z.coerce.number(),
      }),
    ]),
  );
type HabitType = z.infer<typeof HabitSchema>;

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
      { label: 'Weekly', value: 'weekly' },
      {
        label: 'Daily',
        value: 'daily',
      },
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
      completionMode: 'One Time',
      goalValue: 1,
      unit: 'cups',
      createdAt: filter
        ? new Date(filter).toISOString()
        : new Date().toISOString(),

      frequencyType: 'interval',
    } as HabitType,
    validators: {
      onChange: HabitSchema,
    },

    onSubmit: async ({ value }) => {
      const baseData = {
        name: value.name,
        completionMode: value.completionMode[0],
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
          frequencyValue: value.frequencyValue,
        });
      }
    },
  });

  const frequencyTypeFormValue = useStore(
    form.store,
    (state) => state.values.frequencyType,
  );

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
          <form>
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
              name="completionMode"
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
                      console.log(frequencyTypeFormValue);
                      field.handleChange(
                        value[0] as 'interval' | 'weekly' | 'daily',
                      );
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
                return (
                  <FormInput
                    form={form}
                    label="Goal value"
                    required
                    field={field}
                  />
                );
              }}
            />
            {frequencyTypeFormValue === 'daily' ? (
              <form.Field
                name="days"
                children={(field) => {
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
            ) : (
              <form.Field
                name="frequencyValue"
                children={(field) => {
                  console.log(field.state.value);
                  return (
                    <FormInput
                      form={form}
                      label="Frequency value"
                      required
                      field={field}
                    />
                  );
                }}
              />
            )}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Submit'}
                </Button>
              )}
            />
          </form>{' '}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddHabit;
