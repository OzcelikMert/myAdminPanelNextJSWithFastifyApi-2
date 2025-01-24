import React from 'react';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { IPostContentButtonModel } from 'types/models/post.model';
import ComponentPagePostButtonsItem from './buttonsItem';

type IComponentProps = {
  items?: IPostContentButtonModel[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostButtons = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-header text-center pt-3">
          <h4>{t('buttons')}</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-7">
              <button
                type={'button'}
                className="btn btn-gradient-success btn-lg"
                onClick={() => props.onClickAddNew()}
              >
                + {t('newButton')}
              </button>
            </div>
            <div className="col-md-7 mt-2">
              <div className="row">
                {props.items?.map((item, index) => (
                  <ComponentPagePostButtonsItem
                    item={item}
                    index={index}
                    onClickAddNew={() => props.onClickAddNew()}
                    onClickDelete={(_id) => props.onClickDelete(_id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostButtons;
