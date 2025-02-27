import React from 'react';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { IPostContentButtonModel } from 'types/models/post.model';

type IComponentProps = {
  item: IPostContentButtonModel;
  index: number;
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostButtonsItem = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className={`col-md-12 ${props.index > 0 ? 'mt-5' : ''}`}>
      <ComponentFieldSet
        legend={`${t('button')}#${props.index + 1}`}
        legendElement={
          <i
            className="mdi mdi-trash-can text-danger fs-3 cursor-pointer"
            onClick={() => props.onClickDelete(props.item._id)}
          ></i>
        }
      >
        <div className="row mt-2">
          <div className="col-md-6">
            <ComponentThemeFormInput
              type={'text'}
              title={`${t('title')}*`}
              name={`contents.buttons.${props.index}.title`}
            />
          </div>
          <div className="col-md-6">
            <ComponentThemeFormInput
              type={'text'}
              title={t('url')}
              name={`contents.buttons.${props.index}.url`}
            />
          </div>
        </div>
      </ComponentFieldSet>
    </div>
  );
});

export default ComponentPagePostButtonsItem;
