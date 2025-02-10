import ComponentInputSelect, {
  IComponentInputSelectData,
  IComponentInputSelectProps,
} from '@components/elements/inputs/select';
import { IFormFieldError } from '@components/theme/form';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { ObjectUtil } from '@utils/object.util';
import React from 'react';
import { useFormContext, Controller, Control } from 'react-hook-form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';

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

  useEffectAfterDidMount(() => {
    return () => {
      form.unregister(props.name);
    };
  }, []);

  const setValue = (
    newValue: IComponentInputSelectData | IComponentInputSelectData[]
  ) => {
    if (props.isMulti) {
      if (Array.isArray(newValue)) {
        return newValue.map((item) =>
          props.valueAsNumber ? Number(item.value) : item.value
        );
      } else {
        return [props.valueAsNumber ? Number(newValue.value) : newValue.value];
      }
    } else {
      return props.valueAsNumber
        ? Number((newValue as IComponentInputSelectData).value)
        : (newValue as IComponentInputSelectData).value;
    }
  };

  const getValue = (options: IComponentInputSelectData<any>[], value: any) => {
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
          <ComponentInputSelect
            {...field}
            onChange={(newValue, action) => field.onChange(setValue(newValue))}
            {...props}
            value={getValue(props.options ?? [], field.value ?? props.value)}
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
