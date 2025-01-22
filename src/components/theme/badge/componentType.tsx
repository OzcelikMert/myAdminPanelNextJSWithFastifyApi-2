import React from 'react';
import { ComponentTypeId, componentTypes } from '@constants/componentTypes';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';

export function getComponentTypeColor(typeId: ComponentTypeId): string {
  let className = ``;
  switch (typeId) {
    case ComponentTypeId.Public:
      className = `primary`;
      break;
    case ComponentTypeId.Private:
      className = `dark`;
      break;
  }
  return className;
}

type IComponentProps = {
  typeId: ComponentTypeId;
  className?: string;
};

const ComponentThemeBadgeComponentType = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <label
        className={`badge badge-gradient-${getComponentTypeColor(props.typeId)} text-start ${props.className ?? ''}`}
      >
        {t(
          componentTypes.findSingle('id', props.typeId)?.langKey ??
            '[noLangAdd]'
        )}
      </label>
    );
  }
);

export default ComponentThemeBadgeComponentType;
