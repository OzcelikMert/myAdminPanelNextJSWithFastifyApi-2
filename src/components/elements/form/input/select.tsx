import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface IThemeFormSelectData<T> {
  label: string;
  value: T;
}

type IComponentProps<T> = {
  title?: string;
} & StateManagerProps<T>;

export default function ComponentFormSelect<T>(props: IComponentProps<T>) {
  return (
    <label className="theme-input static">
      <span className="label">{props.title}</span>
      <div className="field">
        <Select
          className="custom-select"
          classNamePrefix="custom-select"
          {...props}
        />
      </div>
    </label>
  );
}
