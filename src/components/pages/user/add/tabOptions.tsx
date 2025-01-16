import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFormInput from '@components/elements/form/input/input';
import { IPageUserAddFormState, IPageUserAddState } from '@pages/user/add';
import { StatusId } from '@constants/status';
import moment from 'moment';

type IComponentProps = {
  state: IPageUserAddState;
  form: UseFormReturn<IPageUserAddFormState>;
};

const ComponentPageUserAddTabOptions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const formValues = props.form.getValues();

  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <ComponentFormSelect
          title={t('role')}
          name="roleId"
          placeholder={t('chooseRole')}
          options={props.state.userRoles}
          value={props.state.userRoles?.findSingle('value', formValues.roleId)}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormSelect
          title={t('status')}
          name="statusId"
          options={props.state.status}
          value={props.state.status?.findSingle('value', formValues.statusId)}
        />
      </div>
      {formValues.statusId == StatusId.Banned ? (
        <div className="col-md-7 mb-3">
          <div className="mb-3">
            <ComponentFormInput
              title={`${t('banDateEnd')}*`}
              type="date"
              name="banDateEnd"
              //value={moment(formValues.banDateEnd).format('YYYY-MM-DD')}
            />
          </div>
          <div className="mb-3">
            <ComponentFormInput
              title={t('banComment')}
              name="banComment"
              type="textarea"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPageUserAddTabOptions;
