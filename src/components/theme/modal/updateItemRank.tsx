import ComponentFormLoadingButton from '@components/elements/form/button/loadingButton';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ComponentForm from '@components/elements/form';

type IComponentState = {
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
};

type IComponentFormState = {
  rank: number;
};

const initialFormState: IComponentFormState = {
  rank: 0,
};

type IComponentProps = {
  isShow: boolean;
  rank?: number;
  title?: string;
  onHide: () => void;
  onSubmit: (rank: number) => Promise<boolean | void>;
};

const ComponentThemeModalUpdateItemRank = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [isSubmitting, setIsSubmitting] = React.useState(
      initialState.isSubmitting
    );
    const form = useForm<IComponentFormState>({
      defaultValues: {
        ...initialFormState,
        rank: props.rank ?? initialFormState.rank,
      },
    });

    useEffectAfterDidMount(() => {
      if (props.isShow) {
        form.reset({
          rank: props.rank ?? initialFormState.rank,
        });
      }
    }, [props.isShow]);

    const onSubmit = async (data: IComponentFormState) => {
      const params = data;
      const submitResult = await props.onSubmit(params.rank);
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
                <ComponentForm
                  formMethods={form}
                  submitButtonExtraClassName='mt-4'
                  i18={
                    {
                      submitButtonText: t('update'),
                      submitButtonSubmittingText: t('loading'),
                    }
                  }
                  onSubmit={(data) => onSubmit(data)}
                >
                  <div className="col-md-12">
                    <ComponentFormInput
                      title={`${t('rank')}`}
                      name="rank"
                      type="number"
                      required={true}
                    />
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

export default ComponentThemeModalUpdateItemRank;
