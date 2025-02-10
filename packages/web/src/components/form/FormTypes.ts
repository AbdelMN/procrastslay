import { ListCollection, SelectValueChangeDetails } from '@chakra-ui/react';
import { FieldApi } from '@tanstack/react-form';

export type FormFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any>;
  label: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
};

export type FormSelectFieldProps = FormFieldProps & {
  collection: ListCollection;
  contentRef: React.RefObject<HTMLElement> | undefined;
  valueChangeFn: (details: SelectValueChangeDetails) => void;
};
