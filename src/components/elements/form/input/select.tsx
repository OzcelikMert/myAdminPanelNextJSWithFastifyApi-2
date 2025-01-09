import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface IThemeFormSelectData<T = any> {
  label: string;
  value: T;
}

type IComponentProps<T = any> = {
  title?: string;
  mainDivCustomClassName?: string
} & StateManagerProps<T>;

export default function ComponentFormSelect<T>(props: IComponentProps<T>) {
  return (
    <div className={`theme-input static ${props.mainDivCustomClassName}`}>
      <span className="label">{props.title}</span>
      <div className="field">
        <Select
          className="custom-select"
          classNamePrefix="custom-select"
          {...props}
        />
      </div>
    </div>
  );
}
