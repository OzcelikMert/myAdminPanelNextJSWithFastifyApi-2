import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { IPageUserAddState } from '@pages/user/add';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';

type IComponentProps = {
  roleId: UserRoleId;
  statusId: StatusId;
  userRoles: IPageUserAddState['userRoles'];
  status: IPageUserAddState['status'];
};

const ComponentPageUserAddTabOptions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  
  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <ComponentFormInputSelect
          title={t('role')}
          name="roleId"
          placeholder={t('chooseRole')}
          options={props.userRoles}
          value={props.userRoles?.findSingle('value', props.roleId)}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInputSelect
          title={t('status')}
          name="statusId"
          options={props.status}
          value={props.status?.findSingle('value', props.statusId)}
        />
      </div>
      {props.statusId == StatusId.Banned ? (
        <div className="col-md-7 mb-3">
          <div className="mb-3">
            <ComponentFormInput
              title={`${t('banDateEnd')}*`}
              type="date"
              name="banDateEnd"
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
