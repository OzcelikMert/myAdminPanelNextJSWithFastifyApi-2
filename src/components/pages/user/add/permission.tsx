import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPermission } from 'types/constants/permissions';
import { PermissionId } from '@constants/permissions';
import ComponentInputCheckbox from '@components/elements/inputs/checkbox';

type IComponentProps = {
  item: IPermission;
  index: number;
  isSelected: boolean;
  onSelect: (id: PermissionId) => void;
};

const ComponentPageUserAddPermission = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-md-4">
      <ComponentInputCheckbox
        title={t(props.item.langKey)}
        checked={props.isSelected}
        onChange={(e) => props.onSelect(props.item.id)}
      />
    </div>
  );
});

export default ComponentPageUserAddPermission;
