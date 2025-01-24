import { IUserModel } from 'types/models/user.model';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import { permissions } from '@constants/permissions';
import { permissionGroups } from '@constants/permissionGroups';
import { IPermission } from 'types/constants/permissions';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import React from 'react';

const PermissionGroup = React.memo(
  (props: IPermissionGroup & { permissions: IPermission[] }) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="col-md-12 mt-3">
        <ComponentFieldSet legend={t(props.langKey)}>
          <div className="row">
            {props.permissions.map((permission) => (
              <PermissionItem {...permission} />
            ))}
          </div>
        </ComponentFieldSet>
      </div>
    );
  }
);

const PermissionItem = React.memo((props: IPermission) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-3 mt-2">
      <label className="badge badge-outline-info ms-1 mb-1">
        {t(props.langKey)}
      </label>
    </div>
  );
});

type IComponentProps = {
  userInfo: IUserModel;
};

const ComponentThemeUserProfileCardPermissions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const foundPermissions = permissions.findMulti(
    'id',
    props.userInfo.permissions
  );
  let foundPermissionGroups = permissionGroups.findMulti(
    'id',
    foundPermissions.map((permission) => permission.groupId)
  );
  foundPermissionGroups = foundPermissionGroups.filter(
    (group, index) => foundPermissionGroups.indexOfKey('id', group.id) === index
  );

  return (
    <div className="permissions">
      <h6 className="pb-1 border-bottom fw-bold text-end">
        {t('permissions')}
      </h6>
      <div className="row">
        {foundPermissionGroups.orderBy('rank', 'asc').map((group) => (
          <PermissionGroup
            {...group}
            permissions={foundPermissions.findMulti('groupId', group.id)}
          />
        ))}
      </div>
    </div>
  );
});

export default ComponentThemeUserProfileCardPermissions;
