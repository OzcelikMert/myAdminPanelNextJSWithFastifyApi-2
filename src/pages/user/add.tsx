import { FormEvent, useEffect, useReducer } from 'react';
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
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@lib/features/breadCrumbSlice';

type IComponentState = {
  mainTabActiveKey: string;
  userRoles: IThemeFormSelectData<UserRoleId>[];
  status: IThemeFormSelectData<StatusId>[];
  permissions: IPermission[];
  permissionGroups: IPermissionGroup[];
  mainTitle: string;
  item?: IUserGetResultService;
};

const initialState: IComponentState = {
  mainTabActiveKey: 'general',
  userRoles: [],
  status: [],
  permissions: [],
  permissionGroups: [],
  mainTitle: '',
};

type IAction =
  | {
      type: 'SET_MAIN_TAB_ACTIVE_KEY';
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: 'SET_USER_ROLES'; payload: IComponentState['userRoles'] }
  | { type: 'SET_STATUS'; payload: IComponentState['status'] }
  | { type: 'SET_PERMISSIONS'; payload: IComponentState['permissions'] }
  | {
      type: 'SET_PERMISSION_GROUPS';
      payload: IComponentState['permissionGroups'];
    }
  | { type: 'SET_MAIN_TITLE'; payload: IComponentState['mainTitle'] }
  | { type: 'SET_ITEM'; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_MAIN_TAB_ACTIVE_KEY':
      return { ...state, mainTabActiveKey: action.payload };
    case 'SET_USER_ROLES':
      return { ...state, userRoles: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'SET_PERMISSION_GROUPS':
      return { ...state, permissionGroups: action.payload };
    case 'SET_MAIN_TITLE':
      return { ...state, mainTitle: action.payload };
    case 'SET_ITEM':
      return { ...state, item: action.payload };
    default:
      return state;
  }
};

type IComponentFormState = IUserUpdateWithIdParamService;

