import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageUserAddState } from '@pages/user/add';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentPageUserAddPermission from './permission';
import { PermissionId } from '@constants/permissions';

type IComponentProps = {
  permissions: IPageUserAddState['permissions'];
  selectedPermissions: PermissionId[];
  item: IPermissionGroup;
  index: number;
};

const ComponentPageUserAddPermissionGroup = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const foundPermissions = props.permissions.findMulti(
      'groupId',
      props.item.id
    );

    const isNull = foundPermissions.every((permission) => permission == null);
    if (isNull) {
      return null;
    }

    return (
      <div className="col-md-6 mb-3">
        <ComponentFieldSet legend={t(props.item.langKey)}>
          {foundPermissions.map((item, index) => (
            <ComponentPageUserAddPermission
              key={`permission-${item.id}`}
              item={item}
              index={index}
            />
          ))}
        </ComponentFieldSet>
      </div>
    );
  }
);

export default ComponentPageUserAddPermissionGroup;
