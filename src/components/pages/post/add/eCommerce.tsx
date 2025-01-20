import React from 'react';
import {
  IPostECommerceAttributeModel,
  IPostECommerceVariationModel,
} from 'types/models/post.model';
import { Accordion, Card, Tab, Tabs } from 'react-bootstrap';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import Image from 'next/image';
import { ProductTypeId } from '@constants/productTypes';

import { AttributeTypeId } from '@constants/attributeTypes';
import dynamic from 'next/dynamic';
import ComponentToolTip from '@components/elements/tooltip';
import Swal from 'sweetalert2';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { StatusId } from '@constants/status';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormSelect from '@components/elements/form/input/select';
import { useDidMount } from '@library/react/customHooks';
import ComponentPagePostAddECommerceTabOptions from './eCommerceTabOptions';
import ComponentPagePostAddECommerceTabGallery from './eCommerceTabGallery';
import ComponentPagePostAddECommerceTabPricing from './eCommerceTabPricing';
import ComponentPagePostAddECommerceTabInvertory from './eCommerceTabInventory';
import ComponentPagePostAddECommerceTabShipping from './eCommerceTabShipping';
import ComponentPagePostAddECommerceTabAttributes from './eCommerceTabAttributes';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

type IComponentState = {
  mainTabActiveKey: string;
  variationTabActiveKey: string;
  attributeAccordionToggleKey: string;
  variationAccordionToggleKey: string;
};

const initialState: IComponentState = {
  mainTabActiveKey: 'options',
  variationTabActiveKey: 'general',
  attributeAccordionToggleKey: '',
  variationAccordionToggleKey: '',
};

enum ActionTypes {
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_VARIATION_TAB_ACTIVE_KEY,
  SET_ATTRIBUTE_ACCORDION_TOGGLE_KEY,
  SET_VARIATION_ACCORDION_TOGGLE_KEY,
}

type IAction =
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    }
  | {
      type: ActionTypes.SET_VARIATION_TAB_ACTIVE_KEY;
      payload: IComponentState['variationTabActiveKey'];
    }
  | {
      type: ActionTypes.SET_ATTRIBUTE_ACCORDION_TOGGLE_KEY;
      payload: IComponentState['attributeAccordionToggleKey'];
    }
  | {
      type: ActionTypes.SET_VARIATION_ACCORDION_TOGGLE_KEY;
      payload: IComponentState['variationAccordionToggleKey'];
    };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_VARIATION_TAB_ACTIVE_KEY:
      return { ...state, variationTabActiveKey: action.payload };
    case ActionTypes.SET_ATTRIBUTE_ACCORDION_TOGGLE_KEY:
      return { ...state, attributeAccordionToggleKey: action.payload };
    case ActionTypes.SET_VARIATION_ACCORDION_TOGGLE_KEY:
      return { ...state, variationAccordionToggleKey: action.payload };
    default:
      return state;
  }
};

type IComponentProps = {

};

