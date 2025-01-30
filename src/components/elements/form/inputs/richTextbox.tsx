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
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInputRichTextbox
            {...field}
            ref={(e) => field.ref(e)}
            onChange={(newValue) => field.onChange(newValue)}
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

export default ComponentFormInputRichTextbox;
