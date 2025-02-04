import ComponentInputSelect, {
  IComponentInputSelectData,
  IComponentInputSelectProps,
} from '@components/elements/inputs/select';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { ZodUtil } from '@utils/zod.util';
import React from 'react';
import {
  useFormContext,
  Controller,
  Control,
  ControllerRenderProps,
} from 'react-hook-form';

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

  const selectRef = React.useRef<any>(null);
  const fieldRef = React.useRef<ControllerRenderProps<any, string>>(null);

  if (props.watch) {
    form.watch(props.name);
  }

  useEffectAfterDidMount(() => {
    if (fieldRef.current) {
      if (
        props.options?.some((option) =>
          Array.isArray(fieldRef.current?.value)
            ? !fieldRef.current.value.includes(option.value)
            : fieldRef.current?.value != option.value
        )
      ) {
        fieldRef.current.onChange(
          setValue(
            getValue(props.options ?? [], fieldRef.current.value ?? props.value)
          )
        );
      }
    }
  }, [props.options]);

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
    let newValue;
    if (Array.isArray(value)) {
      newValue = options.findMulti('value', value);
    } else {
      newValue = options.findSingle('value', value);
    }

    return newValue ?? { label: props.placeholder?.toString() ?? "", value: undefined };
  };

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => {
        fieldRef.current = field;
        const hasAnError = Boolean(
          formState.errors && formState.errors[props.name]
        );
        return (
          <ComponentInputSelect
            {...field}
            onChange={(newValue, action) => field.onChange(setValue(newValue))}
            {...props}
            value={getValue(props.options ?? [], field.value ?? props.value)}
            ref={(e) => {
              selectRef.current = e;
              return field.ref(e);
            }}
            hasAnError={hasAnError}
            errorText={
              hasAnError && props.i18?.setErrorText
                ? props.i18?.setErrorText(formState.errors[props.name]?.type)
                : formState.errors[props.name]?.message?.toString()
            }
          />
        );
      }}
    />
  );
});

export default ComponentFormInputSelect;
