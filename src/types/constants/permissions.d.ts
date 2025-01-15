import { IPanelLanguageKeys } from './panelLanguageKeys';
import { PermissionId } from '@constants/permissions';
import { PermissionGroupId } from '@constants/permissionGroups';
import { UserRoleId } from '@constants/userRoles';

export interface IPermission {
  id: PermissionId;
  groupId: PermissionGroupId;
  minUserRoleId: UserRoleId;
  langKey: IPanelLanguageKeys;
}
