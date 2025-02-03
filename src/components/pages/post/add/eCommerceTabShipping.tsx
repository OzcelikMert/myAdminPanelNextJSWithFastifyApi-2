import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { IPostECommerceShippingModel } from 'types/models/post.model';

type IComponentProps = {
  shipping?: IPostECommerceShippingModel;
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabShipping = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('width')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.shipping.width`
                    : `eCommerce.shipping.width`
                }
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('height')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.shipping.height`
                    : `eCommerce.shipping.height`
                }
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('depth')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.shipping.depth`
                    : `eCommerce.shipping.depth`
                }
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('weight')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.shipping.weight`
                    : `eCommerce.shipping.weight`
                }
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('shippingPrice')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.pricing.shipping`
                    : `eCommerce.pricing.shipping`
                }
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabShipping;
