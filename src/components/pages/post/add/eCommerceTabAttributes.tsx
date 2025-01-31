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
  attributes?: IPagePostAddState['attributes'];
  attributeTypes?: IPagePostAddState['attributeTypes'];
  variations?: IPagePostAddState['variations'];
  selectedAttributes?: IPostECommerceAttributeModel[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddECommerceTabAttributes = React.memo(
  (props: IComponentProps) => {
    console.log("ComponentPagePostAddECommerceTabAttributes", props);
    const t = useAppSelector(selectTranslation);

    const [accordionKey, setAccordionKey] = React.useState(
      initialState.accordionKey
    );

    useDidMount(() => {
      console.log("ComponentPagePostAddECommerceTabAttributes didMount", props);
    });

    const onClickAccordionToggle = (_id: string) => {
      setAccordionKey((state) =>
        state != _id ? _id : initialState.accordionKey
      );
    };

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
            {props.selectedAttributes?.map((item, index) => (
              <ComponentPagePostAddECommerceTabAttributesItem
                key={item._id}
                item={item}
                attrId={item.attributeId}
                index={index}
                attributes={props.attributes}
                attributeTypes={props.attributeTypes}
                variations={props.variations?.findMulti(
                  'parentId',
                  item.attributeId
                )}
                isSelected={accordionKey == item._id}
                onClickDelete={(_id) => props.onClickDelete(_id)}
                onClickAccordionToggle={(_id) => onClickAccordionToggle(_id)}
              />
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabAttributes;
