import { FieldApi } from '@tanstack/react-form';

export type FormFieldProps = {
  field: FieldApi<any, any, any, any>;
  label: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
};
