import React, { FormEvent, useState } from 'react';
import { UserService } from '@services/user.service';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentThemeForm from '@components/theme/form';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'schemas/user.schema';
import { useToast } from '@hooks/toast';
import { I18Util } from '@utils/i18.util';

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
  const abortControllerRef = React.useRef(new AbortController());

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
      abortControllerRef.current.abort();
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

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
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
      abortControllerRef.current.signal
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
          <ComponentThemeForm
            formMethods={form}
            onSubmit={(data) => onSubmit(data)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <ComponentThemeFormInput
                        title={`${t('password')}*`}
                        name="password"
                        type="password"
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentThemeFormInput
                        title={`${t('newPassword')}*`}
                        name="newPassword"
                        type="password"
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentThemeFormInput
                        title={`${t('confirmPassword')}*`}
                        name="confirmPassword"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentThemeForm>
        </div>
      </div>
    </div>
  );
}
