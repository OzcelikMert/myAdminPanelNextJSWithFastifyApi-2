import React, { useReducer, useState } from 'react';
import { SettingService } from '@services/setting.service';
import { ISettingUpdateContactFormParamService } from 'types/services/setting.service';
import { ISettingContactFormModel } from 'types/models/setting.model';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { UserRoleId } from '@constants/userRoles';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentForm from '@components/elements/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from 'schemas/setting.schema';
import ComponentPageSettingsContactFormsItem from '@components/pages/settings/contact-forms/item';
import ComponentPageSettingsContactFormsEditModal from '@components/pages/settings/contact-forms/editModal';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

type IPageState = {
  items: ISettingContactFormModel[];
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

type IPageFormState = ISettingUpdateContactFormParamService;

const initialFormState: IPageFormState = {
  contactForms: [],
};

export default function PageSettingsContactForms() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IPageFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(SettingSchema.putContactForm),
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
    if (
      await PermissionUtil.checkAndRedirect({
        sessionAuth,
        t,
        router,
        minPermission: SettingsEndPointPermission.UPDATE_CONTACT_FORM,
        showToast,
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
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      const contactForms = setting.contactForms ?? [];
      form.setValue('contactForms', contactForms);
      dispatch({ type: ActionTypes.SET_ITEMS, payload: contactForms });
    }
  };

  const onSubmit = async (data: IPageFormState) => {
    let params = data;
    const serviceResult = await SettingService.updateContactForm(
      params,
      abortControllerRef.current.signal
    );
    if (serviceResult.status) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }
  };

  const onCreate = () => {
    let _id = String.createId();
    let newContactForms = form.getValues().contactForms;
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

    form.setValue('contactForms', newContactForms);
    onEdit(_id);
  };

  const onAccept = async (newItem: ISettingContactFormModel) => {
    let newContactForms = form.getValues().contactForms;
    let index = newContactForms.indexOfKey('_id', state.selectedItemId);
    if (index > -1) {
      newContactForms[index] = newItem;
      form.setValue('contactForms', newContactForms);
      return true;
    }
    return false;
  };

  const onEdit = (_id: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: _id });
    dispatch({ type: ActionTypes.SET_IS_SHOW_MODAL_EDIT, payload: true });
  };

  const onDelete = async (_id: string) => {
    const newContactForms = form.getValues().contactForms;
    const index = newContactForms.indexOfKey('_id', _id);
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: t('deleteItemQuestionWithItemName', [newContactForms[index].key]),
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      newContactForms.splice(index, 1);
      form.setValue('contactForms', newContactForms);
    }
  };

  const formValues = form.getValues();
  const selectedItem = formValues.contactForms.findSingle(
    '_id',
    state.selectedItemId
  );
  const isSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-settings">
      <ComponentPageSettingsContactFormsEditModal
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
          <ComponentForm
            formMethods={form}
            i18={{
              submitButtonText: t('save'),
              submitButtonSubmittingText: t('loading'),
            }}
            onSubmit={(data) => onSubmit(data)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-7 mt-2">
                      <div className="row">
                        {formValues.contactForms.map((item, index) => (
                          <ComponentPageSettingsContactFormsItem
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
                        className={`col-md-7 text-start ${formValues.contactForms.length > 0 ? 'mt-4' : ''}`}
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
