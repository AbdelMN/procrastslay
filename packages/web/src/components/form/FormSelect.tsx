import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

import { FormSelectFieldProps } from './FormTypes';
import { Field } from '../ui/field';

const FormSelect = (props: FormSelectFieldProps) => {
  const { field, collection, contentRef, valueChangeFn } = props;

  const error = field.state.meta.errors.join(',');
  return (
    <Field
      invalid={error.length > 0}
      label={props.label}
      required={props.required}
      helperText={props.helperText}
      errorText={error}
    >
      <SelectRoot
        name={field.name}
        value={
          Array.isArray(field.state.value)
            ? field.state.value
            : [field.state.value]
        }
        onValueChange={valueChangeFn}
        collection={collection}
        width="100px"
      >
        <SelectTrigger>
          <SelectValueText placeholder="Select days" />
        </SelectTrigger>
        <SelectContent portalRef={contentRef}>
          {collection.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
};

export default FormSelect;
