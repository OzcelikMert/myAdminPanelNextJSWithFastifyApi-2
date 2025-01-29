import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentForm from '@components/elements/form';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { IPageProfileFormState } from '@pages/settings/profile';
import { UseFormReturn } from 'react-hook-form';

type IComponentProps = {
  form: UseFormReturn<IPageProfileFormState>
  onSubmit: (data: IPageProfileFormState) => void;
};

const ComponentPageProfileForm = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <ComponentForm
                formMethods={props.form}
                i18={
                  {
                    submitButtonText: t('save'),
                    submitButtonSubmittingText: t('loading'),
                  }
                }
                onSubmit={(event) => props.onSubmit(event)}
              >
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={`${t('name')}*`}
                      name="name"
                      type="text"
                      required={true}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={t('comment')}
                      name="comment"
                      type="textarea"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={`${t('phone')}`}
                      name="phone"
                      type="text"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Facebook"
                      name="facebook"
                      type="url"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Instagram"
                      name="instagram"
                      type="url"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Twitter"
                      name="twitter"
                      type="url"
                    />
                  </div>
                </div>
              </ComponentForm>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
);

export default ComponentPageProfileForm;
