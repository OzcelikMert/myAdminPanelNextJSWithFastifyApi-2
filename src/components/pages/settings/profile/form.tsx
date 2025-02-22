import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeForm from '@components/theme/form';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { IPageProfileFormState } from '@pages/settings/profile';
import { UseFormReturn } from 'react-hook-form';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  form: UseFormReturn<IPageProfileFormState>;
  onSubmit: (data: IPageProfileFormState) => void;
};

const ComponentPageProfileForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <ComponentThemeForm
                formMethods={props.form}
                onSubmit={(event) => props.onSubmit(event)}
              >
                <div className="row">
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title={`${t('name')}*`}
                      name="name"
                      type="text"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title={`${t('email')}*`}
                      name="email"
                      type="email"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title={t('comment')}
                      name="comment"
                      type="textarea"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title={`${t('phone')}`}
                      name="phone"
                      type="text"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title="Facebook"
                      name="facebook"
                      type="url"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title="Instagram"
                      name="instagram"
                      type="url"
                    />
                  </div>
                  <div className="col-md-12">
                    <ComponentThemeFormInput
                      title="Twitter"
                      name="twitter"
                      type="url"
                    />
                  </div>
                </div>
              </ComponentThemeForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageProfileForm;
