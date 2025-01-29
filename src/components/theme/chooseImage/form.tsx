import React from 'react';
import { Controller, Control } from 'react-hook-form';
import ComponentThemeChooseImage, { IComponentThemeChooseImageProps } from '.';
import { ZodUtil } from '@utils/zod.util';

type IComponentPropsI18 = {
  getError?: (text: string) => string;
};

type IComponentProps = {
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
  required?: boolean;
} & Omit<
  IComponentThemeChooseImageProps,
  'onSelected' | 'reviewImage' | 'selectedImages'
>;

const ComponentThemeChooseImageForm = React.memo((props: IComponentProps) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentThemeChooseImage
            {...props}
            {...field}
            onChange={(images) =>
              field.onChange(
                props.isMulti ? images : images.length > 0 ? images[0] : ''
              )
            }
            reviewImage={field.value}
            selectedImages={field.value}
            ref={(e) => field.ref(e)}
          />
          {formState.errors &&
            formState.errors[props.name] &&
            formState.errors[props.name]?.message && (
              <div className="error">
                {props.i18?.getError
                  ? props.i18?.getError(
                      ZodUtil.getErrorText(formState.errors[props.name]?.type)
                    )
                  : null}
              </div>
            )}
        </div>
      )}
    />
  );
});

export default ComponentThemeChooseImageForm;
