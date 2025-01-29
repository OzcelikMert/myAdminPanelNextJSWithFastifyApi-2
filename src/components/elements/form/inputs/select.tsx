import ComponentInputSelect, {
  IComponentInputSelectProps,
} from '@components/elements/inputs/select';
import { ZodUtil } from '@utils/zod.util';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

type IComponentPropsI18 = {
  getError?: (text: string) => string;
};

type IComponentProps<T = any> = {
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
} & Omit<IComponentInputSelectProps<T>, 'name'>;

const ComponentFormInputSelect = React.memo((props: IComponentProps) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInputSelect
            {...props}
            {...field}
            onChange={(newValue, action) => field.onChange(newValue.value)}
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

export default ComponentFormInputSelect;
