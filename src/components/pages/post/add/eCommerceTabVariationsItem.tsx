import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
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
  tabKey: string;
};

const initialState: IComponentState = {
  tabKey: 'general',
};

type IComponentProps = {
  item: IPostECommerceVariationModel;
  index: number;
  attributes?: IPagePostAddState['attributes'];
  variations?: IPagePostAddState['variations'];
  selectedVariations?: IPostECommerceVariationModel[];
  selectedAttributes?: IPostECommerceAttributeModel[];
  variationDefaults?: IPostECommerceVariationSelectedModel[];
  isDefault?: boolean;
  isSelected?: boolean;
  onClickDelete: (_id: string) => void;
  onChangeVariation: (
    mainId: string,
    attributeId: string,
    variationId: string
  ) => void;
  onClickAccordionToggle: (id: string) => void;
};

const ComponentPagePostAddECommerceTabVariationsItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

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
                {props.selectedAttributes?.map((attribute) => (
                  <div className="col-md mt-3">
                    <ComponentFormInputSelect
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
                        props.item.selectedVariations.findSingle(
                          'attributeId',
                          attribute.attributeId
                        )?.variationId
                      )}
                      onChange={(selectedItem: any, e) =>
                        props.onChangeVariation(
                          props.item._id,
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
                    image={props.item.itemId.contents?.image}
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
