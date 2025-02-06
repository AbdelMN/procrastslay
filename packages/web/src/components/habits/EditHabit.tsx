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

import {
  Button,
  createListCollection,
  DialogActionTrigger,
  Input,
} from '@chakra-ui/react';
import { useForm, useStore } from '@tanstack/react-form';

import { forwardRef, useRef } from 'react';

import { FormInput } from '../form/FormInput';
import { useEditHabit } from '@/queries/hooks/habit';
import { ReceivedHabitType } from '@/queries/habit';
import DatePicker from 'react-datepicker';
import { HabitSchema, HabitType } from './HabitSchema';

const EditHabit = ({ habit }: { habit: ReceivedHabitType }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const editHabit = useEditHabit();
  type CustomInputProps = React.HTMLProps<HTMLButtonElement>;

  const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick, className }, ref) => (
      <button type="button" className={className} onClick={onClick} ref={ref}>
        {value}
      </button>
    ),
  );
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
      ...habit,
    } as HabitType,

    validators: {
      onChange: HabitSchema,
    },

    onSubmit: async ({ value }) => {
      const baseData = {
        id: habit.id,
        name: value.name,
        completionMode: value.completionMode,
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

  const frequencyTypeFormValue = useStore(
    form.store,
    (state) => state.values.frequencyType,
  );

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit habit
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
                return <FormInput label="Goal value" required field={field} />;
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
            ) : (
              <form.Field
                name="frequencyValue"
                children={(field) => {
                  return (
                    <FormInput label="Frequency value" required field={field} />
                  );
                }}
              />
            )}
            <form.Field
              name="createdAt"
              children={(field) => {
                return (
                  <DatePicker
                    selected={new Date(field.state.value)}
                    onChange={(date) => {
                      if (date) {
                        field.handleChange(date.toISOString());
                      }
                    }}
                    customInput={<CustomInput />}
                  />
                );
              }}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <DialogActionTrigger asChild>
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Submit'}
                  </Button>
                </DialogActionTrigger>
              )}
            />
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditHabit;
