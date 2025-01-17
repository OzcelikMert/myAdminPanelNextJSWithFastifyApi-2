import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageUserAddState } from '@pages/user/add';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentPageUserAddPermissionGroup from './permissionGroup';
import { PermissionId } from '@constants/permissions';

type IComponentProps = {
  permissions: IPageUserAddState['permissions'];
  permissionGroups: IPageUserAddState['permissionGroups'];
  userPermissions: PermissionId[];
  onSelectAllPermissions: () => void;
  onSelectPermission: (id: PermissionId) => void;
};

const ComponentPageUserAddTabPermissions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentFormCheckBox
            title={t('selectAll')}
            checked={props.permissions.length === props.userPermissions.length}
            onChange={(e) => props.onSelectAllPermissions()}
          />
        </div>
        {props.permissionGroups.map((item, index) => (
          <ComponentPageUserAddPermissionGroup
            key={`permission_group_${index}`}
            item={item}
            permissions={props.permissions}
            userPermissions={props.userPermissions}
            index={index}
            onSelectPermission={(id) => props.onSelectPermission(id)}
          />
        ))}
      </div>
    );
  }
);

export default ComponentPageUserAddTabPermissions;
