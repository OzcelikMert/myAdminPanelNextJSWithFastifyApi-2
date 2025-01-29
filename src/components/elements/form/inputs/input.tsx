import ComponentInput, {
  IComponentInputProps,
} from '@components/elements/inputs/input';
import { ZodUtil } from '@utils/zod.util';
import moment from 'moment';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

type IComponentPropsI18 = {
  getError?: (text: string) => string;
};

export type IComponentFormInputProps = {
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
} & Omit<IComponentInputProps, 'name'>;

const ComponentFormInput = React.memo((props: IComponentFormInputProps) => {
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
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInput
            {...props}
            {...field}
            onChange={(e) => field.onChange(getValue(e.target.value))}
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

export default ComponentFormInput;
