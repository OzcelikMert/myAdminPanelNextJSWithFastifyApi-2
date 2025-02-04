import dynamic from 'next/dynamic';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

const ComponentInputRichTextbox = dynamic(
  () => import('@components/elements/inputs/richTextbox'),
  { ssr: false }
);

type IComponentPropsI18 = {
  setErrorText?: (errorCode: any) => string;
};

type IComponentProps = {
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
  required?: boolean;
};

const ComponentFormInputRichTextbox = React.memo((props: IComponentProps) => {
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
          <ComponentInputRichTextbox
            {...field}
            ref={(e) => field.ref(e)}
            onChange={(newValue) => field.onChange(newValue)}
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

export default ComponentFormInputRichTextbox;
