import React, { useEffect, useReducer, useState } from 'react';
import ThemeInputType from '@components/elements/form/input/type';
import { AuthService } from '@services/auth.service';
import { IUserGetResultService } from 'types/services/user.service';
import Image from 'next/image';
import { EndPoints } from '@constants/endPoints';
import { StatusId } from '@constants/status';
import { RouteUtil } from '@utils/route.util';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { useFormReducer } from '@library/react/handles/form';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { useRouter } from 'next/router';
import ComponentForm from '@components/elements/form';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, IAuthPostSchema } from 'schemas/auth.schema';

type IComponentState = {
  isWrong: boolean;
  user?: IUserGetResultService;
};

const initialState: IComponentState = {
  isWrong: false,
};

enum AcitonTypes {
  SET_IS_WRONG,
  SET_USER,
}

type IAction =
  | { type: AcitonTypes.SET_IS_WRONG; payload: IComponentState['isWrong'] }
  | { type: AcitonTypes.SET_USER; payload: IComponentState['user'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case AcitonTypes.SET_IS_WRONG:
      return {
        ...state,
        isWrong: action.payload,
      };
    case AcitonTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

type IComponentFormState = {} & IAuthPostSchema;

const initialFormState: IComponentFormState = {
  email: '',
  password: '',
  keepMe: false,
};

export default function PageLogin() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IComponentFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(AuthSchema.post),
  });
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
    appDispatch(setBreadCrumbState([{ title: t('login') }]));
  };

  const onSubmit = async (data: IComponentFormState) => {
    dispatch({ type: AcitonTypes.SET_IS_WRONG, payload: false });

    const serviceResult = await AuthService.login(data, abortController.signal);

    if (serviceResult.data) {
      if (serviceResult.status) {
        const resultSession = await AuthService.getSession(
          abortController.signal
        );

        if (resultSession.status && resultSession.data) {
          appDispatch(setSessionAuthState(resultSession.data));
          if (data.keepMe) {
            LocalStorageUtil.setKeepMeEmail(data.email);
          } else if (LocalStorageUtil.getKeepMeEmail().length > 0) {
            LocalStorageUtil.setKeepMeEmail('');
          }
          RouteUtil.change({ router, path: EndPoints.DASHBOARD });
        }
      } else {
        if (serviceResult.data._id) {
          dispatch({ type: AcitonTypes.SET_USER, payload: serviceResult.data });
        } else {
          dispatch({ type: AcitonTypes.SET_IS_WRONG, payload: true });
        }
      }
    } else {
      dispatch({ type: AcitonTypes.SET_IS_WRONG, payload: true });
    }
  };

  const LoginForm = () => {
    return (
      <ComponentForm
        enterToSubmit={true}
        submitButtonClassName="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn w-100"
        submitButtonText={t('login')}
        onSubmit={onSubmit}
        formMethods={form}
      >
        <div className="row">
          <div className="col-md-12 mb-3">
            <ThemeInputType title={t('email')} type="email" name="email" />
          </div>
          <div className="col-md-12 mb-3">
            <ThemeInputType
              title={t('password')}
              type="password"
              name="password"
            />
          </div>
          <div className="col-md-12 mb-3">
            <ComponentFormCheckBox title={t('keepMe')} name="keepMe" />
          </div>
          <div className="col-md-12">
            {state.isWrong ? (
              <p className="fw-bold text-danger">{t('wrongEmailOrPassword')}</p>
            ) : null}
            {state.user?.statusId == StatusId.Banned && (
              <div>
                <p className="fw-bold text-danger">
                  {t('yourAccountIsBanned')}
                </p>
                <p className="fw-bold text-danger">
                  {t('banDateEnd')}:
                  <span className="text-muted ms-1">
                    {new Date(
                      state.user?.banDateEnd || ''
                    ).toLocaleDateString()}
                  </span>
                </p>
                <p className="fw-bold text-danger">
                  {t('banComment')}:
                  <span className="text-muted ms-1">
                    {state.user?.banComment}
                  </span>
                </p>
              </div>
            )}
            {state.user?.statusId == StatusId.Pending && (
              <div>
                <p className="fw-bold text-danger">
                  {t('yourAccountIsPending')}
                </p>
              </div>
            )}
            {state.user?.statusId == StatusId.Disabled && (
              <div>
                <p className="fw-bold text-danger">
                  {t('yourAccountIsDisabled')}
                </p>
              </div>
            )}
          </div>
        </div>
      </ComponentForm>
    );
  };

  return isPageLoading ? null : (
    <div className="page-login">
      <div className="d-flex align-items-stretch auth-img-bg h-100">
        <div className="row flex-grow">
          <div className="col-lg-6 d-flex align-items-center justify-content-center login-half-form">
            <div className="auth-form-transparent text-left p-3">
              <h4 className="text-center">{t('loginPanel')}</h4>
              <LoginForm />
            </div>
          </div>
          <div className="col-lg-6 login-half-bg d-flex flex-row">
            <div className="brand-logo">
              <Image
                src="/images/ozcelikLogo.png"
                alt="Özçelik Software"
                width={150}
                height={100}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
