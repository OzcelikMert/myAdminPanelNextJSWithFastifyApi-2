import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { IPageFormState, IPagePostAddState } from '@pages/post/add';
import {
  IPostECommerceVariationModel,
  IPostECommerceVariationOptionModel,
} from 'types/models/post.model';
import { Accordion } from 'react-bootstrap';
import ComponentPagePostAddECommerceTabVariationsItem from './eCommerceTabVariationsItem';
import {
  IPostGetResultServiceECommerceAttribute,
  IPostGetResultServiceECommerceVariation,
} from 'types/services/post.service';
import { useFormContext } from 'react-hook-form';

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
  defaultVariationOptions?: IPostECommerceVariationOptionModel[];
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
    const form = useFormContext<IPageFormState>();
    
    const watchDefaultOptions = form.watch("eCommerce.defaultVariationOptions");
    
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
            {props.defaultVariationOptions?.map((item, index) => {
                const attribute = props.selectedAttributes?.findSingle("_id", item.attributeId);
                if(!attribute) return null;

                return (
                  <div className="col-md-3">
                    <ComponentThemeFormInputSelect
                      key={item._id}
                      name={`eCommerce.defaultVariationOptions.${index}.variationTermId`}
                      title={
                        props.attributeTerms?.findSingle(
                          'value',
                          attribute?.attributeTermId
                        )?.label
                      }
                      options={props.variationTerms?.findMulti(
                        'value',
                        attribute?.variationTerms
                      )}
                    />
                  </div>
                );
              
            })}
          </div>
        </div>
        <div className="col-md-7 mt-3">
          <Accordion flush>
            {props.selectedVariations?.map((item, index) => (
              <ComponentPagePostAddECommerceTabVariationsItem
                key={item._id}
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
