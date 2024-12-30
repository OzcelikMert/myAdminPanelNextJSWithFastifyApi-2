import React, { useEffect, useReducer } from 'react';
import ThemeInputType from '@components/elements/form/input/type';
import { AuthService } from '@services/auth.service';
import { IUserGetResultService } from 'types/services/user.service';
import Image from 'next/image';
import { EndPoints } from '@constants/endPoints';
import { StatusId } from '@constants/status';
import { RouteUtil } from '@utils/route.util';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { useFormReducer } from '@library/react/handles/form';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { setSessionAuthState } from '@lib/features/sessionSlice';
import { useRouter } from 'next/router';
import ComponentForm from '@components/elements/form';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';

type IComponentState = {
  isSubmitting: boolean;
  isWrong: boolean;
  user?: IUserGetResultService;
};

const initialState: IComponentState = {
  isSubmitting: false,
  isWrong: false,
};

type IAction =
  | { type: 'SET_IS_SUBMITTING'; payload: IComponentState["isSubmitting"] }
  | { type: 'SET_IS_WRONG'; payload: IComponentState["isWrong"] }
  | { type: 'SET_USER'; payload: IComponentState["user"] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_IS_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'SET_IS_WRONG':
      return {
        ...state,
        isWrong: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

type IComponentFormState = {
  email: string;
  password: string;
  keepMe: boolean;
};

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
  const { formState, onChangeInput } = useFormReducer<IComponentFormState>({
    ...initialFormState,
    email: LocalStorageUtil.getKeepMeEmail(),
    keepMe: LocalStorageUtil.getKeepMeEmail().length > 0,
  });

  useEffect(() => {
    init();

    return () => {
      abortController.abort();
    };
  }, []);

  const init = async () => {
    setPageTitle();
    appDispatch(setIsPageLoadingState(false));
  };

  const setPageTitle = () => {
    appDispatch(setBreadCrumbState([{ title: t('login') }]));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: 'SET_IS_WRONG', payload: false });
    dispatch({ type: 'SET_IS_SUBMITTING', payload: true });

    const serviceResult = await AuthService.login(
      formState,
      abortController.signal
    );

    if (serviceResult.data) {
      if (serviceResult.status) {
        const resultSession = await AuthService.getSession(
          abortController.signal
        );

        if (resultSession.status && resultSession.data) {
          appDispatch(setSessionAuthState(resultSession.data));
          if (formState.keepMe) {
            LocalStorageUtil.setKeepMeEmail(formState.email);
          } else if (LocalStorageUtil.getKeepMeEmail().length > 0) {
            LocalStorageUtil.setKeepMeEmail('');
          }
          RouteUtil.change({ appDispatch, router, path: EndPoints.DASHBOARD });
        }
      } else {
        if (serviceResult.data._id) {
          dispatch({ type: 'SET_USER', payload: serviceResult.data });
        } else {
          dispatch({ type: 'SET_IS_WRONG', payload: true });
        }
      }
    } else {
      dispatch({ type: 'SET_IS_WRONG', payload: true });
    }
    dispatch({ type: 'SET_IS_SUBMITTING', payload: false });
  };

  const LoginForm = () => {
    return (
      <ComponentForm
        isSubmitting={state.isSubmitting}
        formAttributes={{ onSubmit: (event) => onSubmit(event) }}
        enterToSubmit={true}
      >
        <div className="row">
          <div className="col-md-12 mb-3">
            <ThemeInputType
              title={t('email')}
              type="email"
              name="email"
              required={true}
              value={formState.email}
              onChange={(e) => onChangeInput(e)}
            />
          </div>
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
          <div className="col-md-12 mb-3">
            <ComponentFormCheckBox
              name="keepMe"
              title={t('keepMe')}
              checked={formState.keepMe}
              onChange={(e) => onChangeInput(e)}
            />
          </div>
          <div className="col-md-12">
            {state.isWrong ? (
              <p className="fw-bold text-danger">{t('wrongEmailOrPassword')}</p>
            ) : null}
            {state.user?.statusId == StatusId.Banned ? (
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
            ) : null}
            {state.user?.statusId == StatusId.Pending ? (
              <div>
                <p className="fw-bold text-danger">
                  {t('yourAccountIsPending')}
                </p>
              </div>
            ) : null}
            {state.user?.statusId == StatusId.Disabled ? (
              <div>
                <p className="fw-bold text-danger">
                  {t('yourAccountIsDisabled')}
                </p>
              </div>
            ) : null}
          </div>
          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn w-100"
              disabled={state.isSubmitting}
            >
              {t('login')}
            </button>
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
