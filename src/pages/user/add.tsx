import { FormEvent, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import moment from 'moment';
import { VariableLibrary } from '@library/variable';
import { UserService } from '@services/user.service';
import {
  IUserGetResultService,
  IUserUpdateWithIdParamService,
} from 'types/services/user.service';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { UserEndPointPermission } from '@constants/endPointPermissions/user.endPoint.permission';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentUtil } from '@utils/component.util';
import { StatusId } from '@constants/status';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { EndPoints } from '@constants/endPoints';
import { permissions } from '@constants/permissions';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import { IPermission } from 'types/constants/permissions';
import { permissionGroups } from '@constants/permissionGroups';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import { DateMask } from '@library/variable/date';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'schemas/user.schema';
import ComponentPageUserAddHeader from '@components/pages/user/add/header';
import ComponentPageUserAddTabGeneral from '@components/pages/user/add/tabGeneral';
import ComponentPageUserAddTabOptions from '@components/pages/user/add/tabOptions';
import ComponentPageUserAddTabPermissions from '@components/pages/user/add/tabPermissions';

export type IPageUserAddState = {
  mainTabActiveKey: string;
  userRoles: IThemeFormSelectData<UserRoleId>[];
  status: IThemeFormSelectData<StatusId>[];
  permissions: IPermission[];
  permissionGroups: IPermissionGroup[];
  item?: IUserGetResultService;
};

const initialState: IPageUserAddState = {
  mainTabActiveKey: 'general',
  userRoles: [],
  status: [],
  permissions: [],
  permissionGroups: [],
};

enum ActionTypes {
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_USER_ROLES,
  SET_STATUS,
  SET_PERMISSIONS,
  SET_PERMISSION_GROUPS,
  SET_ITEM,
}

type IAction =
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IPageUserAddState['mainTabActiveKey'];
    }
  | {
      type: ActionTypes.SET_USER_ROLES;
      payload: IPageUserAddState['userRoles'];
    }
  | { type: ActionTypes.SET_STATUS; payload: IPageUserAddState['status'] }
  | {
      type: ActionTypes.SET_PERMISSIONS;
      payload: IPageUserAddState['permissions'];
    }
  | {
      type: ActionTypes.SET_PERMISSION_GROUPS;
      payload: IPageUserAddState['permissionGroups'];
    }
  | { type: ActionTypes.SET_ITEM; payload: IPageUserAddState['item'] };

