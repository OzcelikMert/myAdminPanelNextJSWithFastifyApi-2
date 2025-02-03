import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { IPostECommercePricingModel } from 'types/models/post.model';

type IComponentProps = {
  pricing?: IPostECommercePricingModel;
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabPricing = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('taxIncludedPrice')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.pricing.taxIncluded`
                    : `eCommerce.pricing.taxIncluded`
                }
                type="number"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('taxExcludedPrice')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.pricing.taxExcluded`
                    : `eCommerce.pricing.taxExcluded`
                }
                type="number"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('taxRate')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.pricing.taxRate`
                    : `eCommerce.pricing.taxRate`
                }
                type="number"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('comparedPrice')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.pricing.compared`
                    : `eCommerce.pricing.compared`
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

export default ComponentPagePostAddECommerceTabPricing;
