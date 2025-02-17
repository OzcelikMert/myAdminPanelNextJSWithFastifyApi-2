import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { IPostECommerceInventoryModel } from 'types/models/post.model';
import { useFormContext } from 'react-hook-form';
import { IPageFormState } from '@pages/post/add';
import ComponentThemeFormInputSwitch from '@components/theme/form/inputs/switch';

type IComponentProps = {
  inventory?: IPostECommerceInventoryModel;
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabInvertory = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useFormContext<IPageFormState>();

    const watchIsStock = form.watch(
      props.isECommerceVariation
        ? `eCommerce.variations.${props.index ?? 0}.product.eCommerce.inventory.isManageStock`
        : `eCommerce.inventory.isManageStock`
    ) ?? false;
    
    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6">
              <ComponentThemeFormInput
                title={t('sku')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.inventory.sku`
                    : `eCommerce.inventory.sku`
                }
                type="text"
              />
            </div>
            <div className="col-md-6">
              <ComponentThemeFormInput
                title={t('quantity')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.inventory.quantity`
                    : `eCommerce.inventory.quantity`
                }
                disabled={!watchIsStock}
                type="number"
              />
            </div>
            <div className="col-md-7">
              <ComponentThemeFormInputSwitch
                title={t('isManageStock')}
                name={
                  props.isECommerceVariation
                    ? `eCommerce.variations.${props.index}.product.eCommerce.inventory.isManageStock`
                    : `eCommerce.inventory.isManageStock`
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabInvertory;
