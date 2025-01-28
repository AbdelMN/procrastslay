import { FC } from 'react';
import { FormFieldProps } from './FormTypes';
import { Input } from '@chakra-ui/react';
import { Field } from '../ui/field';

export const FormInput: FC<FormFieldProps> = (props) => {
  const { field } = props;

  const error = field.state.meta.errors.join(',');
  console.log(error);

  return (
    <Field
      label={props.label}
      required={props.required}
      helperText={props.helperText}
      errorText={error}
    >
      <Input
        placeholder={props.placeholder}
        id={field.name}
        name={field.name}
        value={field.state.value as number}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {error}
    </Field>
  );
};
