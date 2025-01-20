import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import { IPostECommerceInventoryModel } from 'types/models/post.model';

type IComponentProps = {
  inventory?: IPostECommerceInventoryModel;
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
                name="eCommerce.inventory.sku"
                type="text"
              />
            </div>
            <div className="col-md-6 mb-3">
              <ComponentFormInput
                title={t('quantity')}
                name="eCommerce.inventory.quantity"
                disabled={!props.inventory?.isManageStock || false}
                type="number"
              />
            </div>
            <div className="col-md-7">
              <ComponentFormCheckBox
                title={t('isManageStock')}
                name="eCommerce.inventory.isManageStock"
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
