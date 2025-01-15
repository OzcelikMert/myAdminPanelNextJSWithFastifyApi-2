import { IPanelLanguageKeys } from './panelLanguageKeys';
import { PermissionGroupId } from '@constants/permissionGroups';

export interface IPermissionGroup {
  id: PermissionGroupId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
