import { UserRoleId, userRoles } from '@constants/userRoles';
import { PermissionId } from '@constants/permissions';
import { PostTypeId } from '@constants/postTypes';
import { PostEndPointPermission } from '@constants/endPointPermissions/post.endPoint.permission';
import { IEndPointPermission } from 'types/constants/endPoint.permissions';
import { EndPoints } from '@constants/endPoints';
import ComponentToast from '@components/elements/toast';
import { RouteUtil } from '@utils/route.util';
import { NextRouter } from 'next/router';
import { IAppDispatch } from '@lib/store';
import { ITranslationFunc } from '@lib/features/translationSlice';
import { ISessionAuthResultService } from 'types/services/auth.service';
import { IPermissionCheckAndRedirectParamUtil } from 'types/utils/permission.util';

export enum PostPermissionMethod {
  GET,
  ADD,
  UPDATE,
  DELETE,
}

const getPermissionKeyPrefix = (method: PostPermissionMethod) => {
  let prefix = '';

  switch (method) {
    case PostPermissionMethod.GET:
      prefix = 'GET_';
      break;
    case PostPermissionMethod.ADD:
      prefix = 'ADD_';
      break;
    case PostPermissionMethod.UPDATE:
      prefix = 'UPDATE_';
      break;
    case PostPermissionMethod.DELETE:
      prefix = 'DELETE_';
      break;
  }

  return prefix;
};

const getPostTypeIdKey = (typeId: PostTypeId) => {
  let postTypeIdKey = '';

  switch (typeId) {
    case PostTypeId.BeforeAndAfter:
      postTypeIdKey = 'BEFORE_AND_AFTER';
      break;
    default:
      postTypeIdKey =
        Object.keys(PostTypeId).find(
          (key) => PostTypeId[key as keyof typeof PostTypeId] === typeId
        ) ?? '';
      break;
  }

  return postTypeIdKey;
};

const getPostPermission = (
  typeId: PostTypeId,
  method: PostPermissionMethod
): IEndPointPermission => {
  const permissionKeyPrefix = getPermissionKeyPrefix(method);
  const postTypeIdKey = getPostTypeIdKey(typeId);

  return (
    (PostEndPointPermission as any)[
      `${permissionKeyPrefix}${postTypeIdKey.toUpperCase()}`
    ] ?? {
      permissionId: [],
      userRoleId: UserRoleId.SuperAdmin,
    }
  );
};

const checkPermissionRoleRank = (
  targetRoleId: UserRoleId,
  minRoleId: UserRoleId,
  checkOnlyGTE: boolean = false
): boolean => {
  const userRole = userRoles.findSingle('id', targetRoleId);
  const minRole = userRoles.findSingle('id', minRoleId);

  return (
    (userRole &&
      minRole &&
      ((checkOnlyGTE && userRole.rank > minRole.rank) ||
        (!checkOnlyGTE && userRole.rank >= minRole.rank))) ||
    targetRoleId == UserRoleId.SuperAdmin
  );
};

const checkPermissionId = (
  targetRoleId: UserRoleId,
  targetPermissionId: PermissionId[],
  minPermissionId: PermissionId[]
) => {
  return (
    targetRoleId == UserRoleId.SuperAdmin ||
    minPermissionId.some((permissionId) =>
      targetPermissionId.some(
        (userPermissionId) => permissionId == userPermissionId
      )
    )
  );
};

const check = (
  sessionAuth: ISessionAuthResultService | undefined,
  minPermission: IEndPointPermission
) => {
  return (
    sessionAuth &&
    checkPermissionRoleRank(
      sessionAuth.user.roleId,
      minPermission.userRoleId
    ) &&
    checkPermissionId(
      sessionAuth.user.roleId,
      sessionAuth.user.permissions,
      minPermission.permissionId
    )
  );
};

const checkAndRedirect = (
  props: IPermissionCheckAndRedirectParamUtil
): boolean => {
  let status = true;

  if (props.sessionAuth) {
    if (!check(props.sessionAuth, props.minPermission)) {
      status = false;
      new ComponentToast({
        type: 'error',
        title: props.t('error'),
        content: props.t('noPerm'),
        position: 'top-right',
      });
      RouteUtil.change({
        router: props.router,
        appDispatch: props.appDispatch,
        path: props.redirectPath ?? EndPoints.DASHBOARD,
      });
    }
  } else {
    status = false;
    new ComponentToast({
      type: 'error',
      title: props.t('error'),
      content: props.t('sessionRequired'),
      position: 'top-right',
    });
    RouteUtil.change({
      router: props.router,
      appDispatch: props.appDispatch,
      path: EndPoints.LOGIN,
    });
  }

  return status;
};

export const PermissionUtil = {
  check: check,
  checkAndRedirect: checkAndRedirect,
  getPostPermission: getPostPermission,
  checkPermissionRoleRank: checkPermissionRoleRank,
  checkPermissionId: checkPermissionId,
};
