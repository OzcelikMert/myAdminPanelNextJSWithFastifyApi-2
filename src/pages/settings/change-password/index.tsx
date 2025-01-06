import { FormEvent, useEffect, useState } from 'react';
import ComponentToast from '@components/elements/toast';
import { UserService } from '@services/user.service';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentForm from '@components/elements/form';
import ComponentFormType from '@components/elements/form/input/type';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentFormState = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const initialFormState: IComponentFormState = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

export default function PageChangePassword() {
  const abortController = new AbortController();

  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const { formState, setFormState, onChangeInput } =
    useFormReducer<IComponentFormState>(initialFormState);

    useDidMountHook(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  const init = async () => {
    setPageTitle();
    appDispatch(setIsPageLoadingState(true));
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('settings'),
          url: EndPoints.SETTINGS_WITH.GENERAL,
        },
        {
          title: t('changePassword'),
        },
      ])
    );
  };

  const onSubmit = async (event: FormEvent) => {
    if (formState.newPassword !== formState.confirmPassword) {
      new ComponentToast({
        type: 'error',
        title: t('error'),
        content: t('passwordsNotEqual'),
      });
      return;
    }

    let params = formState;
    const serviceResult = await UserService.updatePassword(
      params,
      abortController.signal
    );
    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('passwordUpdated'),
      });
    } else {
      new ComponentToast({
        type: 'error',
        title: t('error'),
        content: t('wrongPassword'),
      });
    }
  };

  return isPageLoading ? null : (
    <div className="page-settings">
      <div className="row">
        <div className="col-md-12">
          <ComponentForm
            submitButtonText={t('save')}
            submitButtonSubmittingText={t('loading')}
            onSubmit={(event) => onSubmit(event)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <ComponentFormType
                        title={`${t('password')}*`}
                        name="password"
                        type="password"
                        autoComplete={'new-password'}
                        required={true}
                        value={formState.password}
                        onChange={(e) => onChangeInput(e)}
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormType
                        title={`${t('newPassword')}*`}
                        name="newPassword"
                        type="password"
                        autoComplete={'new-password'}
                        required={true}
                        value={formState.newPassword}
                        onChange={(e) => onChangeInput(e)}
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormType
                        title={`${t('confirmPassword')}*`}
                        name="confirmPassword"
                        type="password"
                        autoComplete={'new-password'}
                        required={true}
                        value={formState.confirmPassword}
                        onChange={(e) => onChangeInput(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
