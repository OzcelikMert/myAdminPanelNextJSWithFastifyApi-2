import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import ComponentThemeForm from '@components/theme/form';
import { ISettingSocialMediaModel } from 'types/models/setting.model';

type IComponentFormState = {} & ISettingSocialMediaModel;

const initialFormState: IComponentFormState = {
  _id: '',
  title: '',
  key: '',
  url: '',
};

type IComponentProps = {
  isShow: boolean;
  item?: ISettingSocialMediaModel;
  onHide: () => void;
  onSubmit: (newItem: ISettingSocialMediaModel) => Promise<boolean | void>;
};

const ComponentPageSettingsSocialMediaEditModal = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useForm<IComponentFormState>({
      defaultValues: props.item || initialFormState,
    });

    useEffectAfterDidMount(() => {
      if (props.isShow) {
        form.reset(props.item || initialFormState);
      }
    }, [props.isShow, props.item]);

    const onSubmit = async (data: IComponentFormState) => {
      const submitResult = await props.onSubmit(data);

      if (
        (typeof submitResult === 'boolean' && submitResult) ||
        typeof submitResult !== 'boolean'
      ) {
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
                {props.item?.title || t('newSocialMedia')}
              </h4>
              <div className="row mt-4">
                <ComponentThemeForm
                  formMethods={form}
                  onSubmit={(data) => onSubmit(data)}
                >
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <ComponentThemeFormInput
                        title={`${t('title')}*`}
                        name="title"
                        placeholder={t('title')}
                        type="text"
                        required
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ComponentThemeFormInput
                        title={`${t('key')}*`}
                        name="key"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </ComponentThemeForm>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);

export default ComponentPageSettingsSocialMediaEditModal;
