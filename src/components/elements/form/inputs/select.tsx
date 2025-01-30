import ComponentInputSelect, {
  IComponentInputSelectData,
  IComponentInputSelectProps,
} from '@components/elements/inputs/select';
import { ZodUtil } from '@utils/zod.util';
import React from 'react';
import { useFormContext, Controller, Control } from 'react-hook-form';

type IComponentPropsI18 = {
  setErrorText?: (errorCode: any) => string;
};

type IComponentProps<T = any> = {
  valueAsNumber?: boolean;
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
  watch?: boolean;
} & Omit<IComponentInputSelectProps<T>, 'name'>;

const ComponentFormInputSelect = React.memo((props: IComponentProps) => {
  const form = useFormContext();

  if (props.watch) {
    form.watch(props.name);
  }

  const setValue = (
    newValue: IComponentInputSelectData | IComponentInputSelectData[]
  ) => {
    if (props.isMulti) {
      if (Array.isArray(newValue)) {
        return newValue.map((item) =>
          props.valueAsNumber ? Number(item.value) : item.value
        );
      } else {
        return [props.valueAsNumber ? Number(newValue.value) : newValue.value];
      }
    } else {
      return props.valueAsNumber
        ? Number((newValue as IComponentInputSelectData).value)
        : (newValue as IComponentInputSelectData).value;
    }
  };

  const getValue = (options: IComponentInputSelectData<any>[], value: any) => {
    if (Array.isArray(value)) {
      return options.findMulti('value', value);
    } else {
      return options.findSingle('value', value);
    }
  };

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInputSelect
            {...field}
            onChange={(newValue, action) => field.onChange(setValue(newValue))}
            {...props}
            value={getValue(props.options ?? [], field.value ?? props.value)}
            ref={(e) => field.ref(e)}
          />
          {formState.errors &&
            formState.errors[props.name] &&
            formState.errors[props.name]?.message && (
              <div className="error">
                {props.i18?.setErrorText
                  ? props.i18?.setErrorText(formState.errors[props.name]?.type)
                  : null}
              </div>
            )}
        </div>
      )}
    />
  );
});

export default ComponentFormInputSelect;
