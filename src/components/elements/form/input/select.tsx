import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface IThemeFormSelect {
  label: any;
  value: any;
}

type IComponentProps = {
  title?: string;
} & StateManagerProps;

export default function ComponentFormSelect(props: IComponentProps) {
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
