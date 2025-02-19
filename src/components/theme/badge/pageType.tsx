import React, { Component } from 'react';
import { PageTypeId, pageTypes } from '@constants/pageTypes';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';

export function getPageTypeColor(typeId: PageTypeId): string {
  let className = ``;
  switch (typeId) {
    case PageTypeId.Default:
      className = `dark`;
      break;
    case PageTypeId.Home:
      className = `primary`;
      break;
    case PageTypeId.Contact:
      className = `info`;
      break;
    case PageTypeId.Blogs:
    case PageTypeId.Portfolios:
    case PageTypeId.Products:
      className = `warning`;
      break;
  }
  return className;
}

type IComponentProps = {
  typeId: PageTypeId;
  className?: string;
};

const ComponentThemeBadgePageType = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <label
      className={`badge badge-gradient-${getPageTypeColor(props.typeId)} text-start ${props.className ?? ''}`}
    >
      {t(pageTypes.findSingle('id', props.typeId)?.langKey ?? '[noLangAdd]')}
    </label>
  );
});

export default ComponentThemeBadgePageType;
