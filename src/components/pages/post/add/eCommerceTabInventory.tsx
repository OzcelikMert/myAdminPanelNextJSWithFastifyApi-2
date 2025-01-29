import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputCheckbox from '@components/elements/form/inputs/checkbox';
import { IPostECommerceInventoryModel } from 'types/models/post.model';

type IComponentProps = {
  inventory?: IPostECommerceInventoryModel;
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabInvertory = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('sku')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.itemId.eCommerce.inventory.sku`
                    : `eCommerce.inventory.sku`
                }
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('quantity')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.itemId.eCommerce.inventory.quantity`
                    : `eCommerce.inventory.quantity`
                }
                disabled={!props.inventory?.isManageStock || false}
                type="number"
              />
            </div>
            <div className="col-md-7">
              <ComponentFormInputCheckbox
                title={t('isManageStock')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.itemId.eCommerce.inventory.isManageStock`
                    : `eCommerce.inventory.isManageStock`
                }
                value={1}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabInvertory;
