import ComponentInput, {
  IComponentInputProps,
} from '@components/elements/inputs/input';
import { IFormFieldError } from '@components/theme/form';
import { ObjectUtil } from '@utils/object.util';
import moment from 'moment';
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';
import { omit } from 'lodash';

export type IComponentFormInputProps = {
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  name: string;
  control?: Control<any>;
} & Omit<IComponentInputProps, 'name'>;

const ComponentThemeFormInput = React.memo(
  (props: IComponentFormInputProps) => {
    const t = useAppSelector(selectTranslation);

    const getValue = (value: any) => {
      if (props.valueAsNumber || props.type == 'number') {
        return Number(value);
      } else if (props.valueAsDate || props.type == 'date') {
        return moment(value).format('YYYY-MM-DD');
      }

      return value;
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
            <ComponentInput
              {...field}
              {...omit(props, 'valueAsNumber', 'valueAsDate', 'control')}
              onChange={(e) => field.onChange(getValue(e.target.value))}
              ref={(e) => field.ref(e)}
              hasAnError={hasAnError}
              errorText={hasAnError ? errorText : undefined}
            />
          );
        }}
      />
    );
  }
);

export default ComponentThemeFormInput;
