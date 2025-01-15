import { IPanelLanguageKeys } from './panelLanguageKeys';
import { UserRoleId } from '@constants/userRoles';

export interface IUserRole {
  id: UserRoleId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
