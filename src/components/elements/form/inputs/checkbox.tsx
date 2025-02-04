import ComponentInputCheckbox, {
  IComponentInputCheckboxProps,
} from '@components/elements/inputs/checkbox';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

type IComponentPropsI18 = {
  setErrorText?: (errorCode: any) => string;
};

type IComponentProps = {
  valueAsNumber?: boolean;
  valueAsBoolean?: boolean;
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
} & Omit<IComponentInputCheckboxProps, 'name'>;

const ComponentFormInputCheckbox = React.memo((props: IComponentProps) => {
  const setValue = (value: any, isSelected: boolean) => {
    if (Array.isArray(value)) {
      return value.map((item) => (props.valueAsNumber ? Number(item) : item));
    } else {
      return props.valueAsNumber
        ? Number(value)
        : props.valueAsBoolean || !props.value
          ? Boolean(isSelected)
          : value;
    }
  };

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => {
        const hasAnError = Boolean(
          formState.errors && formState.errors[props.name]
        );

        return (
          <ComponentInputCheckbox
            {...field}
            {...props}
            onChange={(e) =>
              field.onChange(setValue(field.value, e.target.checked))
            }
            ref={(e) => field.ref(e)}
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

export default ComponentFormInputCheckbox;
