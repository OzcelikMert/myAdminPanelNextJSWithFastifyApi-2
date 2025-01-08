import { StatusId, status } from '@constants/status';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { ITranslationFunc } from '@redux/features/translationSlice';
import { IPanelLanguage } from 'types/constants/panelLanguages';

const getStatusForSelect = (statusId: StatusId[], t: ITranslationFunc) => {
  return status.findMulti('id', statusId).map((item) => ({
    value: item.id,
    label: t(item.langKey),
  }));
};

const getUserRolesForSelect = (
  roleId: UserRoleId[],
  t: ITranslationFunc
) => {
  return userRoles.findMulti('id', roleId).map((item) => ({
    value: item.id,
    label: t(item.langKey),
  }));
};

const getPanelLanguageForSelect = (languages: IPanelLanguage[]) => {
  return languages.map((language) => ({
    label: language.title,
    value: language.id.toString(),
  }));
};

export const ComponentUtil = {
  getStatusForSelect: getStatusForSelect,
  getUserRolesForSelect: getUserRolesForSelect,
  getPanelLanguageForSelect: getPanelLanguageForSelect,
};
