import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { IUseFormReducer } from '@library/react/handles/form';
import {
  IPostAddAction,
  IPostAddComponentFormState,
  IPostAddComponentState,
} from '@pages/post/add';
import { ActionDispatch } from 'react';
import { IPostContentButtonModel } from 'types/models/post.model';

type IComponentProps = {
  state: IPostAddComponentState;
  dispatch: ActionDispatch<[action: IPostAddAction]>;
  formState: IPostAddComponentFormState;
  setFormState: IUseFormReducer<IPostAddComponentFormState>['setFormState'];
};

export default function ComponentPagePostAddButton(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);

  const onChange = (
    key: keyof IPostContentButtonModel,
    value: string,
    index: number
  ) => {
    let buttons = props.formState.contents.buttons ?? [];
    buttons[index][key] = value;
    props.setFormState({
      contents: {
        ...props.formState.contents,
        buttons,
      },
    });
  };

  const onAddNew = () => {
    let buttons = props.formState.contents.buttons ?? [];
    buttons.push({
      title: '',
      url: '',
    });
    props.setFormState({
      contents: {
        ...props.formState.contents,
        buttons,
      },
    });
  };

  const onDelete = (index: number) => {
    let buttons = props.formState.contents.buttons ?? [];
    buttons.remove(index);
    props.setFormState({
      contents: {
        ...props.formState.contents,
        buttons,
      },
    });
  };

  const Button = (props: {
    propButton: IPostContentButtonModel;
    index: number;
  }) => {
    return (
      <div className="col-md-12 mt-4">
        <ComponentFieldSet
          legend={`${t('button')}#${props.index + 1}`}
          legendElement={
            <i
              className="mdi mdi-trash-can text-danger fs-3 cursor-pointer"
              onClick={() => onDelete(props.index)}
            ></i>
          }
        >
          <div className="row mt-2">
            <div className="col-md-6">
              <ComponentFormType
                type={'text'}
                title={t('title')}
                value={props.propButton.title}
                onChange={(e) => onChange('title', e.target.value, props.index)}
              />
            </div>
            <div className="col-md-6 mt-3 mt-lg-0">
              <ComponentFormType
                type={'text'}
                title={t('url')}
                value={props.propButton.url}
                onChange={(e) => onChange('url', e.target.value, props.index)}
              />
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

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
                onClick={() => onAddNew()}
              >
                + {t('newButton')}
              </button>
            </div>
            <div className="col-md-7 mt-2">
              <div className="row">
                {props.formState.contents.buttons?.map((button, index) => {
                  return <Button propButton={button} index={index} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
