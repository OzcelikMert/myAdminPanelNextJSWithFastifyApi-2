import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import { ISettingUpdateContactFormParamService } from 'types/services/setting.service';
import { ISettingContactFormModel } from 'types/models/setting.model';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { UserRoleId } from '@constants/userRoles';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { cloneDeepWith } from 'lodash';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useEffect, useState } from 'react';
import { useFormReducer } from '@library/react/handles/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  items: ISettingContactFormModel[];
};

const initialState: IComponentState = {
  items: [],
};

type IComponentSelectedItemFormState = ISettingContactFormModel | undefined;

const initialSelectedItemFormState: IComponentSelectedItemFormState = undefined;

type IComponentFormState = ISettingUpdateContactFormParamService;

const initialFormState: IComponentFormState = {
  contactForms: [],
};

export default function PageSettingsContactForms() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [items, setItems] = useState(initialState.items);
  const selectedItemFormReducer = useFormReducer(initialSelectedItemFormState);
  const formReducer = useFormReducer(initialFormState);
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
        sessionAuth,
        t,
        router,
        minPermission: SettingsEndPointPermission.UPDATE_CONTACT_FORM,
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
          title: t('contactForms'),
        },
      ])
    );
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      { projection: SettingProjectionKeys.ContactForm },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      const contactForms = setting.contactForms ?? [];
      setItems(contactForms);
      formReducer.setFormState({ contactForms });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let params = formReducer.formState;
    const serviceResult = await SettingService.updateContactForm(
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
    let newContactForms = formReducer.formState.contactForms;
    newContactForms.push({
      _id: _id,
      title: '',
      key: '',
      port: 465,
      host: '',
      targetEmail: '',
      name: '',
      password: '',
      email: '',
      hasSSL: true,
    });

    formReducer.setFormState({
      contactForms: newContactForms,
    });

    onEdit(newContactForms.length - 1);
  };

  const onAccept = (index: number) => {
    let newContactForms = formReducer.formState.contactForms;
    newContactForms[index] = selectedItemFormReducer.formState!;
    formReducer.setFormState({
      contactForms: newContactForms,
    });
    selectedItemFormReducer.setFormState(undefined);
  };

  const onEdit = (index: number) => {
    selectedItemFormReducer.setFormState(
      cloneDeepWith(formReducer.formState.contactForms[index])
    );
  };

  const onCancelEdit = () => {
    selectedItemFormReducer.setFormState(undefined);
  };

  const onDelete = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `<b>'${formReducer.formState.contactForms[index].key}'</b> ${t('deleteItemQuestionWithItemName')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      let newContactForms = formReducer.formState.contactForms;
      newContactForms.splice(index, 1);
      formReducer.setFormState({
        contactForms: newContactForms,
      });
    }
  };

  const ContactForm = (props: ISettingContactFormModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet
          legend={`${props.title} (#${props.key})`}
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
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="text"
                name={`contactForms.${index}.name`}
                title={t('name')}
                value={props.name}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="email"
                name={`contactForms.${index}.targetEmail`}
                title={t('targetEmail')}
                value={props.targetEmail}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="email"
                name={`contactForms.${index}.email`}
                title={t('email')}
                value={props.email}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="password"
                name={`contactForms.${index}.password`}
                title={t('password')}
                value={props.password}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="text"
                name={`contactForms.${index}.host`}
                title={t('host')}
                value={props.host}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                type="number"
                name={`contactForms.${index}.port`}
                title={t('port')}
                value={props.port}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-7 mt-4">
              <div className="form-switch">
                <input
                  name={`contactForms.${index}.hasSSL`}
                  checked={props.hasSSL}
                  className="form-check-input"
                  type="checkbox"
                  id="hasSSL"
                  onChange={(e) => formReducer.onChangeInput(e)}
                />
                <label className="form-check-label ms-2" htmlFor="hasSSL">
                  {t('hasSSL')}
                </label>
              </div>
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const ContactFormEdit = (props: ISettingContactFormModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet legend={t('newContactForm')}>
          <div className="row mt-3">
            <div className="col-md-12">
              <ComponentFormType
                title={`${t('title')}*`}
                name="title"
                type="text"
                required={true}
                value={props.title}
                onChange={(e) => selectedItemFormReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-4">
              <ComponentFormType
                title={`${t('key')}*`}
                name="key"
                type="text"
                required={true}
                value={props.key}
                onChange={(e) => selectedItemFormReducer.onChangeInput(e)}
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
                  <div className="row">
                    <div className="col-md-7 mt-2">
                      <div className="row">
                        {formReducer.formState.contactForms?.map(
                          (item, index) =>
                            selectedItemFormReducer.formState &&
                            selectedItemFormReducer.formState._id == item._id
                              ? ContactFormEdit(
                                  selectedItemFormReducer.formState,
                                  index
                                )
                              : ContactForm(item, index)
                        )}
                      </div>
                    </div>
                    {PermissionUtil.checkPermissionRoleRank(
                      sessionAuth!.user.roleId,
                      UserRoleId.SuperAdmin
                    ) ? (
                      <div
                        className={`col-md-7 text-start ${formReducer.formState.contactForms.length > 0 ? 'mt-4' : ''}`}
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
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
