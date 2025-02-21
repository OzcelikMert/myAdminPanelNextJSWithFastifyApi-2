import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion } from 'react-bootstrap';
import { IPagePostAddState } from '@pages/post/add';
import ComponentPagePostAddECommerceTabAttributesItem from './eCommerceTabAttributesItem';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';

type IComponentState = {
  accordionKey: string;
};

const initialState: IComponentState = {
  accordionKey: '',
};

type IComponentProps = {
  attributeTerms?: IPagePostAddState['attributeTerms'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variationTerms?: IPagePostAddState['variationTerms'];
  selectedAttributes?: IPostECommerceAttributeModel[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
  onChangeAttribute: (attributeId: string, attributeTermId: string) => void;
  onChangeAttributeVariationTerms: (
    attributeId: string,
    variationTerms: string[]
  ) => void;
};

const ComponentPagePostAddECommerceTabAttributes = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );

    useDidMount(() => {
      findAttributeWithoutVariation();
    });

    useEffectAfterDidMount(() => {
      findAttributeWithoutVariation();
    }, [props.selectedAttributes]);

    const findAttributeWithoutVariation = () => {
      for (const attribute of props.selectedAttributes ?? []) {
        if (attribute.variationTerms.length == 0) {
          if (accordionKey != attribute._id) {
            onClickAccordionToggle(attribute._id);
          }
          break;
        }
      }
    };

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
    };

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <Accordion flush>
            {props.selectedAttributes?.map((item, index) => {
              return (
                <ComponentPagePostAddECommerceTabAttributesItem
                  key={item._id}
                  item={item}
                  index={index}
                  attributeTerms={props.attributeTerms}
                  attributeTypes={props.attributeTypes}
                  variationTerms={props.variationTerms?.findMulti(
                    'parentId',
                    item.attributeTermId
                  )}
                  isSelected={accordionKey == item._id}
                  onClickDelete={(_id) => props.onClickDelete(_id)}
                  onClickAccordionToggle={(_id) => onClickAccordionToggle(_id)}
                  onChangeAttribute={(attributeId, attributeTermId) =>
                    props.onChangeAttribute(attributeId, attributeTermId)
                  }
                  onChangeAttributeVariationTerms={(
                    attributeId,
                    variationTerms
                  ) =>
                    props.onChangeAttributeVariationTerms(
                      attributeId,
                      variationTerms
                    )
                  }
                />
              );
            })}
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

export default ComponentPagePostAddECommerceTabAttributes;
