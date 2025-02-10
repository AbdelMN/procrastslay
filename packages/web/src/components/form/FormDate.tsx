import { forwardRef } from 'react';
import { Field } from '../ui/field';
import DatePicker from 'react-datepicker';
import { FormFieldProps } from './FormTypes';

type CustomInputProps = React.HTMLProps<HTMLButtonElement>;

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick, className }, ref) => (
    <button type="button" className={className} onClick={onClick} ref={ref}>
      {value}
    </button>
  ),
);

const FormDate = (props: FormFieldProps) => {
  const { field } = props;
  const error = field.state.meta.errors.join(',');

  return (
    <Field
      invalid={error.length > 0}
      label={props.label}
      required={props.required}
      helperText={props.helperText}
      errorText={error}
    >
      <DatePicker
        selected={new Date(field.state.value)}
        onChange={(date) => {
          if (date) {
            field.handleChange(date.toISOString());
          }
        }}
        customInput={<CustomInput />}
      />
    </Field>
  );
};
export default FormDate;
