import React from 'react';
import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormInput from '@components/elements/form/input/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/customHooks';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { useForm } from 'react-hook-form';
import ComponentForm from '@components/elements/form';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPageComponentAddState } from '@pages/component/add';

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
  elementTypes: IPageComponentAddState['elementTypes'];
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
                {props.item?.title || t('newElement')}
              </h4>
              <div className="row mt-4">
                <ComponentForm
                  formMethods={form}
                  onSubmit={(data) => onSubmit(data)}
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
                        options={props.elementTypes}
                        value={props.elementTypes.findSingle(
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
