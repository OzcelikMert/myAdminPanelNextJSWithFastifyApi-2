import { FormEvent, useState } from 'react';
import { UserService } from '@services/user.service';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentForm from '@components/elements/form';
import ComponentFormInput from '@components/elements/form/input/input';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'schemas/user.schema';
import { useToast } from '@hooks/toast';

type IPageFormState = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const initialFormState: IPageFormState = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

export default function PageChangePassword() {
  const abortController = new AbortController();

  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const form = useForm<IPageFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(UserSchema.putPassword),
  });
  const { showToast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useDidMount(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    setPageTitle();
    setIsPageLoaded(true);
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
    const params = form.getValues();
    if (params.newPassword !== params.confirmPassword) {
      showToast({
        type: 'error',
        title: t('error'),
        content: t('passwordsNotEqual'),
      });
      return;
    }
    const serviceResult = await UserService.updatePassword(
      params,
      abortController.signal
    );
    if (serviceResult.status) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('passwordUpdated'),
      });
    } else {
      showToast({
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
            formMethods={form}
            i18={{
              submitButtonText: t('save'),
              submitButtonSubmittingText: t('loading'),
            }}
            onSubmit={(event) => onSubmit(event)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <ComponentFormInput
                        title={`${t('password')}*`}
                        name="password"
                        type="password"
                        required={true}
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormInput
                        title={`${t('newPassword')}*`}
                        name="newPassword"
                        type="password"
                        required={true}
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormInput
                        title={`${t('confirmPassword')}*`}
                        name="confirmPassword"
                        type="password"
                        required={true}
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
