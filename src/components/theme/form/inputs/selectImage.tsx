import React from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';
import ComponentThemeChooseImage, {
  IComponentThemeChooseImageProps,
} from '@components/theme/chooseImage';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';
import { ObjectUtil } from '@utils/object.util';
import { IFormFieldError } from '@components/theme/form';

type IComponentProps = {
  title?: string;
  name: string;
  control?: Control<any>;
  required?: boolean;
  watch?: boolean;
} & Omit<
  IComponentThemeChooseImageProps,
  'onSelected' | 'reviewImage' | 'selectedImages'
>;

const ComponentThemeFormSelectImage = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  if (props.watch) {
    form.watch(props.name);
  }

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => {
        let hasAnError = false;
        let errorText = '';

        if (formState.submitCount > 0) {
          const error = ObjectUtil.getWithKey<IFormFieldError>(
            formState.errors,
            props.name
          );

          if (error) {
            error.title = props.title;
            hasAnError = true;
            errorText = error.type
              ? t(I18Util.getFormInputErrorText(error.type), [
                  props.title ?? '',
                ])
              : (error.message?.toString() ?? '');
          }
        }

        return (
          <div className="theme-input">
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
            {hasAnError ? <div className="error-text">{errorText}</div> : null}
          </div>
        );
      }}
    />
  );
});

export default ComponentThemeFormSelectImage;
