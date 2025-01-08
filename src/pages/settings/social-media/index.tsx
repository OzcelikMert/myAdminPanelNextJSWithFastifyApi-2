import { useState } from 'react';
import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import { ISettingUpdateSocialMediaParamService } from 'types/services/setting.service';
import { ISettingSocialMediaModel } from 'types/models/setting.model';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { UserRoleId } from '@constants/userRoles';
import { cloneDeepWith } from 'lodash';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { EndPoints } from '@constants/endPoints';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { useFormReducer } from '@library/react/handles/form';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  items?: ISettingSocialMediaModel[];
};

const initialState: IComponentState = {
  items: [],
};

type IComponentSelectedItemFormState = ISettingSocialMediaModel | undefined;

const initialSelectedItemFormState: IComponentSelectedItemFormState = undefined;

type IComponentFormState = ISettingUpdateSocialMediaParamService;

const initialFormState: IComponentFormState = {
  socialMedia: [],
};

export default function PageSettingsSocialMedia() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [items, setItems] = useState(initialState.items);
  const formReducer = useFormReducer(initialFormState);
  const selectedItemFormReducer = useFormReducer(initialSelectedItemFormState);
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
        appDispatch,
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
      const setting = serviceResult.data;
      setItems(setting.socialMedia || []);
      formReducer.setFormState({
        socialMedia: setting.socialMedia || [],
      });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const serviceResult = await SettingService.updateSocialMedia(
      formReducer.formState,
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
    const newSocialMedia = formReducer.formState.socialMedia || [];
    newSocialMedia.push({
      _id: String.createId(),
      key: '',
      url: '',
      title: '',
    });
    formReducer.setFormState({ socialMedia: newSocialMedia });
    onEdit(formReducer.formState.socialMedia.length - 1);
  };

  const onAccept = (index: number) => {
    let newSocialMedia = formReducer.formState.socialMedia || [];
    newSocialMedia[index] = selectedItemFormReducer.formState!;
    formReducer.setFormState({ socialMedia: newSocialMedia });
    selectedItemFormReducer.setFormState(undefined);
  };

  const onEdit = (index: number) => {
    selectedItemFormReducer.setFormState(
      cloneDeepWith(formReducer.formState.socialMedia[index])
    );
  };

  const onCancelEdit = () => {
    selectedItemFormReducer.setFormState(undefined);
  };

  const onDelete = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `<b>'${formReducer.formState.socialMedia[index].key}'</b> ${t('deleteItemQuestionWithItemName')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      let newSocialMedia = formReducer.formState.socialMedia || [];
      newSocialMedia.splice(index, 1);
      formReducer.setFormState({ socialMedia: newSocialMedia });
    }
  };

  const SocialMedia = (props: ISettingSocialMediaModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet
          legend={`${props.title} ${PermissionUtil.checkPermissionRoleRank(sessionAuth!.user.roleId, UserRoleId.SuperAdmin) ? `(#${props.key})` : ''}`}
          legendElement={
            PermissionUtil.checkPermissionRoleRank(
              sessionAuth!.user.roleId,
              UserRoleId.SuperAdmin
            ) ? (
              <span>
                <i
                  className="mdi mdi-pencil-box text-warning fs-1 cursor-pointer ms-2"
                  onClick={() => onEdit(index)}
                ></i>
                <i
                  className="mdi mdi-minus-box text-danger fs-1 cursor-pointer ms-2"
                  onClick={() => onDelete(index)}
                ></i>
              </span>
            ) : undefined
          }
        >
          <div className="row">
            <div className="col-md-12">
              <ComponentFormType
                type="text"
                title={t('url')}
                name={`socialMedia.${index}.url`}
                value={props.url}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const SocialMediaEdit = (props: ISettingSocialMediaModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet legend={t('newSocialMedia')}>
          <div className="row mt-3">
            <div className="col-md-12">
              <ComponentFormType
                type="text"
                title={t('key')}
                name={`socialMedia.${index}.key`}
                value={props.key}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormType
                type="text"
                title={t('title')}
                name={`socialMedia.${index}.title`}
                value={props.title}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <div className="row">
                <div className="col-md-6">
                  <button
                    type="button"
                    className="btn btn-gradient-success btn-lg"
                    onClick={() => onAccept(index)}
                  >
                    {t('okay')}
                  </button>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-gradient-dark btn-lg"
                    onClick={() => onCancelEdit()}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const SocialMediaPlatforms = () => {
    return (
      <div className="row">
        <div className="col-md-7 mt-2">
          <div className="row">
            {formReducer.formState.socialMedia?.map((item, index) =>
              selectedItemFormReducer.formState &&
              selectedItemFormReducer.formState._id == item._id
                ? SocialMediaEdit(selectedItemFormReducer.formState, index)
                : SocialMedia(item, index)
            )}
          </div>
        </div>
        {PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.SuperAdmin
        ) ? (
          <div
            className={`col-md-7 text-start ${formReducer.formState.socialMedia.length > 0 ? 'mt-4' : ''}`}
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
    );
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
                  <SocialMediaPlatforms />
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
