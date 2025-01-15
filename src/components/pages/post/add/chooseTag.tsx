import { ActionDispatch, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { PostTermService } from '@services/postTerm.service';
import { PostTermTypeId } from '@constants/postTermTypes';
import { StatusId } from '@constants/status';
import ComponentToast from '@components/elements/toast';
import {
  IPostAddAction,
  IPostAddComponentFormState,
  IPostAddComponentState,
  PostAddActionTypes,
} from '@pages/post/add';
import { IUseFormReducer, useFormReducer } from '@library/react/handles/form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormSelect from '@components/elements/form/input/select';
import { useDidMount } from '@library/react/customHooks';

type IComponentState = {
  isShowModal: boolean;
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isShowModal: false,
  isSubmitting: false,
};

type IComponentFormState = {
  title: string;
};

const initialFormState: IComponentFormState = {
  title: '',
};

type IComponentProps = {
  state: IPostAddComponentState;
  dispatch: ActionDispatch<[action: IPostAddAction]>;
  formState: IPostAddComponentFormState;
  setFormState: IUseFormReducer<IPostAddComponentFormState>['setFormState'];
  onChangeSelect: IUseFormReducer<IPostAddComponentFormState>['onChangeSelect'];
};

export default function ComponentPagePostAddChooseTag(props: IComponentProps) {
  const abortController = new AbortController();

  const t = useAppSelector(selectTranslation);

  const [isShowModal, setIsShowModal] = useState(initialState.isShowModal);
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>(initialFormState);

  useDidMount(() => {
    return () => {
      abortController.abort();
    };
  });

  const onAddNew = async () => {
    setIsSubmitting(true);

    const serviceResult = await PostTermService.add(
      {
        typeId: PostTermTypeId.Tag,
        postTypeId: props.formState.typeId,
        statusId: StatusId.Active,
        rank: 0,
        contents: {
          langId: props.formState.contents.langId,
          title: formState.title,
        },
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      props.dispatch({
        type: PostAddActionTypes.SET_TAGS,
        payload: [
          {
            value: serviceResult.data._id,
            label: formState.title,
          },
          ...props.state.tags,
        ],
      });
      setFormState({ title: '' });
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `'${formState.title}' ${t('itemAdded')}`,
        timeOut: 3,
      });
    }
  };

  const MainModal = () => {
    return (
      <Modal className="form-modal" size="lg" centered show={isShowModal}>
        <Modal.Header className="border-bottom-0">
          <div className="w-100 text-end">
            <button
              className="btn btn-gradient-dark"
              onClick={() => setIsShowModal(false)}
            >
              <i className="fa fa-close"></i>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="m-0 p-0">
          <div className="card">
            <div className="card-body">
              <h4 className="text-center">{t('tag')}</h4>
              <div className="row mt-4">
                <div className="col-md-12">
                  <ComponentFormInput
                    title={`${t('title')}*`}
                    name="newItemTitle"
                    type="text"
                    required={true}
                    value={formState.title}
                    onChange={(e) => onChangeInput(e)}
                  />
                </div>
                <div className="col-md-12 mt-4 text-end submit">
                  {isSubmitting ? (
                    <ComponentFormLoadingButton text={t('loading')} />
                  ) : (
                    <button
                      type={'button'}
                      className="btn btn-gradient-success"
                      onClick={() => onAddNew()}
                    >
                      <i className="mdi mdi-plus"></i> {t('add')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div>
      <Modal />
      <div className="row">
        <div className="col-md-10">
          <ComponentFormSelect
            title={t('tag')}
            name="tags"
            placeholder={t('chooseTag').toCapitalizeCase()}
            isMulti
            closeMenuOnSelect={false}
            options={props.state.tags}
            value={props.state.tags?.filter((item) =>
              props.formState.tags?.includes(item.value)
            )}
            onChange={(item: any, e) => props.onChangeSelect(e.name, item)}
          />
        </div>
        <div className="col-md-2 mt-2 m-md-auto text-end text-md-center">
          <button
            type={'button'}
            className="btn btn-gradient-success btn-lg"
            onClick={() => setIsShowModal(true)}
          >
            <i className="mdi mdi-plus"></i> {t('addNew')}
          </button>
        </div>
      </div>
    </div>
  );
}