export default function ComponentPagePostAddECommerce(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);

  const [state, dispatch] = useReducer(reducer, initialState);

  useDidMount(() => {
    init();
  });

  const init = () => {
    findDefaultVariation();
    findSameVariation();
  };

  const findSameVariation = () => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce) {
      eCommerce.variations = eCommerce.variations?.map((variation) => {
        const dataFilter = JSON.stringify(
          variation.selectedVariations.map((selectedVariation) => ({
            variationId: selectedVariation.variationId,
            attributeId: selectedVariation.attributeId,
          }))
        );
        variation.isWarningForIsThereOther = eCommerce?.variations?.some(
          (variation_) =>
            variation_._id != variation._id &&
            JSON.stringify(
              variation_.selectedVariations.map((selectedVariation) => ({
                variationId: selectedVariation.variationId,
                attributeId: selectedVariation.attributeId,
              }))
            ) == dataFilter
        );
        return variation;
      });
      props.setFormState({
        eCommerce,
      });
    }
  };

  const findDefaultVariation = () => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce) {
      const dataFilter = JSON.stringify(
        eCommerce.variationDefaults?.map((variationDefault) => ({
          variationId: variationDefault.variationId,
          attributeId: variationDefault.attributeId,
        }))
      );

      eCommerce.variations = eCommerce.variations?.map((variation) => {
        variation.isDefault =
          JSON.stringify(
            variation.selectedVariations.map((selectedVariation) => ({
              variationId: selectedVariation.variationId,
              attributeId: selectedVariation.attributeId,
            }))
          ) == dataFilter;
        return variation;
      });
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onChangeVariationItemContent = (index: number, content: string) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.variations) {
      let variation = eCommerce.variations[index];
      variation.itemId.contents.content = content;
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onSelectVariationItemImage = (index: number, image: string) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.variations) {
      let variation = eCommerce.variations[index];
      variation.itemId.contents.image = image;
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onSelectVariationItemImages = (index: number, images: string[]) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.variations) {
      let variation = eCommerce.variations[index];
      variation.itemId.eCommerce.images = images;
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onAddNewAttribute = () => {
    const _id = String.createId();

    let eCommerce = props.formState.eCommerce;
    if (eCommerce) {
      if (typeof eCommerce.attributes === 'undefined')
        eCommerce.attributes = [];
      eCommerce.attributes.push({
        _id: _id,
        attributeId: '',
        typeId: AttributeTypeId.Text,
        variations: [],
      });

      props.setFormState({
        eCommerce,
      });

      dispatch({ type: ActionTypes.SET_ATTRIBUTE_ACCORDION_TOGGLE_KEY, payload: _id });
    }
  };

  const onChangeAttributeVariations = (
    index: number,
    values: IPostAddComponentState['variations']
  ) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.attributes) {
      let attribute = eCommerce.attributes[index];
      attribute.variations = values.map((value) => value.value);
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onDeleteAttribute = (index: number) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce) {
      eCommerce.attributes?.remove(index);
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onChangeAttribute = (index: number, attributeId: string) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.attributes) {
      let attribute = eCommerce.attributes[index];
      if (attribute.attributeId == attributeId) return false;
      attribute.attributeId = attributeId;
      attribute.variations = [];
      props.setFormState({
        eCommerce,
      });
    }
  };

  const onAddNewVariation = () => {
    const _id = String.createId();

    let eCommerce = props.formState.eCommerce;
    if (eCommerce) {
      if (typeof eCommerce.variations === 'undefined')
        eCommerce.variations = [];
      eCommerce.variations.push({
        _id: _id,
        selectedVariations: [],
        rank: eCommerce.variations.length ?? 0,
        itemId: {
          _id: String.createId(),
          statusId: StatusId.Active,
          contents: {
            title: '',
            langId: props.formState.contents.langId,
          },
          eCommerce: {
            images: [],
            pricing: {
              taxIncluded: 0,
              compared: 0,
              shipping: 0,
              taxExcluded: 0,
              taxRate: 0,
            },
            shipping: {
              width: '',
              height: '',
              depth: '',
              weight: '',
            },
            inventory: {
              sku: '',
              quantity: 0,
              isManageStock: false,
            },
          },
        },
      });

      props.setFormState({
        eCommerce,
      });

      dispatch({ type: ActionTypes.SET_VARIATION_ACCORDION_TOGGLE_KEY, payload: _id });
    }
  };

  const onDeleteVariation = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `${t('deleteSelectedItemsQuestion')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      let eCommerce = props.formState.eCommerce;
      if (eCommerce && eCommerce.variations) {
        eCommerce.variations.remove(index);
        props.setFormState({
          eCommerce,
        });
      }
    }
  };

  const onChangeVariationAttribute = (
    index: number,
    attributeId: string,
    value: string
  ) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.variations) {
      let variation = eCommerce.variations[index];
      const findIndex = variation.selectedVariations.indexOfKey(
        'attributeId',
        attributeId
      );
      if (findIndex > -1) {
        variation.selectedVariations[findIndex].variationId = value;
      } else {
        variation.selectedVariations.push({
          attributeId: attributeId,
          variationId: value,
        });
      }
      props.setFormState({
        eCommerce,
      });

      findSameVariation();
      findDefaultVariation();
    }
  };

  const onChangeVariationDefault = (attributeId: string, value: string) => {
    let eCommerce = props.formState.eCommerce;
    if (eCommerce && eCommerce.variations) {
      if (typeof eCommerce.variationDefaults == 'undefined')
        eCommerce.variationDefaults = [];
      const findIndex = eCommerce.variationDefaults.indexOfKey(
        'attributeId',
        attributeId
      );
      if (findIndex > -1) {
        eCommerce.variationDefaults[findIndex].variationId = value;
      } else {
        eCommerce.variationDefaults.push({
          attributeId: attributeId,
          variationId: value,
        });
      }
      props.setFormState({
        eCommerce,
      });

      findDefaultVariation();
    }
  };

  const onClickAttributeAccordionToggle = (_id: string) => {
    dispatch({
      type: ActionTypes.SET_ATTRIBUTE_ACCORDION_TOGGLE_KEY,
      payload: _id == state.attributeAccordionToggleKey ? '' : _id,
    });
  };

  const onClickVariationAccordionToggle = (_id: string) => {
    dispatch({
      type: ActionTypes.SET_VARIATION_ACCORDION_TOGGLE_KEY,
      payload: _id == state.variationAccordionToggleKey ? '' : _id,
    });
  };
  

  const Variation = (
    variation: IPostECommerceVariationModel,
    index: number
  ) => {
    return (
      <Card key={variation._id ?? index}>
        <Card.Header>
          <div className="row">
            <div className="col-9">
              <div className="row">
                <div className="col-md-1 text-start pt-1 mt-5 m-md-auto">
                  <div className="fs-4 cursor-pointer">
                    <i className="mdi mdi-menu"></i>
                  </div>
                </div>
                {props.formState.eCommerce?.attributes?.map((attribute) => (
                  <div className="col-md mt-3">
                    <ComponentFormSelect
                      title={
                        props.state.attributes.findSingle(
                          'value',
                          attribute.attributeId
                        )?.label
                      }
                      options={props.state.variations.findMulti(
                        'value',
                        attribute.variations
                      )}
                      value={props.state.variations.findSingle(
                        'value',
                        variation.selectedVariations.findSingle(
                          'attributeId',
                          attribute.attributeId
                        )?.variationId
                      )}
                      onChange={(item: any, e) =>
                        onChangeVariationAttribute(
                          index,
                          attribute.attributeId,
                          item.value
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
                  {variation.isDefault ? (
                    <ComponentToolTip message={t('default')}>
                      <label className="badge badge-gradient-success px-4 py-2">
                        <i className="mdi mdi-check"></i>
                      </label>
                    </ComponentToolTip>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-gradient-danger btn-lg"
                      onClick={() => onDeleteVariation(index)}
                    >
                      <i className="mdi mdi-trash-can"></i>
                    </button>
                  )}
                </div>
                {variation.isWarningForIsThereOther ? (
                  <div className="col-md text-center pt-1 mt-5 m-md-auto">
                    <ComponentToolTip message={t('sameVariationErrorMessage')}>
                      <div className="fs-4 cursor-pointer text-warning">
                        <i className="mdi mdi-alert-circle"></i>
                      </div>
                    </ComponentToolTip>
                  </div>
                ) : null}
                <div className="col-md text-center pt-1 mt-5 m-md-auto">
                  <ComponentAccordionToggle
                    eventKey={variation._id || ''}
                    onClick={() =>
                      onClickVariationAccordionToggle(variation._id ?? '')
                    }
                  >
                    <div className="fs-4 cursor-pointer">
                      <i
                        className={`mdi mdi-chevron-${state.variationAccordionToggleKey == variation._id ? 'up' : 'down'}`}
                      ></i>
                    </div>
                  </ComponentAccordionToggle>
                </div>
              </div>
            </div>
          </div>
        </Card.Header>
        <Accordion.Collapse
          eventKey={variation._id || ''}
          in={state.variationAccordionToggleKey == variation._id}
        >
          <Card.Body>
            <Tabs
              onSelect={(key: any) =>
                dispatch({
                  type: ActionTypes.SET_VARIATION_TAB_ACTIVE_KEY,
                  payload: key,
                })
              }
              activeKey={state.variationTabActiveKey}
              className="mb-5"
              transition={false}
            >
              <Tab eventKey="general" title={t('general')}>
                <div className="row mb-4">
                  <div className="col-md-7 mb-3">
                    <ComponentThemeChooseImage
                      onSelected={(images) =>
                        onSelectVariationItemImage(index, images[0])
                      }
                      isMulti={false}
                      selectedImages={
                        variation.itemId.contents &&
                        variation.itemId.contents.image
                          ? [variation.itemId.contents.image]
                          : undefined
                      }
                      isShowReviewImage={true}
                      reviewImage={variation.itemId.contents?.image}
                      reviewImageClassName={'post-image'}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={t('title')}
                      name={`eCommerce.variations.${index}.itemId.contents.title`}
                      type="text"
                      value={variation.itemId.contents.title}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={t('shortContent').toCapitalizeCase()}
                      type="textarea"
                      name={`eCommerce.variations.${index}.itemId.contents.shortContent`}
                      value={variation.itemId.contents?.shortContent}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="content" title={t('content')}>
                <div className="row mb-4">
                  <div className="col-md-12 mb-3">
                    {state.variationTabActiveKey === 'content' ? (
                      <ComponentThemeRichTextBox
                        value={variation.itemId.contents?.content || ''}
                        onChange={(newContent) =>
                          onChangeVariationItemContent(index, newContent)
                        }
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="gallery" title={t('gallery')}>
                <div className="row mb-4">
                  <div className="col-md-7 mb-3">
                    <ComponentThemeChooseImage
                      onSelected={(images) =>
                        onSelectVariationItemImages(index, images)
                      }
                      isMulti={true}
                      selectedImages={variation.itemId.eCommerce.images}
                      showModalButtonText={t('gallery')}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="row">
                      {variation.itemId.eCommerce.images.map((image) => (
                        <div className="col-md-3 mb-3">
                          <Image
                            src={ImageSourceUtil.getUploadedImageSrc(image)}
                            alt="Empty Image"
                            className="post-image img-fluid"
                            width={100}
                            height={100}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="pricing" title={t('pricing')}>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('taxIncludedPrice')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.pricing.taxIncluded`}
                      type="number"
                      value={variation.itemId.eCommerce.pricing?.taxIncluded}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('taxExcludedPrice')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.pricing.taxExcluded`}
                      type="number"
                      value={variation.itemId.eCommerce.pricing?.taxExcluded}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('taxRate')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.pricing.taxRate`}
                      type="number"
                      value={variation.itemId.eCommerce.pricing?.taxRate}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('comparedPrice')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.pricing.compared`}
                      type="number"
                      value={variation.itemId.eCommerce.pricing?.compared}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="inventory" title={t('inventory')}>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('sku')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.inventory.sku`}
                      type="text"
                      value={variation.itemId.eCommerce.inventory?.sku}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      disabled={
                        !variation.itemId.eCommerce.inventory?.isManageStock ||
                        false
                      }
                      title={t('quantity')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.inventory.quantity`}
                      type="number"
                      value={variation.itemId.eCommerce.inventory?.quantity}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-7 mb-3">
                    <ComponentFormCheckBox
                      title={t('isManageStock')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.inventory.isManageStock`}
                      checked={Boolean(
                        variation.itemId.eCommerce.inventory?.isManageStock
                      )}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="shipping" title={t('shipping')}>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('width')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.shipping.width`}
                      type="text"
                      value={variation.itemId.eCommerce.shipping?.width}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('height')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.shipping.height`}
                      type="text"
                      value={variation.itemId.eCommerce.shipping?.height}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('depth')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.shipping.depth`}
                      type="text"
                      value={variation.itemId.eCommerce.shipping?.depth}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('weight')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.shipping.weight`}
                      type="text"
                      value={variation.itemId.eCommerce.shipping?.weight}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <ComponentFormInput
                      title={t('shippingPrice')}
                      name={`eCommerce.variations.${index}.itemId.eCommerce.pricing.shipping`}
                      type="number"
                      value={variation.itemId.eCommerce.pricing?.shipping}
                      onChange={(e) => props.onChangeInput(e)}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };

  const TabVariations = () => {
    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <h4>{t('default')}</h4>
          <div className="row">
            {props.formState.eCommerce?.attributes?.map((attribute) => (
              <div className="col-md-4 mt-3">
                <ComponentFormSelect
                  title={
                    props.state.attributes.findSingle(
                      'value',
                      attribute.attributeId
                    )?.label
                  }
                  options={props.state.variations.findMulti(
                    'value',
                    attribute.variations
                  )}
                  value={props.state.variations.findSingle(
                    'value',
                    props.formState.eCommerce?.variationDefaults?.findSingle(
                      'attributeId',
                      attribute.attributeId
                    )?.variationId
                  )}
                  onChange={(item: any, e) =>
                    onChangeVariationDefault(attribute.attributeId, item.value)
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
            onClick={() => onAddNewVariation()}
          >
            + {t('addNew')}
          </button>
        </div>
        <div className="col-md-7 mt-3">
          <Accordion flush>
            {props.formState.eCommerce?.variations?.map((variation, index) =>
              Variation(variation, index)
            )}
          </Accordion>
        </div>
      </div>
    );
  };

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="theme-tabs">
            <Tabs
              onSelect={(key: any) =>
                dispatch({ type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY, payload: key })
              }
              activeKey={state.mainTabActiveKey}
              className="mb-5"
              transition={false}
            >
              <Tab eventKey="options" title={t('options')}>
                <ComponentPagePostAddECommerceTabOptions
                  productTypes={}
                  productTypeId={}
                />
              </Tab>
              {props.formState.eCommerce?.typeId ==
              ProductTypeId.SimpleProduct ? (
                <Tab eventKey="gallery" title={t('gallery')}>
                  <ComponentPagePostAddECommerceTabGallery
                    images={}
                    onChangeImages={}
                  />
                </Tab>
              ) : null}
              {props.formState.eCommerce?.typeId ==
              ProductTypeId.SimpleProduct ? (
                <Tab eventKey="pricing" title={t('pricing')}>
                  <ComponentPagePostAddECommerceTabPricing
                    pricing={}
                  />
                </Tab>
              ) : null}
              {props.formState.eCommerce?.typeId ==
              ProductTypeId.SimpleProduct ? (
                <Tab eventKey="inventory" title={t('inventory')}>
                  <ComponentPagePostAddECommerceTabInvertory
                    inventory={}
                  />
                </Tab>
              ) : null}
              {props.formState.eCommerce?.typeId ==
              ProductTypeId.SimpleProduct ? (
                <Tab eventKey="shipping" title={t('shipping')}>
                  <ComponentPagePostAddECommerceTabShipping
                    shipping={}
                  />
                </Tab>
              ) : null}
              <Tab eventKey="attributes" title={t('attributes')}>
                <ComponentPagePostAddECommerceTabAttributes
                  attributes={}
                  attributeTypes={}
                  variations={}
                  onClickAddNew={}
                  onClickDelete={}
                />
              </Tab>
              {props.formState.eCommerce?.typeId ==
              ProductTypeId.VariableProduct ? (
                <Tab eventKey="variations" title={t('variations')}>
                  <TabVariations />
                </Tab>
              ) : null}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
