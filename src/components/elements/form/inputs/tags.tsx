import React from 'react';
import { Controller, Control } from 'react-hook-form';
import ComponentInputTags, {
  IComponentInputTagsProps,
} from '@components/elements/inputs/tags';

type IComponentPropsI18 = {
  setErrorText?: (errorCode: any) => string;
};

type IComponentProps = {
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
} & Omit<IComponentInputTagsProps, 'name'>;

const ComponentFormInputTags = React.memo((props: IComponentProps) => {
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
          <ComponentInputTags
            {...field}
            onChange={(value) => field.onChange(value)}
            {...props}
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

export default ComponentFormInputTags;
