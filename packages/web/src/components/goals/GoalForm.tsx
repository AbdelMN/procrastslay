import {
  Button,
  FieldLabel,
  HStack,
  Separator,
  VStack,
  createListCollection,
  Text,
} from '@chakra-ui/react';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@tanstack/react-form';
import { Field } from '../ui/field';

import { useRef } from 'react';
import { FormInput } from '../form/FormInput';
import GoalFormSchema from './GoalFormSchema';
import FormSelect from '../form/FormSelect';
import { useAddGoal } from '@/queries/hooks/goals';
const difficulty = createListCollection({
  items: [
    { label: 'Easy', value: '1' },
    { label: 'Hard', value: '2' },
    {
      label: 'Mega Hard',
      value: '3',
    },
  ],
});
const GoalForm = () => {
  const addGoal = useAddGoal();
  const form = useForm({
    defaultValues: {
      habits: [] as number[],
      pomodoro: [] as { duration: string; goal: number }[],
      tasks: [] as { difficulty: '1' | '2' | '3'; goal: number }[],
    },
    validators: {
      onChange: GoalFormSchema,
    },

    onSubmit: async ({ value }) => {
      console.log();
      addGoal.mutate(GoalFormSchema.parse(value));
    },
  });
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <DialogRoot>
        <DialogTrigger asChild>
          <Button>Add goal</Button>
        </DialogTrigger>
        <DialogContent ref={contentRef}>
          <DialogHeader>Add a goal</DialogHeader>
          <DialogBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <VStack>
                <form.Field
                  name="habits"
                  mode="array"
                  children={(field) => (
                    <Field>
                      <HStack>
                        <FieldLabel>Habits</FieldLabel>
                        <Button
                          type="button"
                          disabled={field.state.value.length === 1}
                          variant={'outline'}
                          onClick={() => field.pushValue(0)}
                        >
                          +
                        </Button>
                      </HStack>

                      {field.state.value.map((_, index) => (
                        <HStack key={index}>
                          <form.Field
                            name={`habits[${index}]`}
                            children={(subField) => {
                              console.log(subField.state.meta);
                              return (
                                <FormInput field={subField} label="Goal" />
                              );
                            }}
                          ></form.Field>
                          <Button
                            alignSelf={'flex-end'}
                            onClick={() => field.removeValue(index)}
                          >
                            X
                          </Button>
                        </HStack>
                      ))}
                    </Field>
                  )}
                />
                <Separator />
                <form.Field
                  name="pomodoro"
                  mode="array"
                  children={(field) => (
                    <Field>
                      <HStack>
                        <FieldLabel>Pomodoro</FieldLabel>
                        <Button
                          type="button"
                          variant={'outline'}
                          disabled={field.state.value.length === 4}
                          onClick={() =>
                            field.pushValue({ duration: '25', goal: 0 })
                          }
                        >
                          +
                        </Button>
                      </HStack>
                      {field.state.value.map((_, index) => (
                        <HStack key={index}>
                          <form.Field
                            name={`pomodoro[${index}].duration`}
                            children={(subField) => {
                              console.log(subField.state.meta);
                              return (
                                <FormInput field={subField} label="Duration" />
                              );
                            }}
                          />
                          <form.Field
                            name={`pomodoro[${index}].goal`}
                            children={(subField) => (
                              <FormInput field={subField} label="Goal" />
                            )}
                          />
                          <Button
                            alignSelf={'flex-end'}
                            onClick={() => field.removeValue(index)}
                          >
                            X
                          </Button>
                        </HStack>
                      ))}
                    </Field>
                  )}
                />
                <Separator />

                <form.Field
                  name="tasks"
                  mode="array"
                  children={(field) => (
                    <>
                      <Field>
                        <HStack>
                          <FieldLabel>Tasks</FieldLabel>
                          <Button
                            type="button"
                            variant={'outline'}
                            disabled={field.state.value.length === 3}
                            onClick={() =>
                              field.pushValue({ difficulty: '1', goal: 0 })
                            }
                          >
                            +
                          </Button>
                        </HStack>
                        {field.state.value.map((_, index) => (
                          <HStack key={index}>
                            <form.Field
                              name={`tasks[${index}].difficulty`}
                              children={(subField) => (
                                <FormSelect
                                  valueChangeFn={({ value }) => {
                                    console.log(value);
                                    subField.handleChange(value[0]);
                                  }}
                                  field={subField}
                                  contentRef={contentRef}
                                  required
                                  label="Frequency Type"
                                  collection={difficulty}
                                />
                              )}
                            />

                            <form.Field
                              name={`tasks[${index}].goal`}
                              children={(subField) => (
                                <FormInput field={subField} label="Goal" />
                              )}
                            />
                            <Button
                              alignSelf={'flex-end'}
                              onClick={() => field.removeValue(index)}
                            >
                              X
                            </Button>
                          </HStack>
                        ))}
                      </Field>
                    </>
                  )}
                />
                <form.Subscribe
                  selector={(state) => [state.isSubmitting, state.errors]}
                  children={([isSubmitting, errors]) => {
                    const hasErrors = Object.keys(errors).length > 0;
                    return (
                      <>
                        <Text>{errors}</Text>
                        <Button type="submit" disabled={hasErrors}>
                          {isSubmitting ? '...' : 'Submit'}
                        </Button>
                      </>
                    );
                  }}
                />
              </VStack>
            </form>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default GoalForm;
