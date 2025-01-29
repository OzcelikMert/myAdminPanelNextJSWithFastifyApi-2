import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPagePostAddState } from '@pages/post/add';
import { ProductTypeId } from '@constants/productTypes';

type IComponentProps = {
  productTypes?: IPagePostAddState['productTypes'];
  productTypeId?: ProductTypeId;
};

const ComponentPagePostAddECommerceTabOptions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <ComponentFormInputSelect
          title={t('productType')}
          name="eCommerce.typeId"
          options={props.productTypes}
          value={props.productTypes?.findSingle(
            'value',
            props.productTypeId || ''
          )}
        />
      </div>
    </div>
  );
});

export default ComponentPagePostAddECommerceTabOptions;
