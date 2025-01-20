import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion, Card } from 'react-bootstrap';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPagePostAddState } from '@pages/post/add';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';

type IComponentState = {
  accordionKey: string;
};

const initialState: IComponentState = {
  accordionKey: '',
};

type IComponentProps = {
  attributes?: IPostECommerceAttributeModel[];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variations?: IPagePostAddState['variations'];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddECommerceTabAttributes = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey(_id);
    };

    const Attribute = React.memo(
      (attributeProps: {
        item: IPostECommerceAttributeModel;
        index: number;
      }) => {
        const isSelected = accordionKey == attributeProps.item._id;

        return (
          <Card>
            <Card.Header>
              <div className="row">
                <div className="col-9">
                  <div className="row">
                    <div className="col-md-6 mt-2 mt-md-0">
                      <ComponentFormSelect
                        title={t('attribute')}
                        name={`eCommerce.attributes.${attributeProps.index}.attributeId`}
                        options={props.attributes}
                        value={props.attributes?.findSingle(
                          'value',
                          attributeProps.item.attributeId
                        )}
                      />
                    </div>
                    <div className="col-md-6 mt-2 mt-md-0">
                      <ComponentFormSelect
                        title={t('type')}
                        name={`eCommerce.attributes.${attributeProps.index}.typeId`}
                        options={props.attributeTypes}
                        value={props.attributeTypes?.findSingle(
                          'value',
                          attributeProps.item.typeId
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
                          props.onClickDelete(attributeProps.item._id)
                        }
                      >
                        <i className="mdi mdi-trash-can"></i>
                      </button>
                    </div>
                    <div className="col-md-6 text-center pt-1 mt-5 m-md-auto">
                      <ComponentAccordionToggle
                        eventKey={attributeProps.item._id || ''}
                        onClick={() =>
                          onClickAccordionToggle(attributeProps.item._id)
                        }
                      >
                        <div className="fs-4 cursor-pointer">
                          <i
                            className={`mdi mdi-chevron-${isSelected ? 'up' : 'down'}`}
                          ></i>
                        </div>
                      </ComponentAccordionToggle>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Header>
            <Accordion.Collapse
              eventKey={attributeProps.item._id || ''}
              in={isSelected}
            >
              <Card.Body>
                <div className="row">
                  <div className="col-md-12">
                    <ComponentFormSelect
                      title={t('variations')}
                      name={`eCommerce.attributes.${attributeProps.index}.variations`}
                      isMulti
                      closeMenuOnSelect={false}
                      options={props.variations?.findMulti(
                        'parentId',
                        attributeProps.item.attributeId
                      )}
                      value={props.variations?.findMulti(
                        'value',
                        attributeProps.item.variations
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

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <button
            type={'button'}
            className="btn btn-gradient-success btn-lg"
            onClick={() => props.onClickAddNew()}
          >
            + {t('addNew')}
          </button>
        </div>
        <div className="col-md-7 mt-2">
          <Accordion flush>
            {props.attributes?.map((item, index) => (
              <Attribute item={item} index={index} />
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabAttributes;
