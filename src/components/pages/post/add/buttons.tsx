import React from 'react';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormInput from '@components/elements/form/input/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { IPostContentButtonModel } from 'types/models/post.model';

type IComponentProps = {
  items?: IPostContentButtonModel[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostButtons = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const Button = React.memo(
    (buttonProps: { item: IPostContentButtonModel; index: number }) => {
      return (
        <div className="col-md-12 mt-4">
          <ComponentFieldSet
            legend={`${t('button')}#${buttonProps.index + 1}`}
            legendElement={
              <i
                className="mdi mdi-trash-can text-danger fs-3 cursor-pointer"
                onClick={() => props.onClickDelete(buttonProps.item._id)}
              ></i>
            }
          >
            <div className="row mt-2">
              <div className="col-md-6">
                <ComponentFormInput
                  type={'text'}
                  title={t('title')}
                  name={`contents.buttons.${buttonProps.index}.title`}
                />
              </div>
              <div className="col-md-6 mt-3 mt-lg-0">
                <ComponentFormInput
                  type={'text'}
                  title={t('url')}
                  name={`contents.buttons.${buttonProps.index}.url`}
                />
              </div>
            </div>
          </ComponentFieldSet>
        </div>
      );
    }
  );

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
                  <Button item={item} index={index} />
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
