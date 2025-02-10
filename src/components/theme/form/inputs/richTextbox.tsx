import { IFormFieldError } from '@components/theme/form';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { I18Util } from '@utils/i18.util';
import { ObjectUtil } from '@utils/object.util';
import dynamic from 'next/dynamic';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

const ComponentInputRichTextbox = dynamic(
  () => import('@components/elements/inputs/richTextbox'),
  { ssr: false }
);

type IComponentProps = {
  title?: string;
  name: string;
  control?: Control<any>;
  required?: boolean;
};

const ComponentThemeFormInputRichTextbox = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => {
        const error = ObjectUtil.getWithKey<IFormFieldError>(
          formState.errors,
          props.name
        );
        const hasAnError = Boolean(error);
        let errorText = '';

        if (error) {
          error.title = props.title;
          errorText = error.type
            ? t(I18Util.getFormInputErrorText(error.type), [props.title ?? ''])
            : (error.message?.toString() ?? '');
        }

        return (
          <ComponentInputRichTextbox
            {...field}
            ref={(e) => field.ref(e)}
            onChange={(newValue) => field.onChange(newValue)}
            hasAnError={hasAnError}
            errorText={hasAnError ? errorText : undefined}
          />
        );
      }}
    />
  );
});

export default ComponentThemeFormInputRichTextbox;
