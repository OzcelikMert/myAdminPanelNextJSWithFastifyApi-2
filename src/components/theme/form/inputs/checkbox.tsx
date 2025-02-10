import ComponentInputCheckbox, {
  IComponentInputCheckboxProps,
} from '@components/elements/inputs/checkbox';
import { I18Util } from '@utils/i18.util';
import { ObjectUtil } from '@utils/object.util';
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { IFormFieldError } from '..';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  valueAsNumber?: boolean;
  valueAsBoolean?: boolean;
  name: string;
  control?: Control<any>;
} & Omit<IComponentInputCheckboxProps, 'name'>;

const ComponentThemeFormInputCheckbox = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

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
          <ComponentInputCheckbox
            {...field}
            {...props}
            onChange={(e) =>
              field.onChange(setValue(field.value, e.target.checked))
            }
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
