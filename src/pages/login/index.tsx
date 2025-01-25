import React, { useReducer, useState } from 'react';
import { AuthService } from '@services/auth.service';
import { IUserGetResultService } from 'types/services/user.service';
import Image from 'next/image';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { useRouter } from 'next/router';
import ComponentForm from '@components/elements/form';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, IAuthPostSchema } from 'schemas/auth.schema';
import ComponentPageLoginForm from '@components/pages/login/form';
import { IAuthLoginParamService } from 'types/services/auth.service';
import { IActionWithPayload } from 'types/hooks';

export type IPageLoginState = {
  isWrong: boolean;
  user?: IUserGetResultService;
};

const initialState: IPageLoginState = {
  isWrong: false,
};

enum AcitonTypes {
  SET_IS_WRONG,
  SET_USER,
}

type IAction =
  | IActionWithPayload<AcitonTypes.SET_IS_WRONG, IPageLoginState['isWrong']>
  | IActionWithPayload<AcitonTypes.SET_USER, IPageLoginState['user']>;

const reducer = (state: IPageLoginState, action: IAction): IPageLoginState => {
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

export type IPageFormState = {
  keepMe: boolean;
} & IAuthLoginParamService;

const initialFormState: IPageFormState = {
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
  const form = useForm<IPageFormState>({
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

  const onSubmit = async (data: IPageFormState) => {
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

  const formValues = form.getValues();

  return isPageLoading ? null : (
    <div className="page-login">
      <div className="d-flex align-items-stretch auth-img-bg h-100">
        <div className="row flex-grow">
          <div className="col-lg-6 d-flex align-items-center justify-content-center login-half-form">
            <div className="auth-form-transparent text-left p-3">
              <h4 className="text-center">{t('loginPanel')}</h4>
              <ComponentForm
                formMethods={form}
                enterToSubmit={true}
                submitButtonClassName="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn w-100"
                i18={{
                  submitButtonText: t('login'),
                  submitButtonSubmittingText: t('loading'),
                }}
                onSubmit={(data) => onSubmit(data)}
              >
                <ComponentPageLoginForm
                  isWrong={state.isWrong}
                  user={state.user}
                />
              </ComponentForm>
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
