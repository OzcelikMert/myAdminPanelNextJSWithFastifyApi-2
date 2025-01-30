import ComponentInputSwitch, {
  IComponentInputSwitchProps,
} from '@components/elements/inputs/switch';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

type IComponentPropsI18 = {
  setErrorText?: (errorCode: any) => string;
};

type IComponentProps = {
  name: string;
  control?: Control<any>;
  i18?: IComponentPropsI18;
} & Omit<IComponentInputSwitchProps, 'name'>;

const ComponentFormInputSwitch = React.memo((props: IComponentProps) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{ required: props.required }}
      render={({ field, formState }) => (
        <div className="form-input">
          <ComponentInputSwitch
            {...field}
            onChange={(e) => field.onChange(Boolean(e.target.checked))}
            {...props}
            ref={(e) => field.ref(e)}
          />
          {formState.errors &&
            formState.errors[props.name] &&
            formState.errors[props.name]?.message && (
              <div className="error">
                {props.i18?.setErrorText
                  ? props.i18?.setErrorText(formState.errors[props.name]?.type)
                  : null}
              </div>
            )}
        </div>
      )}
    />
  );
});

export default ComponentFormInputSwitch;
