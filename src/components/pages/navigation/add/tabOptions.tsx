import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import {
  IPageNavigationAddFormState,
  IPageNavigationAddState,
} from '@pages/navigation/add';

type IComponentProps = {
  state: IPageNavigationAddState;
  form: UseFormReturn<IPageNavigationAddFormState>;
};

const ComponentPageNavigationAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const formValues = props.form.getValues();

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            name="statusId"
            options={props.state.status}
            value={props.state.status?.findSingle('value', formValues.statusId)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
          />
        </div>
        <div className="col-md-7">
          <ComponentFormCheckBox title={t('primary')} name="isPrimary" />
        </div>
        <div className="col-md-7">
          <ComponentFormCheckBox title={t('secondary')} name="isSecondary" />
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddTabOptions;
