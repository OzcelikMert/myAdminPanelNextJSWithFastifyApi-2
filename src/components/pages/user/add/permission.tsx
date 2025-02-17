import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPermission } from 'types/constants/permissions';
import { PermissionId } from '@constants/permissions';
import ComponentThemeFormInputCheckbox from '@components/theme/form/inputs/checkbox';
import ComponentThemeFormInputSwitch from '@components/theme/form/inputs/switch';

type IComponentProps = {
  item: IPermission;
  index: number;
};

const ComponentPageUserAddPermission = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-md-4">
      <ComponentThemeFormInputCheckbox
        name={`permissions`}
        title={t(props.item.langKey)}
        value={props.item.id}
        valueAsNumber
      />
    </div>
  );
});

export default ComponentPageUserAddPermission;
