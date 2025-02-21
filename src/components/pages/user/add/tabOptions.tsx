import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
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
      <div className="col-md-7">
        <ComponentThemeFormInputSelect
          title={t('role')}
          name="roleId"
          placeholder={t('chooseRole')}
          options={props.userRoles}
          valueAsNumber
          watch
        />
      </div>
      <div className="col-md-7">
        <ComponentThemeFormInputSelect
          title={t('status')}
          name="statusId"
          options={props.status}
          valueAsNumber
          watch
        />
      </div>
      {props.statusId == StatusId.Banned ? (
        <div className="col-md-7">
          <div>
            <ComponentThemeFormInput
              title={`${t('banDateEnd')}*`}
              type="date"
              name="banDateEnd"
            />
          </div>
          <div>
            <ComponentThemeFormInput
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
