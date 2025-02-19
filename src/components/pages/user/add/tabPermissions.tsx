import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageFormState, IPageUserAddState } from '@pages/user/add';
import ComponentPageUserAddPermissionGroup from './permissionGroup';
import { PermissionId } from '@constants/permissions';
import ComponentInputCheckbox from '@components/elements/inputs/checkbox';
import { useFormContext } from 'react-hook-form';

type IComponentProps = {
  permissions: IPageUserAddState['permissions'];
  permissionGroups: IPageUserAddState['permissionGroups'];
  selectedPermissions: PermissionId[];
  onSelectAllPermissions: () => void;
};

const ComponentPageUserAddTabPermissions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useFormContext<IPageFormState>();

    const watchPermissions = form.watch("permissions");

    return (
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentInputCheckbox
            title={t('selectAll')}
            checked={props.permissions.length === props.selectedPermissions.length}
            onChange={(e) => props.onSelectAllPermissions()}
          />
        </div>
        {props.permissionGroups.map((item, index) => (
          <ComponentPageUserAddPermissionGroup
            key={`permission-group-${item.id}`}
            item={item}
            index={index}
            permissions={props.permissions}
            selectedPermissions={props.selectedPermissions}
          />
        ))}
      </div>
    );
  }
);

export default ComponentPageUserAddTabPermissions;
