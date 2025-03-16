import {
  Button,
  FieldLabel,
  HStack,
  Input,
  Separator,
  VStack,
  NativeSelect,
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

const GoalForm = () => {
  const form = useForm({
    defaultValues: {
      habits: [] as number[],
      pomodoro: [] as { duration: string; goal: number }[],
      tasks: [] as { difficulty: string; goal: number }[],
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
            <form>
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
                            children={(subField) => (
                              <Field label="Goal">
                                <Input
                                  type="text"
                                  value={subField.state.value}
                                  autoFocus
                                  onChange={(e) =>
                                    subField.handleChange(+e.target.value)
                                  }
                                />
                              </Field>
                            )}
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
                            children={(subField) => (
                              <Field label="Duration">
                                <Input
                                  type="text"
                                  value={subField.state.value}
                                  autoFocus
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </Field>
                            )}
                          />
                          <form.Field
                            name={`pomodoro[${index}].goal`}
                            children={(subField) => (
                              <Field label="Goal">
                                <Input
                                  type="text"
                                  value={subField.state.value}
                                  autoFocus
                                  onChange={(e) =>
                                    subField.handleChange(+e.target.value)
                                  }
                                />
                              </Field>
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
                                <NativeSelect.Root size="sm" width="240px">
                                  <NativeSelect.Field
                                    placeholder="Select option"
                                    value={subField.state.value}
                                    onChange={(e) => {
                                      subField.handleChange(e.target.value);
                                      console.log(subField.state.value);
                                    }}
                                  >
                                    <option value="1">Easy</option>
                                    <option value="2">Hard</option>
                                    <option value="3">Mega Hard</option>
                                  </NativeSelect.Field>
                                  <NativeSelect.Indicator />
                                </NativeSelect.Root>
                              )}
                            />

                            <form.Field
                              name={`tasks[${index}].goal`}
                              children={(subField) => (
                                <Input
                                  type="text"
                                  value={subField.state.value}
                                  autoFocus
                                  onChange={(e) =>
                                    subField.handleChange(+e.target.value)
                                  }
                                />
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
              </VStack>
            </form>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default GoalForm;
