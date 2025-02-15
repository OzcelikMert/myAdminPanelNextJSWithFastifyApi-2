import ComponentInputCheckbox, {
  IComponentInputCheckboxProps,
} from '@components/elements/inputs/checkbox';
import { I18Util } from '@utils/i18.util';
import { ObjectUtil } from '@utils/object.util';
import React from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';
import { IFormFieldError } from '..';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  valueAsNumber?: boolean;
  valueAsBoolean?: boolean;
  name: string;
  control?: Control<any>;
  watch?: boolean
} & Omit<IComponentInputCheckboxProps, 'name'>;

const ComponentThemeFormInputCheckbox = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  if(props.watch){
    const watch = form.watch(props.name);
  }

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
          <ComponentInputCheckbox
            {...field}
            onChange={(e) =>
              field.onChange(setValue(field.value, e.target.checked))
            }
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

export default ComponentThemeFormInputCheckbox;
