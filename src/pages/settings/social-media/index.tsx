import { useReducer, useState } from 'react';
import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import { ISettingUpdateSocialMediaParamService } from 'types/services/setting.service';
import { ISettingSocialMediaModel } from 'types/models/setting.model';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { UserRoleId } from '@constants/userRoles';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { EndPoints } from '@constants/endPoints';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from 'schemas/setting.schema';
import ComponentPageSettingsSocialMediaItem from '@components/pages/settings/social-media/item';
import ComponentPageSettingsSocialMediaEditModal from '@components/pages/settings/social-media/editModal';
import { IActionWithPayload } from 'types/hooks';

type IPageState = {
  items: ISettingSocialMediaModel[];
  isShowModalEdit: boolean;
  selectedItemId: string;
};

const initialState: IPageState = {
  items: [],
  isShowModalEdit: false,
  selectedItemId: '',
};

enum ActionTypes {
  SET_ITEMS,
  SET_IS_SHOW_MODAL_EDIT,
  SET_SELECTED_ITEM_ID,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPageState['items']>
  | IActionWithPayload<
      ActionTypes.SET_IS_SHOW_MODAL_EDIT,
      IPageState['isShowModalEdit']
    >
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEM_ID,
      IPageState['selectedItemId']
    >;

const reducer = (state: IPageState, action: IAction): IPageState => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_IS_SHOW_MODAL_EDIT:
      return { ...state, isShowModalEdit: action.payload };
    case ActionTypes.SET_SELECTED_ITEM_ID:
      return { ...state, selectedItemId: action.payload };
    default:
      return state;
  }
};

type IPageFormState = ISettingUpdateSocialMediaParamService;

const initialFormState: IPageFormState = {
  socialMedia: [],
};

export default function PageSettingsSocialMedia() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IPageFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(SettingSchema.putSocialMedia),
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
    if (
      PermissionUtil.checkAndRedirect({
        router,
        t,
        sessionAuth,
        minPermission: SettingsEndPointPermission.UPDATE_SOCIAL_MEDIA,
      })
    ) {
      setPageTitle();
      await getSettings();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('settings'),
          url: EndPoints.SETTINGS_WITH.GENERAL,
        },
        {
          title: t('socialMedia'),
        },
      ])
    );
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      { projection: SettingProjectionKeys.SocialMedia },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const socialMedia = serviceResult.data.socialMedia || [];
      dispatch({ type: ActionTypes.SET_ITEMS, payload: socialMedia });
      form.setValue('socialMedia', socialMedia);
    }
  };

  const onSubmit = async (data: IPageFormState) => {
    const params = data;

    const serviceResult = await SettingService.updateSocialMedia(
      params,
      abortController.signal
    );
    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }
  };

  const onCreate = () => {
    let _id = String.createId();
    let newSocialMedia = form.getValues().socialMedia;
    newSocialMedia.push({
      _id: String.createId(),
      key: '',
      url: '',
      title: '',
    });
    form.setValue('socialMedia', newSocialMedia);
    onEdit(_id);
  };

  const onAccept = async (newItem: ISettingSocialMediaModel) => {
    let newSocialMedia = form.getValues().socialMedia;
    let index = newSocialMedia.indexOfKey('_id', state.selectedItemId);
    if (index > -1) {
      newSocialMedia[index] = newItem;
      form.setValue('socialMedia', newSocialMedia);
      return true;
    }
    return false;
  };

  const onEdit = (_id: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: _id });
    dispatch({ type: ActionTypes.SET_IS_SHOW_MODAL_EDIT, payload: true });
  };

  const onDelete = async (_id: string) => {
    const newSocialMedia = form.getValues().socialMedia;
    const index = newSocialMedia.indexOfKey('_id', _id);
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: t('deleteItemQuestionWithItemName', [newSocialMedia[index].key]),
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      newSocialMedia.splice(index, 1);
      form.setValue('socialMedia', newSocialMedia);
    }
  };

  const formValues = form.getValues();
  const selectedItem = formValues.socialMedia.findSingle(
    '_id',
    state.selectedItemId
  );
  const isSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-settings">
      <ComponentPageSettingsSocialMediaEditModal
        isShow={state.isShowModalEdit}
        onHide={() =>
          dispatch({
            type: ActionTypes.SET_IS_SHOW_MODAL_EDIT,
            payload: false,
          })
        }
        onSubmit={(newItem) => onAccept(newItem)}
        item={selectedItem}
      />
      <div className="row">
        <div className="col-md-12">
          <div className="grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <ComponentForm
                  formMethods={form}
                  i18={{
                    submitButtonText: t('save'),
                    submitButtonSubmittingText: t('loading'),
                  }}
                  onSubmit={(event) => onSubmit(event)}
                >
                  <div className="row">
                    <div className="col-md-7 mt-2">
                      <div className="row">
                        {formValues.socialMedia.map((item, index) => (
                          <ComponentPageSettingsSocialMediaItem
                            index={index}
                            item={item}
                            showEditAndDeleteButton={isSuperAdmin}
                            onDelete={(_id) => onDelete(_id)}
                            onEdit={(_id) => onEdit(_id)}
                          />
                        ))}
                      </div>
                    </div>
                    {isSuperAdmin ? (
                      <div
                        className={`col-md-7 text-start ${formValues.socialMedia.length > 0 ? 'mt-4' : ''}`}
                      >
                        <button
                          type={'button'}
                          className="btn btn-gradient-success btn-lg"
                          onClick={() => onCreate()}
                        >
                          + {t('addNew')}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </ComponentForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
