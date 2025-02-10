import ComponentThemeFormLoadingButton from '@components/theme/form/button/loadingButton';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ComponentThemeForm from '@components/theme/form';
import { I18Util } from '@utils/i18.util';

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
                <ComponentThemeForm
                  formMethods={form}
                  submitButtonExtraClassName="mt-4"
                  i18={{
                    submitButtonText: t('update'),
                  }}
                  onSubmit={(data) => onSubmit(data)}
                >
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title={`${t('rank')}`}
                      name="rank"
                      type="number"
                      required
                    />
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

export default ComponentThemeModalUpdateItemRank;
