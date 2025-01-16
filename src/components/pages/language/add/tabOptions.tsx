import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import {
  IPageLanguageAddFormState,
  IPageLanguageAddState,
} from '@pages/language/add';

type IComponentProps = {
  state: IPageLanguageAddState;
  form: UseFormReturn<IPageLanguageAddFormState>;
};

const ComponentPageLanguageAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const formValues = props.form.getValues();

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            options={props.state.status}
            name="statusId"
            value={props.state.status?.findSingle('value', formValues.statusId)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('rank')}*`}
            name="rank"
            type="number"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormCheckBox title={t('default')} name="isDefault" />
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabOptions;
