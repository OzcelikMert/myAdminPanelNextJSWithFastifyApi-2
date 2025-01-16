import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormInput from '@components/elements/form/input/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/customHooks';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { useForm } from 'react-hook-form';
import ComponentForm from '@components/elements/form';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';

type IComponentRefs = {
  elementTypes: IThemeFormSelectData<ElementTypeId>[];
};

type IComponentFormState = {} & IComponentElementModel;

const initialFormState: IComponentFormState = {
  _id: '',
  title: '',
  rank: 1,
  typeId: ElementTypeId.Text,
  key: '',
  contents: {
    langId: '',
  },
};

type IComponentProps = {
  isShow: boolean;
  item?: IComponentElementModel;
  onHide: () => void;
  onSubmit: (newItem: IComponentElementModel) => Promise<boolean | void>;
};

const ComponentPageComponentAddElementEditModal = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useForm<IComponentFormState>({
      defaultValues: props.item || initialFormState,
    });

    const getElementTypes = () => {
      return elementTypes.map((type) => ({
        label: t(type.langKey),
        value: type.id,
      }));
    };

    const elementTypeRef =
      React.useRef<IComponentRefs['elementTypes']>(getElementTypes());

    useEffectAfterDidMount(() => {
      if (props.isShow) {
        form.reset(props.item);
      }
    }, [props.isShow, props.item]);

    const onSubmit = async (data: IComponentFormState) => {
      const submitResult = await props.onSubmit(data);
      if (submitResult) {
        props.onHide();
      }
    };

    return (
      <Modal className="form-modal" size="lg" centered show={props.isShow}>
        <Modal.Header className="border-bottom-0">
          <div className="w-100 text-end">
            <button
              className="btn btn-gradient-dark"
              onClick={() => props.onHide()}
            >
              <i className="fa fa-close"></i>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="m-0 p-0">
          <div className="card">
            <div className="card-body">
              <h4 className="text-center">
                {t('component')} - {t('edit')} -{' '}
                {props.item?.title || t('newElement')}
              </h4>
              <div className="row mt-4">
                <ComponentForm
                  hideSubmitButton
                  onSubmit={(data) => onSubmit(data)}
                  formMethods={form}
                >
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <ComponentFormInput
                        title={`${t('title')}*`}
                        name="title"
                        placeholder={t('title')}
                        type="text"
                        required
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ComponentFormInput
                        title={`${t('key')}*`}
                        name="key"
                        type="text"
                        required
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ComponentFormSelect
                        title={t('typeId')}
                        name="typeId"
                        placeholder={t('typeId')}
                        options={elementTypeRef.current}
                        value={elementTypeRef.current.findSingle(
                          'value',
                          form.getValues().typeId
                        )}
                        required
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ComponentFormInput
                        title={`${t('rank')}*`}
                        name="rank"
                        type="number"
                        required
                      />
                    </div>
                    <div className="col-md-12 mt-3"></div>
                  </div>
                  <div className="col-md-12 mt-4 text-end submit">
                    <div className="row">
                      <div className="col-md-6 text-start">
                        {form.formState.isSubmitting ? (
                          <ComponentFormLoadingButton text={t('loading')} />
                        ) : (
                          <button
                            type={'submit'}
                            className="btn btn-gradient-success align-start"
                          >
                            {t('okay')}
                          </button>
                        )}
                      </div>
                      <div className="col-md-6 text-end">
                        <button
                          type="button"
                          className="btn btn-gradient-dark btn-lg"
                          onClick={() => props.onHide()}
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  </div>
                </ComponentForm>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);

export default ComponentPageComponentAddElementEditModal;
