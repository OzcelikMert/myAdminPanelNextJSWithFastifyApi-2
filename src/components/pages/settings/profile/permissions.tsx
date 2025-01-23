import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { PermissionId, permissions } from '@constants/permissions';
import { permissionGroups } from '@constants/permissionGroups';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import { IPermission } from 'types/constants/permissions';
import ComponentFieldSet from '@components/elements/fieldSet';

const PermissionGroup = React.memo(
  (props: IPermissionGroup & { permissions: IPermission[] }) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="col-md-12 mt-3">
        <ComponentFieldSet legend={t(props.langKey)}>
          <div className="permission-items">
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
    <label className="badge badge-outline-info ms-1 mb-1">
      {t(props.langKey)}
    </label>
  );
});

type IComponentProps = {
  permissionId?: PermissionId[];
};

const ComponentPageProfilePermissions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const foundPermissions = permissions.findMulti('id', props.permissionId);
  let foundPermissionGroups = permissionGroups.findMulti(
    'id',
    foundPermissions.map((permission) => permission.groupId)
  );
  foundPermissionGroups = foundPermissionGroups.filter(
    (group, index) => foundPermissionGroups.indexOfKey('id', group.id) === index
  );

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h6 className="pb-1 border-bottom fw-bold text-start">
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
      </div>
    </div>
  );
});

export default ComponentPageProfilePermissions;
