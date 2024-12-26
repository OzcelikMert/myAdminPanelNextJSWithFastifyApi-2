import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormType from '@components/elements/form/input/type';
import { selectTranslation } from '@lib/features/translationSlice';
import { useAppSelector } from '@lib/hooks';
import { useFormReducer } from '@library/react/handles/form';
import React, { Component, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

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
  onSubmit: (rank: number) => Promise<boolean | undefined>;
};

export default function ComponentThemeModalUpdateItemRank(
  props: IComponentProps
) {
  const [isSubmitting, setIsSubmitting] = React.useState(
    initialState.isSubmitting
  );
  const { formState, setFormState, onChangeInput } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      newRank: props.rank ?? 0,
    });

  const t = useAppSelector(selectTranslation);

  useEffect(() => {
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
                <ComponentFormType
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