const reducer = (
  state: IPageUserAddState,
  action: IAction
): IPageUserAddState => {
  switch (action.type) {
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_USER_ROLES:
      return { ...state, userRoles: action.payload };
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_PERMISSIONS:
      return { ...state, permissions: action.payload };
    case ActionTypes.SET_PERMISSION_GROUPS:
      return { ...state, permissionGroups: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    default:
      return state;
  }
};

export type IPageUserAddFormState = IUserUpdateWithIdParamService;

const initialFormState: IPageUserAddFormState = {
  _id: '',
  name: '',
  email: '',
  password: '',
  roleId: UserRoleId.User,
  statusId: StatusId.Active,
  banDateEnd: '',
  banComment: '',
  permissions: [],
};

type IPageQueries = {
  _id?: string;
};

export default function PageUserAdd() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IPageUserAddFormState>({
    defaultValues: {
      ...initialFormState,
      _id: queries._id ?? '',
      banDateEnd: new Date().getStringWithMask(DateMask.DATE),
    },
    //resolver: zodResolver(queries._id ? UserSchema.putWithId : UserSchema.post),
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const mainTitleRef = useRef<string>('');

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

  useEffectAfterDidMount(() => {
    getPermissionsForUserRoleId(form.getValues().roleId);
    form.setValue("permissions", []);
  }, [form.getValues().roleId]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const minPermission = queries._id
      ? UserEndPointPermission.UPDATE
      : UserEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission,
      })
    ) {
      getRoles();
      getStatus();
      if (queries._id) {
        await getItem();
      }
      getPermissionsForUserRoleId(form.getValues().roleId);
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = [
      {
        title: t('users'),
        url: EndPoints.USER_WITH.LIST,
      },
      {
        title: t(queries._id ? 'edit' : 'add'),
      },
    ];

    if (queries._id) {
      titles.push({
        title: mainTitleRef.current,
      });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.Disabled, StatusId.Banned],
        t
      ),
    });
  };

  const getRoles = () => {
    const findUserRole = userRoles.findSingle('id', sessionAuth?.user.roleId);
    dispatch({
      type: ActionTypes.SET_USER_ROLES,
      payload: ComponentUtil.getUserRolesForSelect(
        userRoles
          .map((userRole) =>
            findUserRole && findUserRole.rank > userRole.rank ? userRole.id : 0
          )
          .filter((roleId) => roleId !== 0),
        t
      ),
    });
  };

  const getItem = async () => {
    if (queries._id) {
      const serviceResult = await UserService.getWithId(
        {
          _id: queries._id,
        },
        abortController.signal
      );

      if (serviceResult.status && serviceResult.data) {
        const user = serviceResult.data;
        dispatch({
          type: ActionTypes.SET_ITEM,
          payload: user,
        });
        mainTitleRef.current = user.name;
      } else {
        await navigatePage();
      }
    }
  };

  const getPermissionsForUserRoleId = (userRoleId: UserRoleId) => {
    let filteredPermissions = permissions.filter((perm) =>
      PermissionUtil.checkPermissionRoleRank(userRoleId, perm.minUserRoleId)
    );
    filteredPermissions = filteredPermissions.filter((perm) =>
      PermissionUtil.checkPermissionId(
        sessionAuth!.user.roleId,
        sessionAuth!.user.permissions,
        [perm.id]
      )
    );

    const filteredPermissionGroups: IPermissionGroup[] = [];
    filteredPermissions.forEach((perm) => {
      const foundPermissionGroup = permissionGroups.findSingle(
        'id',
        perm.groupId
      );
      if (
        foundPermissionGroup &&
        !filteredPermissionGroups.findSingle('id', perm.groupId)
      ) {
        filteredPermissionGroups.push(foundPermissionGroup);
      }
    });

    dispatch({
      type: ActionTypes.SET_PERMISSIONS,
      payload: filteredPermissions,
    });
    dispatch({
      type: ActionTypes.SET_PERMISSION_GROUPS,
      payload: filteredPermissionGroups,
    });
  };

  const navigatePage = async () => {
    const path = EndPoints.USER_WITH.LIST;
    await RouteUtil.change({ router, path });
  };

  const onSubmit = async (data: IPageUserAddFormState) => {
    console.log(data);
    
    return;
    const params = data;

    const serviceResult = await (params._id
      ? UserService.updateWithId(params, abortController.signal)
      : UserService.add(
          { ...params, password: params.password || '' },
          abortController.signal
        ));

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });

      if (!params._id) {
        await navigatePage();
      }
    }
  };

  const onSelectPermission = (isSelected: boolean, permId: number) => {
    let newPermissions = form.getValues().permissions;
    if (isSelected) {
      newPermissions.push(permId);
    } else {
      newPermissions = newPermissions.filter((perm) => perm !== permId);
    }
    form.setValue("permissions", newPermissions);
  };

  const onSelectAllPermissions = (isSelected: boolean) => {
    let newPermissions = form.getValues().permissions;
    if (isSelected) {
      newPermissions = state.permissions.map((perm) => perm.id);
    } else {
      newPermissions = [];
    }
  };

  const userRole = userRoles.findSingle('id', form.getValues().roleId);

  return isPageLoading ? null : (
    <div className="page-settings page-user">
      <div className="row mb-3">
        <ComponentPageUserAddHeader
          state={state}
          onNavigatePage={() => navigatePage()}
        />
      </div>
      <div className="row">
        <div className="col-md-12">
          <ComponentForm
            formMethods={form}
            submitButtonText={t('save')}
            submitButtonSubmittingText={t('loading')}
            onSubmit={(data) => onSubmit(data)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="theme-tabs">
                    <Tabs
                      onSelect={(key: any) =>
                        dispatch({
                          type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      <Tab eventKey="general" title={t('general')}>
                        <ComponentPageUserAddTabGeneral
                          form={form}
                          state={state}
                        />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <ComponentPageUserAddTabOptions
                          form={form}
                          state={state}
                        />
                      </Tab>
                      <Tab
                        eventKey="permissions"
                        title={`${t('permissions')} (${t(userRole?.langKey ?? '[noLangAdd]')})`}
                      >
                        <ComponentPageUserAddTabPermissions
                          form={form}
                          state={state}
                          onSelectAllPermissions={(isSelected) => onSelectAllPermissions(isSelected)}
                        />
                      </Tab>
                    </Tabs>
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
