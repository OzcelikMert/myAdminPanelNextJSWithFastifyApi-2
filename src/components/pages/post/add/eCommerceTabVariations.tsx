import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPagePostAddState } from '@pages/post/add';
import {
  IPostECommerceAttributeModel,
  IPostECommerceVariationModel,
  IPostECommerceVariationSelectedModel,
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

type IComponentState = {
  accordionKey: string;
  variationTabKey: string;
};

const initialState: IComponentState = {
  accordionKey: '',
  variationTabKey: 'general',
};

type IComponentProps = {
  attributes?: IPagePostAddState['attributes'];
  variations?: IPagePostAddState['variations'];
  selectedVariations?: IPostECommerceVariationModel[];
  selectedAttributes?: IPostECommerceAttributeModel[];
  variationDefaults?: IPostECommerceVariationSelectedModel[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
  onChangeVariation: (
    mainId: string,
    attributeId: string,
    variationId: string
  ) => void;
  onChangeVariationDefault: (attributeId: string, variationId: string) => void;
};

const ComponentPagePostAddECommerceTabVariations = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );
    const [variationTabKey, setVariationTabKey] = React.useState(
      initialState.variationTabKey
    );

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
      setVariationTabKey(initialState.variationTabKey);
    };

    const checkIsVariationDefault = (item: IPostECommerceVariationModel) => {
      return (
        props.variationDefaults?.every((defaultVariation) =>
          item.selectedVariations.some(
            (selectedVariation) =>
              selectedVariation.attributeId == defaultVariation.attributeId &&
              selectedVariation.variationId == defaultVariation.variationId
          )
        ) || false
      );
    };

    const Variation = React.memo(
      (variationProps: {
        item: IPostECommerceVariationModel;
        index: number;
        isDefault: boolean;
      }) => {
        return (
          <Card key={variationProps.item._id ?? variationProps.index}>
            <Card.Header>
              <div className="row">
                <div className="col-9">
                  <div className="row">
                    <div className="col-md-1 text-start pt-1 mt-5 m-md-auto">
                      <div className="fs-4 cursor-pointer">
                        <i className="mdi mdi-menu"></i>
                      </div>
                    </div>
                    {props.selectedAttributes?.map((attribute) => (
                      <div className="col-md mt-3">
                        <ComponentFormSelect
                          title={
                            props.attributes?.findSingle(
                              'value',
                              attribute.attributeId
                            )?.label
                          }
                          options={props.variations?.findMulti(
                            'value',
                            attribute.variations
                          )}
                          value={props.variations?.findSingle(
                            'value',
                            variationProps.item.selectedVariations.findSingle(
                              'attributeId',
                              attribute.attributeId
                            )?.variationId
                          )}
                          onChange={(selectedItem: any, e) =>
                            props.onChangeVariation(
                              variationProps.item._id,
                              attribute.attributeId,
                              selectedItem.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-3 m-auto">
                  <div className="row">
                    <div className="col-md text-center text-md-end m-md-auto">
                      {variationProps.isDefault ? (
                        <ComponentToolTip message={t('default')}>
                          <label className="badge badge-gradient-success px-4 py-2">
                            <i className="mdi mdi-check"></i>
                          </label>
                        </ComponentToolTip>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-gradient-danger btn-lg"
                          onClick={() =>
                            props.onClickDelete(variationProps.item._id)
                          }
                        >
                          <i className="mdi mdi-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <div className="col-md text-center pt-1 mt-5 m-md-auto">
                      <ComponentAccordionToggle
                        eventKey={variationProps.item._id || ''}
                        onClick={() =>
                          onClickAccordionToggle(variationProps.item._id)
                        }
                      >
                        <div className="fs-4 cursor-pointer">
                          <i
                            className={`mdi mdi-chevron-${accordionKey == variationProps.item._id ? 'up' : 'down'}`}
                          ></i>
                        </div>
                      </ComponentAccordionToggle>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Header>
            <Accordion.Collapse
              eventKey={variationProps.item._id}
              in={accordionKey == variationProps.item._id}
            >
              <Card.Body>
                <Tabs
                  onSelect={(key: any) => setVariationTabKey(key)}
                  activeKey={variationTabKey}
                  className="mb-5"
                  transition={false}
                >
                  <Tab eventKey="general" title={t('general')}>
                    <div className="mb-4">
                      <ComponentPagePostAddTabGeneral
                        image={variationProps.item.itemId.contents?.image}
                        index={variationProps.index}
                        isECommerceVariation
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="content" title={t('content')}>
                    <div className="mb-4">
                      {variationTabKey === 'content' ? (
                        <ComponentPagePostAddTabContent
                          index={variationProps.index}
                          isECommerceVariation
                        />
                      ) : null}
                    </div>
                  </Tab>
                  <Tab eventKey="gallery" title={t('gallery')}>
                    <div className="mb-4">
                      <ComponentPagePostAddECommerceTabGallery
                        index={variationProps.index}
                        isECommerceVariation
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="pricing" title={t('pricing')}>
                    <div className="mb-4">
                      <ComponentPagePostAddECommerceTabPricing
                        index={variationProps.index}
                        isECommerceVariation
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="inventory" title={t('inventory')}>
                    <div className="mb-4">
                      <ComponentPagePostAddECommerceTabInvertory
                        index={variationProps.index}
                        isECommerceVariation
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="shipping" title={t('shipping')}>
                    <div className="mb-4">
                      <ComponentPagePostAddECommerceTabShipping
                        index={variationProps.index}
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

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <h4>{t('default')}</h4>
          <div className="row">
            {props.selectedAttributes?.map((item) => (
              <div className="col-md-4 mt-3">
                <ComponentFormSelect
                  title={
                    props.attributes?.findSingle('value', item.attributeId)
                      ?.label
                  }
                  options={props.variations?.findMulti(
                    'value',
                    item.variations
                  )}
                  value={props.variations?.findSingle(
                    'value',
                    props.variationDefaults?.findSingle(
                      'attributeId',
                      item.attributeId
                    )?.variationId
                  )}
                  onChange={(selectedItem: any, e) =>
                    props.onChangeVariationDefault(
                      item.attributeId,
                      selectedItem.value
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-7 mt-3">
          <button
            type={'button'}
            className="btn btn-gradient-success btn-lg"
            onClick={() => props.onClickAddNew()}
          >
            + {t('addNew')}
          </button>
        </div>
        <div className="col-md-7 mt-3">
          <Accordion flush>
            {props.selectedVariations?.map((item, index) => (
              <Variation
                key={`eCommerceSelectedVariation_${item._id}`}
                item={item}
                index={index}
                isDefault={checkIsVariationDefault(item)}
              />
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabVariations;
