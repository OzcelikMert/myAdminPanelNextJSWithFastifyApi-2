import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPostECommerceAttributeModel } from 'types/models/post.model';
import { Accordion } from 'react-bootstrap';
import { IPagePostAddState } from '@pages/post/add';
import ComponentPagePostAddECommerceTabAttributesItem from './eCommerceTabAttributesItem';

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
  onChangeAttribute: (mainId: string, attributeId: string) => void;
};

const ComponentPagePostAddECommerceTabAttributes = React.memo(
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
                item={item}
                index={index}
                attributes={props.attributes}
                attributeTypes={props.attributeTypes}
                variations={props.variations}
                isSelected={accordionKey == item._id}
                onClickDelete={(_id) => props.onClickDelete(_id)}
                onChangeAttribute={(mainId, attributeId) =>
                  props.onChangeAttribute(mainId, attributeId)
                }
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
