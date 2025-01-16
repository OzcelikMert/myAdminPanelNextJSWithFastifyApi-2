import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPermission } from 'types/constants/permissions';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';

type IComponentProps = {
  item: IPermission;
  index: number;
};

const ComponentPageUserAddPermission = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-md-4">
      <ComponentFormCheckBox
        title={t(props.item.langKey)}
        name="permissions[]"
        // checked={formState.permissions.includes(props.id)}
        // onChange={(e) => onPermissionSelected(e.target.checked, props.id)}
      />
    </div>
  );
});

export default ComponentPageUserAddPermission;
