import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion } from 'react-bootstrap';
import { IPagePostAddState } from '@pages/post/add';
import ComponentPagePostAddECommerceTabAttributesItem from './eCommerceTabAttributesItem';
import { useDidMount } from '@library/react/hooks';

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
  onChangeAttribute: (attributeId: string, attributeTermId: string) => boolean;
};

const ComponentPagePostAddECommerceTabAttributes = React.memo(
  (props: IComponentProps) => {
    console.log('ComponentPagePostAddECommerceTabAttributes', props);
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );

    useDidMount(() => {
      console.log('ComponentPagePostAddECommerceTabAttributes didMount', props);
    });

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
    };

    const onChangeAttribute = (attributeId: string, attributeTermId: string) => {
      if(props.onChangeAttribute(attributeId, attributeTermId)){
        setAccordionKey("");
      }
    }

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <Accordion flush>
            {props.selectedAttributes?.map((item, index) => {
              console.log(
                'ComponentPagePostAddECommerceTabAttributes props.selectedAttributes?.map',
                item,
                props.variationTerms?.findMulti(
                  'parentId',
                  item.attributeTermId
                )
              );

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
                    onChangeAttribute(attributeId, attributeTermId)
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