const initialFormState: IComponentFormState = {
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

export default function PageUserAdd() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      _id: (router.query._id as string) ?? '',
      banDateEnd: new Date().getStringWithMask(DateMask.DATE),
    });

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

  const init = async () => {
    const minPermission = formState._id
      ? UserEndPointPermission.UPDATE
      : UserEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        appDispatch,
        minPermission,
      })
    ) {
      getRoles();
      getStatus();
      if (formState._id) {
        await getItem();
      }
      getPermissionsForUserRoleId(formState.roleId);
      setPageTitle();
      appDispatch(setIsPageLoadingState(false));
    }
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = [
      {
        title: t('users'),
        url: EndPoints.USER_WITH.LIST,
      },
    ];

    if (formState._id) {
      titles.push({
        title: t('edit'),
      });
      titles.push({
        title: state.mainTitle,
      });
    } else {
      titles.push({
        title: t('add'),
      });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: 'SET_STATUS',
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.Disabled, StatusId.Banned],
        t
      ),
    });
  };

  const getRoles = () => {
    const findUserRole = userRoles.findSingle('id', sessionAuth?.user.roleId);
    dispatch({
      type: 'SET_USER_ROLES',
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
    const serviceResult = await UserService.getWithId(
      {
        _id: formState._id,
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      const user = serviceResult.data;
      dispatch({
        type: 'SET_ITEM',
        payload: user,
      });
      dispatch({
        type: 'SET_MAIN_TITLE',
        payload: user.name,
      });
    } else {
      await navigatePage();
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
      type: 'SET_PERMISSIONS',
      payload: filteredPermissions,
    });
    dispatch({
      type: 'SET_PERMISSION_GROUPS',
      payload: filteredPermissionGroups,
    });
  };

  const navigatePage = async () => {
    const path = EndPoints.USER_WITH.LIST;
    await RouteUtil.change({ appDispatch, router, path });
  };

  const onSubmit = async (event: FormEvent) => {
    const params = formState;

    const serviceResult = await (params._id
      ? UserService.updateWithId(params, abortController.signal)
      : UserService.add(
          { ...params, password: formState.password || '' },
          abortController.signal
        ));

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(formState._id ? 'itemEdited' : 'itemAdded')}!`,
      });

      if (!formState._id) {
        await navigatePage();
      }
    }
  };

  const onPermissionSelected = (isSelected: boolean, permId: number) => {
    let newPermissions = formState.permissions;
    if (isSelected) {
      newPermissions.push(permId);
    } else {
      newPermissions = newPermissions.filter((perm) => perm !== permId);
    }
    setFormState({
      ...formState,
      permissions: newPermissions,
    });
  };

  const onPermissionAllSelected = (isSelected: boolean) => {
    let newPermissions = formState.permissions;
    if (isSelected) {
      newPermissions = state.permissions.map((perm) => perm.id);
    } else {
      newPermissions = [];
    }
  };

  const onChangeUserRole = (roleId: UserRoleId) => {
    const userRole = userRoles.findSingle('id', roleId);
    if (userRole) {
      getPermissionsForUserRoleId(roleId);
      setFormState({
        ...formState,
        roleId: roleId,
        permissions: [],
      });
    }
  };

  const Header = () => {
    return (
      <div className="col-md-3">
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
              onClick={() => navigatePage()}
            >
              <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  function PermissionItem(props: IPermission, index: number) {
    return (
      <div className="col-md-4" key={index}>
        <ComponentFormCheckBox
          key={index}
          title={t(props.langKey)}
          name="permissions"
          checked={formState.permissions.includes(props.id)}
          onChange={(e) => onPermissionSelected(e.target.checked, props.id)}
        />
      </div>
    );
  }

  const PermissionGroup = (props: IPermissionGroup, index: number) => {
    const foundPermissions = state.permissions.findMulti('groupId', props.id);

    return foundPermissions.every((permission) => permission == null) ? null : (
      <div className="col-md-6 mb-3">
        <ComponentFieldSet key={index} legend={t(props.langKey)}>
          {foundPermissions.map((perm, index) => PermissionItem(perm, index))}
        </ComponentFieldSet>
      </div>
    );
  };

  const TabPermissions = () => {
    return (
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentFormCheckBox
            title={t('selectAll')}
            checked={state.permissions.length === formState.permissions.length}
            onChange={(e) => onPermissionAllSelected(e.target.checked)}
          />
        </div>
        {state.permissionGroups.map((group, index) =>
          PermissionGroup(group, index)
        )}
      </div>
    );
  };

  const TabOptions = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('role')}
            name="roleId"
            placeholder={t('chooseRole')}
            options={state.userRoles}
            value={state.userRoles?.findSingle('value', formState.roleId)}
            onChange={(item: any, e) => {
              onChangeSelect(e.name, item.value);
              onChangeUserRole(item.value);
            }}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            name="statusId"
            options={state.status}
            value={state.status?.findSingle('value', formState.statusId)}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
        {formState.statusId == StatusId.Banned ? (
          <div className="col-md-7 mb-3">
            <div className="mb-3">
              <ComponentFormType
                title={`${t('banDateEnd')}*`}
                type="date"
                name="banDateEnd"
                value={moment(formState.banDateEnd).format('YYYY-MM-DD')}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
            <div className="mb-3">
              <ComponentFormType
                title={t('banComment')}
                name="banComment"
                type="textarea"
                value={formState.banComment}
                onChange={(e) => onChangeInput(e)}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('name')}*`}
            name="name"
            type="text"
            required={true}
            value={formState.name}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('email')}*`}
            name="email"
            type="email"
            required={true}
            value={formState.email}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('password')}*`}
            name="password"
            type="password"
            required={VariableLibrary.isEmpty(formState._id)}
            value={formState.password}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </div>
    );
  };

  const userRole = userRoles.findSingle('id', formState.roleId);
  
  return isPageLoading ? null : (
    <div className="page-settings page-user">
      <div className="row mb-3">
        <Header />
      </div>
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
                  <div className="theme-tabs">
                    <Tabs
                      onSelect={(key: any) =>
                        dispatch({
                          type: 'SET_MAIN_TAB_ACTIVE_KEY',
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      <Tab eventKey="general" title={t('general')}>
                        <TabGeneral />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <TabOptions />
                      </Tab>
                      <Tab
                        eventKey="permissions"
                        title={`${t('permissions')} (${t(userRole?.langKey ?? '[noLangAdd]')})`}
                      >
                        <TabPermissions />
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
