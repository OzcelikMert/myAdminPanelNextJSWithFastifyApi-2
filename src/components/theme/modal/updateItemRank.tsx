import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormInput from '@components/elements/form/input/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { useFormReducer } from '@library/react/handles/form';
import React, { Component, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/customHooks';

type IComponentState = {
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
};

type IComponentFormState = {
  newRank: number;
};

const initialFormState: IComponentFormState = {
  newRank: 0,
};

type IComponentProps = {
  isShow: boolean;
  rank?: number;
  title?: string;
  onHide: () => void;
  onSubmit: (rank: number) => Promise<boolean | void>;
};

export default function ComponentThemeModalUpdateItemRank(
  props: IComponentProps
) {
  const t = useAppSelector(selectTranslation);

  const [isSubmitting, setIsSubmitting] = React.useState(
    initialState.isSubmitting
  );
  const { formState, setFormState, onChangeInput } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      newRank: props.rank ?? 0,
    });

  useEffectAfterDidMount(() => {
    if (props.isShow) {
      setFormState({
        newRank: props.rank ?? 0,
      });
    }
  }, [props.isShow]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const submitResult = await props.onSubmit(formState.newRank);
    setIsSubmitting(false);
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
              {t('rank')} {props.title ? `(${props.title})` : ''}
            </h4>
            <div className="row mt-4">
              <div className="col-md-12">
                <ComponentFormInput
                  title={`${t('rank')}`}
                  name="newRank"
                  type="number"
                  required={true}
                  value={formState.newRank}
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
                    onClick={() => onSubmit()}
                  >
                    {t('update')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
