import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { ZodUtil } from '@utils/zod.util';
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
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInputTags
            {...field}
            onChange={(value) => field.onChange(value)}
            {...props}
            ref={(e) => field.ref(e)}
          />
          {formState.errors &&
            formState.errors[props.name] &&
            formState.errors[props.name]?.message && (
              <div className="error">
                {props.i18?.setErrorText
                  ? props.i18?.setErrorText(
                      formState.errors[props.name]?.type
                    )
                  : null}
              </div>
            )}
        </div>
      )}
    />
  );
});

export default ComponentFormInputTags;
