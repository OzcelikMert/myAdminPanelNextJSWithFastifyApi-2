import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion, Card } from 'react-bootstrap';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { IPageFormState, IPagePostAddState } from '@pages/post/add';
import ComponentAccordionToggle from '@components/elements/accordion/toggle';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import ComponentToolTip from '@components/elements/tooltip';
import { useFormContext } from 'react-hook-form';
import { useEffectAfterDidMount } from '@library/react/hooks';

type IComponentProps = {
  item: (IPostECommerceAttributeModel & {id?: string});
  index: number;
  attributeTerms?: IPagePostAddState['attributeTerms'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variationTerms?: IPagePostAddState['variationTerms'];
  isSelected?: boolean;
  onClickDelete: (_id: string) => void;
  onClickAccordionToggle: (id: string) => void;
  onChangeAttribute: (attributeId: string, attributeTermId: string) => void;
};

const ComponentPagePostAddECommerceTabAttributesItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const form = useFormContext<IPageFormState>();
    const watchAttributeTermId = form.watch(`eCommerce.attributes.${props.index}.attributeTermId`);
    const watchVariationTerms = form.watch(`eCommerce.attributes.${props.index}.variationTerms`);

    useEffectAfterDidMount(() => {
      console.log("ComponentPagePostAddECommerceTabAttributesItem", props.item);
    }, [watchVariationTerms])

    return (
      <Card>
        <Card.Header>
          <div className="row">
            <div className="col-9">
              <div className="row">
                <div className="col-md-6 mt-2 mt-md-0">
                  <ComponentThemeFormInputSelect
                    title={t('attribute')}
                    name={`eCommerce.attributes.${props.index}.attributeTermId`}
                    options={props.attributeTerms}
                    onChange={(selectedItem, e) =>
                      props.onChangeAttribute(
                        props.item._id,
                        (selectedItem as IComponentInputSelectData).value
                      )
                    }
                  />
                </div>
                <div className="col-md-6 mt-2 mt-md-0">
                  <ComponentThemeFormInputSelect
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
                {props.item.variationTerms.length == 0 ? (
                  <div className="col-md text-center text-md-start mb-2 mb-md-0">
                    <ComponentToolTip
                      message={t('eCommerceAttributeLengthError')}
                    >
                      <i className="mdi mdi-alert-circle text-danger fs-3"></i>
                    </ComponentToolTip>
                  </div>
                ) : null}
                <div className="col-md text-center text-md-end">
                  <button
                    type="button"
                    className="btn btn-gradient-danger btn-lg"
                    onClick={() => props.onClickDelete(props.item._id)}
                  >
                    <i className="mdi mdi-trash-can"></i>
                  </button>
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
        <Accordion.Collapse
          eventKey={props.item._id || ''}
          in={props.isSelected}
        >
          <Card.Body>
            <div className="row">
              <div className="col-md-12">
                <ComponentThemeFormInputSelect
                  title={t('variations')}
                  name={`eCommerce.attributes.${props.index}.variationTerms`}
                  options={props.variationTerms}
                  closeMenuOnSelect={false}
                  isMulti
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
