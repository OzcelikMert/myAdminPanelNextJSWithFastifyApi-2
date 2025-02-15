import React from 'react';
import { ProductTypeId } from '@constants/productTypes';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentPagePostAddECommerceTabOptions from './eCommerceTabOptions';
import ComponentPagePostAddECommerceTabGallery from './eCommerceTabGallery';
import ComponentPagePostAddECommerceTabPricing from './eCommerceTabPricing';
import ComponentPagePostAddECommerceTabInvertory from './eCommerceTabInventory';
import ComponentPagePostAddECommerceTabShipping from './eCommerceTabShipping';
import ComponentPagePostAddECommerceTabAttributes from './eCommerceTabAttributes';
import ComponentPagePostAddECommerceTabVariations from './eCommerceTabVariations';
import { IPagePostAddState } from '@pages/post/add';
import { IPostGetResultServiceECommerce } from 'types/services/post.service';
import ComponentThemeTabs from '@components/theme/tabs';
import ComponentThemeTab from '@components/theme/tabs/tab';

type IComponentState = {
  tabKey: string;
};

const initialState: IComponentState = {
  tabKey: 'options',
};

type IComponentProps = {
  attributeTerms?: IPagePostAddState['attributeTerms'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variationTerms?: IPagePostAddState['variationTerms'];
  productTypes?: IPagePostAddState['productTypes'];
  eCommerce?: IPostGetResultServiceECommerce<string>;
  onClickAddNewAttribute?: () => void;
  onClickDeleteAttribute?: (_id: string) => void;
  onClickAddNewVariation?: () => void;
  onClickDeleteVariation?: (_id: string) => void;
  onChangeAttribute?: (attributeId: string, attributeTermId: string) => void;
  onChangeAttributeVariationTerms?: (attributeId: string, variationTerms: string[]) => void;
  onChangeVariationOption?: (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => void;
};

const ComponentPagePostAddECommerce = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const [tabKey, setTabKey] = React.useState(initialState.tabKey);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <ComponentThemeTabs
            onSelect={(key: any) => setTabKey(key)}
            activeKey={tabKey}
          >
            <ComponentThemeTab eventKey="options" title={t('options')}>
              <ComponentPagePostAddECommerceTabOptions
                productTypes={props.productTypes}
                productTypeId={props.eCommerce?.typeId}
              />
            </ComponentThemeTab>
            {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
              <ComponentThemeTab eventKey="gallery" title={t('gallery')}>
                <ComponentPagePostAddECommerceTabGallery
                  images={props.eCommerce.images}
                />
              </ComponentThemeTab>
            ) : null}
            {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
              <ComponentThemeTab eventKey="pricing" title={t('pricing')}>
                <ComponentPagePostAddECommerceTabPricing
                  pricing={props.eCommerce?.pricing}
                />
              </ComponentThemeTab>
            ) : null}
            {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
              <ComponentThemeTab eventKey="inventory" title={t('inventory')}>
                <ComponentPagePostAddECommerceTabInvertory
                  inventory={props.eCommerce?.inventory}
                />
              </ComponentThemeTab>
            ) : null}
            {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
              <ComponentThemeTab eventKey="shipping" title={t('shipping')}>
                <ComponentPagePostAddECommerceTabShipping
                  shipping={props.eCommerce?.shipping}
                />
              </ComponentThemeTab>
            ) : null}
            <ComponentThemeTab
              title={t('attributes')}
              eventKey="attributes"
              formFieldErrorKeys={['eCommerce.attributes']}
            >
              <ComponentPagePostAddECommerceTabAttributes
                attributeTerms={props.attributeTerms}
                attributeTypes={props.attributeTypes}
                variationTerms={props.variationTerms}
                selectedAttributes={props.eCommerce?.attributes}
                onClickAddNew={() =>
                  props.onClickAddNewAttribute && props.onClickAddNewAttribute()
                }
                onClickDelete={(_id) =>
                  props.onClickDeleteAttribute &&
                  props.onClickDeleteAttribute(_id)
                }
                onChangeAttribute={(attributeId, attributeTermId) =>
                  props.onChangeAttribute
                    ? props.onChangeAttribute(attributeId, attributeTermId)
                    : false
                }
                onChangeAttributeVariationTerms={(attributeId, variationTerms) =>
                  props.onChangeAttributeVariationTerms
                    ? props.onChangeAttributeVariationTerms(attributeId, variationTerms)
                    : false
                }
              />
            </ComponentThemeTab>
            {props.eCommerce?.typeId == ProductTypeId.VariableProduct ? (
              <ComponentThemeTab
                title={t('variations')}
                eventKey="variations"
                formFieldErrorKeys={['eCommerce.variations', 'eCommerce.defaultVariationOptions']}
                disabled={Boolean(!props.eCommerce.attributes || props.eCommerce.attributes.length == 0)}
              >
                <ComponentPagePostAddECommerceTabVariations
                  variationTerms={props.variationTerms}
                  attributeTerms={props.attributeTerms}
                  selectedVariations={props.eCommerce?.variations}
                  selectedAttributes={props.eCommerce?.attributes}
                  defaultVariationOptions={
                    props.eCommerce?.defaultVariationOptions
                  }
                  onClickAddNew={() =>
                    props.onClickAddNewVariation &&
                    props.onClickAddNewVariation()
                  }
                  onClickDelete={(_id) =>
                    props.onClickDeleteVariation &&
                    props.onClickDeleteVariation(_id)
                  }
                  onChangeVariationOption={(
                    variationId,
                    attributeId,
                    variationTermId
                  ) =>
                    props.onChangeVariationOption &&
                    props.onChangeVariationOption(
                      variationId,
                      attributeId,
                      variationTermId
                    )
                  }
                />
              </ComponentThemeTab>
            ) : null}
          </ComponentThemeTabs>
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostAddECommerce;
