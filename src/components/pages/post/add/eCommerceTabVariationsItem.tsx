import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPageFormState, IPagePostAddState } from '@pages/post/add';
import {
  IPostECommerceAttributeModel,
  IPostECommerceVariationModel,
  IPostECommerceVariationOptionModel,
} from 'types/models/post.model';
import { Accordion, Card, Tab, Tabs } from 'react-bootstrap';
import ComponentToolTip from '@components/elements/tooltip';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';
import ComponentPagePostAddTabGeneral from './tabGeneral';
import ComponentPagePostAddTabContent from './tabContent';
import ComponentPagePostAddECommerceTabGallery from './eCommerceTabGallery';
import ComponentPagePostAddECommerceTabPricing from './eCommerceTabPricing';
import ComponentPagePostAddECommerceTabInvertory from './eCommerceTabInventory';
import ComponentPagePostAddECommerceTabShipping from './eCommerceTabShipping';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { IPostGetResultServiceECommerceVariation } from 'types/services/post.service';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useFormContext } from 'react-hook-form';

type IComponentState = {
  tabKey: string;
};

const initialState: IComponentState = {
  tabKey: 'general',
};

type IComponentProps = {
  item: IPostGetResultServiceECommerceVariation;
  index: number;
  attributeTerms?: IPagePostAddState['attributeTerms'];
  variationTerms?: IPagePostAddState['variationTerms'];
  selectedVariations?: IPostECommerceVariationModel[];
  selectedAttributes?: IPostECommerceAttributeModel[];
  defaultVariationOptions?: IPostECommerceVariationOptionModel[];
  isDefault?: boolean;
  isSelected?: boolean;
  onClickDelete: (_id: string) => void;
  onChangeVariationOption: (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => void;
  onClickAccordionToggle: (id: string) => void;
};

const ComponentPagePostAddECommerceTabVariationsItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useFormContext<IPageFormState>();
    const watchOptions = form.watch(`eCommerce.variations.${props.index}.options`);

    const [tabKey, setTabKey] = React.useState(initialState.tabKey);

    return (
      <Card key={props.item._id ?? props.index}>
        <Card.Header>
          <div className="row">
            <div className="col-9">
              <div className="row">
                <div className="col-md-1 text-start pt-1 mt-5 m-md-auto">
                  <div className="fs-4 cursor-pointer">
                    <i className="mdi mdi-menu"></i>
                  </div>
                </div>
                {props.item.options.map((item, index) => {
                  const attribute = props.selectedAttributes?.findSingle(
                    '_id',
                    item.attributeId
                  );
                  if (!attribute) return null;

                  return (
                    <div className="col-md mt-3">
                      <ComponentFormInputSelect
                        key={item._id}
                        name={`eCommerce.variations.${props.index}.options.${index}.variationTermId`}
                        title={
                          props.attributeTerms?.findSingle(
                            'value',
                            attribute.attributeTermId
                          )?.label
                        }
                        options={props.variationTerms?.findMulti(
                          'value',
                          attribute.variationTerms
                        )}
                        onChange={(selectedItem, e) =>
                          props.onChangeVariationOption(
                            props.item._id,
                            attribute._id,
                            (selectedItem as IComponentInputSelectData).value
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-3 m-auto">
              <div className="row">
                <ComponentThemeToolTipMissingLanguages
                  alternates={props.item.product?.alternates ?? []}
                  divClass="col-md text-center text-md-start mb-2 mb-md-0"
                  div
                />
                <div className="col-md text-center text-md-end m-md-auto">
                  {props.isDefault ? (
                    <ComponentToolTip message={t('default')}>
                      <label className="badge badge-gradient-success px-4 py-2">
                        <i className="mdi mdi-check"></i>
                      </label>
                    </ComponentToolTip>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-gradient-danger btn-lg"
                      onClick={() => props.onClickDelete(props.item._id)}
                    >
                      <i className="mdi mdi-trash-can"></i>
                    </button>
                  )}
                </div>
                <div className="col-md text-center pt-1 mt-5 m-md-auto">
                  <ComponentAccordionToggle
                    eventKey={props.item._id || ''}
                    onClick={() => props.onClickAccordionToggle(props.item._id)}
                  >
                    <div className="fs-4 cursor-pointer">
                      <i
                        className={`mdi mdi-chevron-${props.isSelected ? 'up' : 'down'}`}
                      ></i>
                    </div>
                  </ComponentAccordionToggle>
                </div>
              </div>
            </div>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey={props.item._id} in={props.isSelected}>
          <Card.Body>
            <Tabs
              onSelect={(key: any) => setTabKey(key)}
              activeKey={tabKey}
              className="mb-5"
              transition={false}
            >
              <Tab eventKey="general" title={t('general')}>
                <div className="mb-4">
                  <ComponentPagePostAddTabGeneral
                    index={props.index}
                    isECommerceVariation
                  />
                </div>
              </Tab>
              <Tab eventKey="content" title={t('content')}>
                <div className="mb-4">
                  {tabKey === 'content' ? (
                    <ComponentPagePostAddTabContent
                      index={props.index}
                      isECommerceVariation
                    />
                  ) : null}
                </div>
              </Tab>
              <Tab eventKey="gallery" title={t('gallery')}>
                <div className="mb-4">
                  <ComponentPagePostAddECommerceTabGallery
                    index={props.index}
                    isECommerceVariation
                  />
                </div>
              </Tab>
              <Tab eventKey="pricing" title={t('pricing')}>
                <div className="mb-4">
                  <ComponentPagePostAddECommerceTabPricing
                    index={props.index}
                    isECommerceVariation
                  />
                </div>
              </Tab>
              <Tab eventKey="inventory" title={t('inventory')}>
                <div className="mb-4">
                  <ComponentPagePostAddECommerceTabInvertory
                    index={props.index}
                    isECommerceVariation
                  />
                </div>
              </Tab>
              <Tab eventKey="shipping" title={t('shipping')}>
                <div className="mb-4">
                  <ComponentPagePostAddECommerceTabShipping
                    index={props.index}
                    isECommerceVariation
                  />
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
);

export default ComponentPagePostAddECommerceTabVariationsItem;
