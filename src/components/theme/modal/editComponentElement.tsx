import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormType from '@components/elements/form/input/type';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { useFormReducer } from '@library/react/handles/form';
import React, { Component, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/customHooks';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { useForm } from 'react-hook-form';
import ComponentForm from '@components/elements/form';
import ComponentFormSelect from '@components/elements/form/input/select';

type IComponentState = {
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
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

export default function ComponentThemeModalEditComponentElement(
  props: IComponentProps
) {
  const t = useAppSelector(selectTranslation);
  const form = useForm<IComponentFormState>({ defaultValues: props.item });

  const [isSubmitting, setIsSubmitting] = React.useState(
    initialState.isSubmitting
  );

  const getElementTypes = () => {
    return elementTypes.map((type) => ({
      label: t(type.langKey),
      value: type.id,
    }));
  };

  useEffectAfterDidMount(() => {
    if (props.isShow) {
      form.reset(props.item);
    }
  }, [props.isShow, props.item]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const submitResult = await props.onSubmit(form.getValues());
    setIsSubmitting(false);
    if (submitResult) {
      props.onHide();
    }
  };

  const _elementTypes = getElementTypes();

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
              {t('component')} - {t('edit')} - {props.item?.title}
            </h4>
            <div className="row mt-4">
              <ComponentForm hideSubmitButton formMethods={form}>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <ComponentFormType
                      title={`${t('title')}*`}
                      name="title"
                      placeholder={t('title')}
                      type="text"
                      required
                    />
                  </div>
                  <div className="col-md-12 mt-3">
                    <ComponentFormType
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
                      options={_elementTypes}
                      value={_elementTypes.filter(
                        (item) => item.value == form.getValues().typeId
                      )}
                    />
                  </div>
                  <div className="col-md-12 mt-3">
                    <ComponentFormType
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
                      {isSubmitting ? (
                        <ComponentFormLoadingButton text={t('loading')} />
                      ) : (
                        <button
                          type={'button'}
                          className="btn btn-gradient-success align-start"
                          onClick={() => onSubmit()}
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
