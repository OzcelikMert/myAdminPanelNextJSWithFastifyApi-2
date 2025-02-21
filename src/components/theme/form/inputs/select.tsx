import ComponentInputSelect, {
  IComponentInputSelectData,
  IComponentInputSelectProps,
} from '@components/elements/inputs/select';
import { IFormFieldError } from '@components/theme/form';
import { ObjectUtil } from '@utils/object.util';
import React from 'react';
import { useFormContext, Controller, Control } from 'react-hook-form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';
import { omit } from 'lodash';

type IComponentProps<T = any> = {
  key?: string;
  valueAsNumber?: boolean;
  name: string;
  control?: Control<any>;
  watch?: boolean;
} & Omit<IComponentInputSelectProps<T>, 'name'>;

const ComponentThemeFormInputSelect = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  if (props.watch) {
    form.watch(props.name);
  }

  const getValue = (newValue: any) => {
    if (props.isMulti) {
      if (Array.isArray(newValue)) {
        return newValue.map((item) =>
          props.valueAsNumber ? Number(item) : item
        );
      } else {
        return [props.valueAsNumber ? Number(newValue) : newValue];
      }
    } else {
      return props.valueAsNumber ? Number(newValue) : newValue;
    }
  };

  const getOptionValue = (
    options: IComponentInputSelectData<any>[],
    value: any
  ) => {
    let newValue;
    if (Array.isArray(value)) {
      newValue = options.findMulti('value', value);
    } else {
      newValue = options.findSingle('value', value);
    }

    return (
      newValue ?? {
        label: props.placeholder?.toString() ?? '',
        value: props.isMulti ? [] : props.valueAsNumber ? -1 : '',
      }
    );
  };

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      defaultValue={props.isMulti ? [] : ''}
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
          <ComponentInputSelect
            {...field}
            onChange={(newValue, action) => field.onChange(getValue(newValue))}
            {...omit(props, 'valueAsNumber', 'watch', 'control')}
            value={getOptionValue(
              props.options ?? [],
              field.value ?? props.value
            )}
            ref={(e) => field.ref(e)}
            hasAnError={hasAnError}
            errorText={hasAnError ? errorText : undefined}
          />
        );
      }}
    />
  );
});

export default ComponentThemeFormInputSelect;
