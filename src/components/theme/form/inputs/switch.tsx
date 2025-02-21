import ComponentInputSwitch, {
  IComponentInputSwitchProps,
} from '@components/elements/inputs/switch';
import { IFormFieldError } from '@components/theme/form';
import { ObjectUtil } from '@utils/object.util';
import React from 'react';
import {
  Controller,
  Control,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';
import { omit } from 'lodash';

type IComponentProps = {
  name: string;
  control?: Control<any>;
  watch?: boolean;
} & Omit<IComponentInputSwitchProps, 'name'>;

const ComponentThemeFormInputSwitch = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  if (props.watch) {
    const watch = form.watch(props.name);
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
          <ComponentInputSwitch
            {...field}
            onChange={(e) => field.onChange(Boolean(e.target.checked))}
            checked={Boolean(field.value)}
            {...omit(props, 'watch', 'control')}
            ref={(e) => field.ref(e)}
            hasAnError={hasAnError}
            errorText={hasAnError ? errorText : undefined}
          />
        );
      }}
    />
  );
});

export default ComponentThemeFormInputSwitch;
