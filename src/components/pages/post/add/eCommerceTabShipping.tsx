import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/input/input';
import { IPostECommerceShippingModel } from 'types/models/post.model';

type IComponentProps = {
  shipping?: IPostECommerceShippingModel
};

const ComponentPagePostAddECommerceTabShipping = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('width')}
                name="eCommerce.shipping.width"
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('height')}
                name="eCommerce.shipping.height"
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('depth')}
                name="eCommerce.shipping.depth"
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('weight')}
                name="eCommerce.shipping.weight"
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('shippingPrice')}
                name="eCommerce.pricing.shipping"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
  );
});

export default ComponentPagePostAddECommerceTabShipping;
