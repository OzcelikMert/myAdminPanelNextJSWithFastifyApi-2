import { FormEvent, useReducer, useState } from 'react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { UserService } from '@services/user.service';
import ComponentToast from '@components/elements/toast';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeBadgeUserRole from '@components/theme/badge/userRole';
import {
  IUserGetResultService,
  IUserUpdateProfileImageParamService,
  IUserUpdateProfileParamService,
} from 'types/services/user.service';
import { permissions } from '@constants/permissions';
import { permissionGroups } from '@constants/permissionGroups';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import { IPermission } from 'types/constants/permissions';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentForm from '@components/elements/form';
import ComponentFormInput from '@components/elements/form/input/input';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  isImageChanging: boolean;
  item?: IUserGetResultService;
};

const initialState: IComponentState = {
  isImageChanging: false,
};

enum ActionTypes {
  SET_IS_IMAGE_CHANGING,
  SET_ITEM,
}

type IAction =
  | {
      type: ActionTypes.SET_IS_IMAGE_CHANGING;
      payload: IComponentState['isImageChanging'];
    }
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
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
    default:
      return state;
  }
};

type IComponentFormProps = IUserUpdateProfileParamService &
  IUserUpdateProfileImageParamService;

const initialFormState: IComponentFormProps = {
  image: '',
  name: '',
  comment: '',
  phone: '',
  facebook: '',
  instagram: '',
  twitter: '',
};

export default function PageSettingsProfile() {
  const abortController = new AbortController();

  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput } =
    useFormReducer(initialFormState);
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
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const user = serviceResult.data;
      dispatch({ type: ActionTypes.SET_ITEM, payload: user });
      setFormState({
        image: user.image,
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
      abortController.signal
    );

    if (serviceResult.status) {
      setFormState({
        image: image,
      });
      appDispatch(
        setSessionAuthState({
          ...sessionAuth,
          user: {
            ...sessionAuth!.user,
            image: image,
          },
        })
      );

      dispatch({ type: ActionTypes.SET_IS_IMAGE_CHANGING, payload: false });
    }
  };

  const onSubmit = async (event: FormEvent) => {
    let params = formState;
    const serviceResult = await UserService.updateProfile(
      params,
      abortController.signal
    );
    if (serviceResult.status) {
      appDispatch(
        setSessionAuthState({
          ...sessionAuth,
          user: {
            ...sessionAuth!.user,
            ...params,
          },
        })
      );
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('profileUpdated'),
      });
    }
  };

  const ProfileInformation = () => (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h6 className="pb-1 border-bottom fw-bold text-start">
            {t('general')}
          </h6>
          <div className="row">
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('email')}:
                <h6 className="d-inline-block ms-2">{state.item?.email}</h6>
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('role')}:
                <ComponentThemeBadgeUserRole
                  userRoleId={state.item!.roleId}
                  className="ms-2"
                />
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('status')}:
                <ComponentThemeBadgeStatus
                  statusId={state.item!.statusId}
                  className="ms-2"
                />
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('createdDate')}:
                <h6 className="d-inline-block ms-2">
                  {new Date(state.item?.createdAt || '').toLocaleString()}
                </h6>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Permissions = () => {
    const foundPermissions = permissions.findMulti(
      'id',
      state.item!.permissions
    );
    let foundPermissionGroups = permissionGroups.findMulti(
      'id',
      foundPermissions.map((permission) => permission.groupId)
    );
    foundPermissionGroups = foundPermissionGroups.filter(
      (group, index) =>
        foundPermissionGroups.indexOfKey('id', group.id) === index
    );

    const PermissionGroup = (props: IPermissionGroup) => (
      <div className="col-md-12 mt-3">
        <ComponentFieldSet legend={t(props.langKey)}>
          <div className="permission-items">
            {foundPermissions
              .findMulti('groupId', props.id)
              .map((permission) => (
                <PermissionItem {...permission} />
              ))}
          </div>
        </ComponentFieldSet>
      </div>
    );

    const PermissionItem = (props: IPermission) => (
      <label className="badge badge-outline-info ms-1 mb-1">
        {t(props.langKey)}
      </label>
    );

    return (
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h6 className="pb-1 border-bottom fw-bold text-start">
              {t('permissions')}
            </h6>
            <div className="row">
              {foundPermissionGroups.orderBy('rank', 'asc').map((group) => (
                <PermissionGroup {...group} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Image = () => (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            {state.isImageChanging ? (
              <ComponentSpinnerDonut customClass="profile-image-spinner" />
            ) : (
              <ComponentThemeChooseImage
                onSelected={(images) => onChangeImage(images[0])}
                isMulti={false}
                isShowReviewImage={true}
                reviewImage={formState.image}
                reviewImageClassName={'post-image'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = () => (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <ComponentForm
                submitButtonText={t('save')}
                submitButtonSubmittingText={t('loading')}
                onSubmit={(event) => onSubmit(event)}
              >
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={`${t('name')}*`}
                      name="name"
                      type="text"
                      required={true}
                      value={formState.name}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={t('comment')}
                      name="comment"
                      type="textarea"
                      value={formState.comment}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title={`${t('phone')}`}
                      name="phone"
                      type="text"
                      value={formState.phone}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Facebook"
                      name="facebook"
                      type="url"
                      value={formState.facebook}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Instagram"
                      name="instagram"
                      type="url"
                      value={formState.instagram}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <ComponentFormInput
                      title="Twitter"
                      name="twitter"
                      type="url"
                      value={formState.twitter}
                      onChange={(e) => onChangeInput(e)}
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

  return isPageLoading ? null : (
    <div className="page-settings page-profile">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <Image />
            </div>
            <div className="col-md-8">
              <ProfileInformation />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <Content />
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <Permissions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
