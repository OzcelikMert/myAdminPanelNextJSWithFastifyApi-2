import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { useFormContext } from 'react-hook-form';
import Select, { ActionMeta } from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import { ILanguageKeys } from 'types/constants/languageKeys';

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
  } = useFormContext();
  const registeredInput = props.name && register(props.name);
  const t = useAppSelector(selectTranslation);

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
      <div className="field">
        <Select
          className="custom-select"
          classNamePrefix="custom-select"
          {...(props.name && register(props.name))}
          {...props}
          onChange={(newValue, action) => onChange(newValue, action)}
        />
      </div>
      {props.name &&
        errors &&
        errors[props.name] &&
        errors[props.name]?.message && (
          <div className="error">
            {t(errors[props.name]?.message as ILanguageKeys)}
          </div>
        )}
    </div>
  );
}
