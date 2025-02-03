import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
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
  onChangeVariation?: (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => void;
};

const ComponentPagePostAddECommerce = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  console.log('ComponentPagePostAddECommerce', props);
  const [tabKey, setTabKey] = React.useState(initialState.tabKey);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="theme-tabs">
            <Tabs
              onSelect={(key: any) => setTabKey(key)}
              activeKey={tabKey}
              className="mb-5"
              transition={false}
            >
              <Tab eventKey="options" title={t('options')}>
                <ComponentPagePostAddECommerceTabOptions
                  productTypes={props.productTypes}
                  productTypeId={props.eCommerce?.typeId}
                />
              </Tab>
              {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
                <Tab eventKey="gallery" title={t('gallery')}>
                  <ComponentPagePostAddECommerceTabGallery
                    images={props.eCommerce.images}
                  />
                </Tab>
              ) : null}
              {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
                <Tab eventKey="pricing" title={t('pricing')}>
                  <ComponentPagePostAddECommerceTabPricing
                    pricing={props.eCommerce?.pricing}
                  />
                </Tab>
              ) : null}
              {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
                <Tab eventKey="inventory" title={t('inventory')}>
                  <ComponentPagePostAddECommerceTabInvertory
                    inventory={props.eCommerce?.inventory}
                  />
                </Tab>
              ) : null}
              {props.eCommerce?.typeId == ProductTypeId.SimpleProduct ? (
                <Tab eventKey="shipping" title={t('shipping')}>
                  <ComponentPagePostAddECommerceTabShipping
                    shipping={props.eCommerce?.shipping}
                  />
                </Tab>
              ) : null}
              <Tab eventKey="attributes" title={t('attributes')}>
                <ComponentPagePostAddECommerceTabAttributes
                  attributeTerms={props.attributeTerms}
                  attributeTypes={props.attributeTypes}
                  variationTerms={props.variationTerms}
                  selectedAttributes={props.eCommerce?.attributes}
                  onClickAddNew={() =>
                    props.onClickAddNewAttribute &&
                    props.onClickAddNewAttribute()
                  }
                  onClickDelete={(_id) =>
                    props.onClickDeleteAttribute &&
                    props.onClickDeleteAttribute(_id)
                  }
                />
              </Tab>
              {props.eCommerce?.typeId == ProductTypeId.VariableProduct ? (
                <Tab eventKey="variations" title={t('variations')}>
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
                    onChangeVariation={(
                      variationId,
                      attributeId,
                      variationTermId
                    ) =>
                      props.onChangeVariation &&
                      props.onChangeVariation(
                        variationId,
                        attributeId,
                        variationTermId
                      )
                    }
                  />
                </Tab>
              ) : null}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostAddECommerce;
