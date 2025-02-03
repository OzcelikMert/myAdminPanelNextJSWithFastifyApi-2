import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion, Card } from 'react-bootstrap';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPagePostAddState } from '@pages/post/add';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { useDidMount } from '@library/react/hooks';

type IComponentProps = {
  item: IPostECommerceAttributeModel;
  index: number;
  attributeTerms?: IPagePostAddState['attributeTerms'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variationTerms?: IPagePostAddState['variationTerms'];
  isSelected?: boolean;
  onClickDelete: (_id: string) => void;
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
                  <ComponentFormInputSelect
                    title={t('attribute')}
                    name={`eCommerce.attributes.${props.index}.attributeTermId`}
                    options={props.attributeTerms}
                    watch
                  />
                </div>
                <div className="col-md-6 mt-2 mt-md-0">
                  <ComponentFormInputSelect
                    title={t('type')}
                    name={`eCommerce.attributes.${props.index}.typeId`}
                    options={props.attributeTypes}
                    valueAsNumber
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
                    onClick={() => props.onClickDelete(props.item._id)}
                  >
                    <i className="mdi mdi-trash-can"></i>
                  </button>
                </div>
                <div className="col-md-6 text-center pt-1 mt-5 m-md-auto">
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
        <Accordion.Collapse
          eventKey={props.item._id || ''}
          in={props.isSelected}
        >
          <Card.Body>
            <div className="row">
              <div className="col-md-12">
                <ComponentFormInputSelect
                  title={t('variations')}
                  name={`eCommerce.attributes.${props.index}.variationTerms`}
                  options={props.variationTerms}
                  isMulti
                  closeMenuOnSelect={false}
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
