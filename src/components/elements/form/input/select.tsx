import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { ZodUtil } from '@utils/zod.util';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select, { ActionMeta } from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';

export interface IThemeFormSelectData<T = any> {
  label: string;
  value: T;
}

type IComponentProps<T = any> = {
  title?: string;
  mainDivCustomClassName?: string;
} & StateManagerProps<T>;

export default function ComponentFormSelect(props: IComponentProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const registeredInput = props.name ? register(props.name) : undefined;
  const t = useAppSelector(selectTranslation);

  if (props.name) {
    const watchName = watch(props.name);
  }

  const onChange = (
    newValue: IThemeFormSelectData,
    action: ActionMeta<any>
  ) => {
    if (registeredInput && props.name) {
      setValue(props.name, newValue.value);
    }
    if (props.onChange) {
      props.onChange(newValue, action);
    }
  };

  return (
    <div className={`theme-input static ${props.mainDivCustomClassName}`}>
      <span className="label">{props.title}</span>
      <label className="field">
        <Select
          className="custom-select"
          classNamePrefix="custom-select"
          {...props}
          onChange={(newValue, action) => onChange(newValue, action)}
        />
      </label>
      {props.name &&
        errors &&
        errors[props.name] &&
        errors[props.name]?.message && (
          <div className="error">
            {t(ZodUtil.getErrorText(errors[props.name]?.type), [
              props.title ?? t(props.name as IPanelLanguageKeys),
            ])}
          </div>
        )}
    </div>
  );
}
