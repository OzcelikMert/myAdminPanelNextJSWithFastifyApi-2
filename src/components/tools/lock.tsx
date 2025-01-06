import React, { useEffect } from 'react';
import { AuthService } from '@services/auth.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import ComponentForm from '@components/elements/form';
import ThemeInputType from '@components/elements/form/input/type';
import { useFormReducer } from '@library/react/handles/form';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { setSessionAuthState } from '@lib/features/sessionSlice';
import { setIsLockState } from '@lib/features/appSlice';
import { selectTranslation } from '@lib/features/translationSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  isSubmitting: boolean;
  isWrong: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
  isWrong: false,
};

type IComponentFormState = {
  password: string;
};

const initialFormState: IComponentFormState = {
  password: '',
};

export default function ComponentToolLock() {
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  const [isSubmitting, setIsSubmitting] = React.useState(
    initialState.isSubmitting
  );
  const [isWrong, setIsWrong] = React.useState(initialState.isWrong);
  const { formState, onChangeInput, setFormState } =
    useFormReducer<IComponentFormState>(initialFormState);

  useDidMountHook(() => {
    return () => {
      abortController.abort();
    };
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);

    const serviceResult = await AuthService.login(
      {
        password: formState.password,
        email: sessionAuth?.user.email ?? '',
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      const resultSession = await AuthService.getSession(
        abortController.signal
      );
      if (resultSession.status && resultSession.data) {
        setIsSubmitting(false);
        setIsWrong(false);
        setFormState(initialFormState);
        appDispatch(setSessionAuthState(resultSession.data));
        appDispatch(setIsLockState(false));
        return;
      }
    }

    setIsSubmitting(false);
    setIsWrong(true);
  };

  const Form = () => (
    <ComponentForm
      hideSubmitButton={true}
      onSubmit={(event) => onSubmit(event)}
    >
      <div className="row">
        <div className="col-md-12 mb-3">
          <ThemeInputType
            title={t('password')}
            type="password"
            name="password"
            required={true}
            value={formState.password}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-12">
          {isSubmitting ? (
            <button
              className="btn btn-outline-light btn-lg font-weight-medium auth-form-btn w-100"
              disabled={true}
              type={'button'}
            >
              <i className="fa fa-spinner fa-spin me-1"></i>
              {t('loading') + '...'}
            </button>
          ) : (
            <button
              type="submit"
              className={`btn btn-outline-${isWrong ? 'danger' : 'info'} btn-lg font-weight-medium auth-form-btn w-100`}
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </ComponentForm>
  );

  return (
    <div className="component-tool-lock">
      <div className="content-wrapper d-flex align-items-center lock-full-bg h-100">
        <div className="row w-100 align-items-center">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form text-left p-5 text-center">
              <Image
                className="lock-profile-img img-fluid"
                src={ImageSourceUtil.getUploadedImageSrc(
                  sessionAuth?.user.image
                )}
                alt={sessionAuth?.user.name ?? ''}
                width={75}
                height={75}
              />
              <h4 className="text-center text-light mb-3 mt-3">
                {sessionAuth?.user.name}
              </h4>
              <Form />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
