import React, { Component } from 'react';
import { ProductTypeId, productTypes } from '@constants/productTypes';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

export function getProductTypeColor(typeId: ProductTypeId): string {
  let className = ``;
  switch (typeId) {
    case ProductTypeId.SimpleProduct:
      className = `primary`;
      break;
    case ProductTypeId.VariableProduct:
      className = `info`;
      break;
    case ProductTypeId.ExternalProduct:
      className = `dark`;
      break;
  }
  return className;
}

type IComponentProps = {
  typeId: ProductTypeId;
  className?: string;
};

const ComponentThemeBadgeProductType = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <label
      className={`badge badge-gradient-${getProductTypeColor(props.typeId)} text-start ${props.className ?? ''}`}
    >
      {t(productTypes.findSingle('id', props.typeId)?.langKey ?? '[noLangAdd]')}
    </label>
  );
});

export default ComponentThemeBadgeProductType;
