import React, { useReducer, useState } from 'react';
import { UserService } from '@services/user.service';
import {
  IUserGetResultService,
  IUserUpdateProfileParamService,
} from 'types/services/user.service';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'schemas/user.schema';
import ComponentPageProfileForm from '@components/pages/settings/profile/form';
import ComponentPageProfileImage from '@components/pages/settings/profile/image';
import ComponentPageProfileMainInfo from '@components/pages/settings/profile/mainInfo';
import ComponentPageProfilePermissions from '@components/pages/settings/profile/permissions';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

export type IPageProfileState = {
  isImageChanging: boolean;
  item?: IUserGetResultService;
  profileImage: string;
};

const initialState: IPageProfileState = {
  isImageChanging: false,
  profileImage: '',
};

enum ActionTypes {
  SET_IS_IMAGE_CHANGING,
  SET_ITEM,
  SET_PROFILE_IMAGE,
}

type IAction =
  | IActionWithPayload<
      ActionTypes.SET_IS_IMAGE_CHANGING,
      IPageProfileState['isImageChanging']
    >
  | IActionWithPayload<ActionTypes.SET_ITEM, IPageProfileState['item']>
  | IActionWithPayload<
      ActionTypes.SET_PROFILE_IMAGE,
      IPageProfileState['profileImage']
    >;

const reducer = (
  state: IPageProfileState,
  action: IAction
): IPageProfileState => {
  switch (action.type) {
    case ActionTypes.SET_IS_IMAGE_CHANGING:
      return {
        ...state,
        isImageChanging: action.payload,
      };
    case ActionTypes.SET_ITEM:
      return {
        ...state,
        item: action.payload,
      };
    case ActionTypes.SET_PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.payload,
      };
    default:
      return state;
  }
};

export type IPageProfileFormState = IUserUpdateProfileParamService;

const initialFormState: IPageProfileFormState = {
  name: '',
  comment: '',
  phone: '',
  facebook: '',
  instagram: '',
  twitter: '',
};

export default function PageSettingsProfile() {
  const abortControllerRef = React.useRef(new AbortController());

  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    profileImage: sessionAuth?.user.image ?? initialState.profileImage,
  });
  const form = useForm<IPageProfileFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(UserSchema.putProfile),
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
    await getUser();
    setPageTitle();
    setIsPageLoaded(true);
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('profile'),
        },
      ])
    );
  };

  const getUser = async () => {
    const serviceResult = await UserService.getWithId(
      { _id: sessionAuth!.user.userId },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const user = serviceResult.data;
      dispatch({ type: ActionTypes.SET_ITEM, payload: user });
      form.reset({
        name: user.name,
        comment: user.comment,
        phone: user.phone,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
      });
    }
  };

  const onChangeImage = async (image: string) => {
    dispatch({ type: ActionTypes.SET_IS_IMAGE_CHANGING, payload: true });

    const serviceResult = await UserService.updateProfileImage(
      { image: image },
      abortControllerRef.current.signal
    );

    if (serviceResult.status) {
      dispatch({ type: ActionTypes.SET_PROFILE_IMAGE, payload: image });
      appDispatch(
        setSessionAuthState({
          ...sessionAuth,
          user: {
            ...sessionAuth!.user,
            image: image,
          },
        })
      );
    }

    dispatch({ type: ActionTypes.SET_IS_IMAGE_CHANGING, payload: false });
  };

  const onSubmit = async (data: IPageProfileFormState) => {
    const params = data;
    const serviceResult = await UserService.updateProfile(
      params,
      abortControllerRef.current.signal
    );
    if (serviceResult.status) {
      appDispatch(
        setSessionAuthState({
          ...sessionAuth,
          user: {
            ...sessionAuth!.user,
            name: params.name,
          },
        })
      );
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('profileUpdated'),
      });
    }
  };

  return isPageLoading ? null : (
    <div className="page-settings page-profile">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <ComponentPageProfileImage
                isLoading={state.isImageChanging}
                image={state.profileImage}
                onChange={(image) => onChangeImage(image)}
              />
            </div>
            <div className="col-md-8">
              <ComponentPageProfileMainInfo item={state.item} />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <ComponentPageProfileForm
            form={form}
            onSubmit={(data) => onSubmit(data)}
          />
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <ComponentPageProfilePermissions
                permissionId={state.item?.permissions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
