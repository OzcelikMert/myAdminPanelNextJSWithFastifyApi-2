import React from 'react';
import { Controller, Control } from 'react-hook-form';
import ComponentInputTags, {
  IComponentInputTagsProps,
} from '@components/elements/inputs/tags';
import { ObjectUtil } from '@utils/object.util';
import { IFormFieldError } from '@components/theme/form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  name: string;
  control?: Control<any>;
} & Omit<IComponentInputTagsProps, 'name'>;

const ComponentThemeFormInputTags = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

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
          <ComponentInputTags
            {...field}
            onChange={(value) => field.onChange(value)}
            {...props}
            ref={(e) => field.ref(e)}
            hasAnError={hasAnError}
            errorText={hasAnError ? errorText : undefined}
          />
        );
      }}
    />
  );
});

export default ComponentThemeFormInputTags;
