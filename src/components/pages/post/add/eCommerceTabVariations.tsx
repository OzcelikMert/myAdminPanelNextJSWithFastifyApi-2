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
import { Accordion } from 'react-bootstrap';
import ComponentPagePostAddECommerceTabVariationsItem from './eCommerceTabVariationsItem';

type IComponentState = {
  accordionKey: string;
};

const initialState: IComponentState = {
  accordionKey: '',
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

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
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
              <ComponentPagePostAddECommerceTabVariationsItem
                key={`eCommerceSelectedVariation_${item._id}`}
                item={item}
                index={index}
                attributes={props.attributes}
                variations={props.variations}
                selectedAttributes={props.selectedAttributes}
                selectedVariations={props.selectedVariations}
                variationDefaults={props.variationDefaults}
                isDefault={checkIsVariationDefault(item)}
                isSelected={accordionKey == item._id}
                onClickDelete={(id) => props.onClickDelete(id)}
                onChangeVariation={(mainId, attributeId, variationId) =>
                  props.onChangeVariation(mainId, attributeId, variationId)
                }
                onClickAccordionToggle={(id) => onClickAccordionToggle(id)}
              />
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabVariations;
