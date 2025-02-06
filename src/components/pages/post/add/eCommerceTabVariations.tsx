import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPagePostAddState } from '@pages/post/add';
import {
  IPostECommerceVariationModel,
} from 'types/models/post.model';
import { Accordion } from 'react-bootstrap';
import ComponentPagePostAddECommerceTabVariationsItem from './eCommerceTabVariationsItem';
import {
  IPostGetResultServiceECommerceAttribute,
  IPostGetResultServiceECommerceVariation,
  IPostGetResultServiceECommerceVariationOption,
} from 'types/services/post.service';

type IComponentState = {
  accordionKey: string;
};

const initialState: IComponentState = {
  accordionKey: '',
};

type IComponentProps = {
  attributeTerms?: IPagePostAddState['attributeTerms'];
  variationTerms?: IPagePostAddState['variationTerms'];
  selectedVariations?: IPostGetResultServiceECommerceVariation[];
  selectedAttributes?: IPostGetResultServiceECommerceAttribute[];
  defaultVariationOptions?: IPostGetResultServiceECommerceVariationOption[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
  onChangeVariationOption: (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => void;
};

const ComponentPagePostAddECommerceTabVariations = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
    };

    const checkIsVariationDefault = (item: IPostECommerceVariationModel) => {
      return props.defaultVariationOptions &&
        item.options &&
        item.options.length > 0
        ? props.defaultVariationOptions.every((defaultVariationOption) =>
            item.options.some(
              (selectedVariation) =>
                selectedVariation.attributeId ==
                  defaultVariationOption.attributeId &&
                selectedVariation.variationTermId ==
                  defaultVariationOption.variationTermId
            )
          )
        : false;
    };

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <h4>{t('default')}</h4>
          <div className="row">
            {props.selectedAttributes?.map((item, index) => {
              const indexOption = props.defaultVariationOptions?.indexOfKey(
                'attributeId',
                item._id
              );
              
              if (typeof indexOption === "number" && indexOption > -1) {
                return (
                  <div className="col-md-4 mt-3">
                    <ComponentFormInputSelect
                      name={`eCommerce.defaultVariationOptions.${indexOption}.variationTermId`}
                      title={
                        props.attributeTerms?.findSingle(
                          'value',
                          item.attributeTermId
                        )?.label
                      }
                      options={props.variationTerms?.findMulti(
                        'parentId',
                        item.attributeTermId
                      ).findMulti(
                        'value',
                        item.variationTerms
                      )}
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
        <div className="col-md-7 mt-3">
          <Accordion flush>
            {props.selectedVariations?.map((item, index) => (
              <ComponentPagePostAddECommerceTabVariationsItem
                key={`eCommerceVariation_${item._id}`}
                item={item}
                index={index}
                attributeTerms={props.attributeTerms}
                variationTerms={props.variationTerms}
                selectedAttributes={props.selectedAttributes}
                selectedVariations={props.selectedVariations}
                defaultVariationOptions={props.defaultVariationOptions}
                isDefault={checkIsVariationDefault(item)}
                isSelected={accordionKey == item._id}
                onClickDelete={(id) => props.onClickDelete(id)}
                onChangeVariationOption={(
                  variationId,
                  attributeId,
                  variationTermId
                ) =>
                  props.onChangeVariationOption(
                    variationId,
                    attributeId,
                    variationTermId
                  )
                }
                onClickAccordionToggle={(id) => onClickAccordionToggle(id)}
              />
            ))}
          </Accordion>
        </div>
        <div className="col-md-7 text-center mt-4">
          <button
            type={'button'}
            className="btn btn-gradient-success btn-lg"
            onClick={() => props.onClickAddNew()}
          >
            + {t('addNew')}
          </button>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabVariations;
