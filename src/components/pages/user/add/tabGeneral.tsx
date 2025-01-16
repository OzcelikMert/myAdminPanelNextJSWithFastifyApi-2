import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import { VariableLibrary } from '@library/variable';
import { IPageUserAddFormState, IPageUserAddState } from '@pages/user/add';

type IComponentProps = {
  state: IPageUserAddState;
  form: UseFormReturn<IPageUserAddFormState>;
};

const ComponentPageUserAddTabGeneral = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const formValues = props.form.getValues();

  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('name')}*`}
          name="name"
          type="text"
          required={true}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('email')}*`}
          name="email"
          type="email"
          required={true}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('password')}*`}
          name="password"
          type="password"
          required={VariableLibrary.isEmpty(formValues._id)}
        />
      </div>
    </div>
  );
});

export default ComponentPageUserAddTabGeneral;
