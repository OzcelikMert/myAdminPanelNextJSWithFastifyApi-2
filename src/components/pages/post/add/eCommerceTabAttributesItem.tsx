import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion, Card } from 'react-bootstrap';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPagePostAddState } from '@pages/post/add';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';

type IComponentProps = {
  item: IPostECommerceAttributeModel;
  index: number;
  attributes?: IPagePostAddState['attributes'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variations?: IPagePostAddState['variations'];
  isSelected?: boolean
  onClickDelete: (_id: string) => void;
  onChangeAttribute: (mainId: string, attributeId: string) => void;
  onClickAccordionToggle: (id: string) => void;
};

const ComponentPagePostAddECommerceTabAttributesItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <Card>
            <Card.Header>
              <div className="row">
                <div className="col-9">
                  <div className="row">
                    <div className="col-md-6 mt-2 mt-md-0">
                      <ComponentFormSelect
                        title={t('attribute')}
                        name={`eCommerce.attributes.${props.index}.attributeId`}
                        options={props.attributes}
                        value={props.attributes?.findSingle(
                          'value',
                          props.item.attributeId
                        )}
                        onChange={(selectedItem: any, e) =>
                          props.onChangeAttribute(
                            props.item._id,
                            selectedItem.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-6 mt-2 mt-md-0">
                      <ComponentFormSelect
                        title={t('type')}
                        name={`eCommerce.attributes.${props.index}.typeId`}
                        options={props.attributeTypes}
                        value={props.attributeTypes?.findSingle(
                          'value',
                          props.item.typeId
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-3 m-auto">
                  <div className="row">
                    <div className="col-md-6 text-center text-md-end">
                      <button
                        type="button"
                        className="btn btn-gradient-danger btn-lg"
                        onClick={() =>
                          props.onClickDelete(props.item._id)
                        }
                      >
                        <i className="mdi mdi-trash-can"></i>
                      </button>
                    </div>
                    <div className="col-md-6 text-center pt-1 mt-5 m-md-auto">
                      <ComponentAccordionToggle
                        eventKey={props.item._id || ''}
                        onClick={() =>
                          props.onClickAccordionToggle(props.item._id)
                        }
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
            <Accordion.Collapse
              eventKey={props.item._id || ''}
              in={props.isSelected}
            >
              <Card.Body>
                <div className="row">
                  <div className="col-md-12">
                    <ComponentFormSelect
                      title={t('variations')}
                      name={`eCommerce.attributes.${props.index}.variations`}
                      isMulti
                      closeMenuOnSelect={false}
                      options={props.variations?.findMulti(
                        'parentId',
                        props.item.attributeId
                      )}
                      value={props.variations?.findMulti(
                        'value',
                        props.item.variations
                      )}
                    />
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
    );
  }
);

export default ComponentPagePostAddECommerceTabAttributesItem;
