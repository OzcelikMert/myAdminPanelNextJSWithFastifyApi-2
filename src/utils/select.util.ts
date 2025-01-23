import { ComponentTypeId, componentTypes } from '@constants/componentTypes';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { PanelLanguageId, panelLanguages } from '@constants/panelLanguages';
import { StatusId, status } from '@constants/status';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { ITranslationFunc } from '@redux/features/translationSlice';
import { IPanelLanguage } from 'types/constants/panelLanguages';

const getStatus = (statusId: StatusId[], t: ITranslationFunc) => {
  return status.findMulti('id', statusId).map((item) => ({
    value: item.id,
    label: t(item.langKey),
  }));
};

const getUserRoles = (roleId: UserRoleId[], t: ITranslationFunc) => {
  return userRoles.findMulti('id', roleId).map((item) => ({
    value: item.id,
    label: t(item.langKey),
  }));
};

const getPanelLanguages = (languageId?: PanelLanguageId[]) => {
  const languages = languageId ? panelLanguages.findMulti('id', languageId) : panelLanguages;
  return languages.map((language) => ({
    label: language.title,
    value: language.id.toString(),
  }));
};

const getElementTypes = (
  t: ITranslationFunc,
  typeId?: ElementTypeId[]
) => {
  const types = typeId ? elementTypes.findMulti('id', typeId) : elementTypes;
  return types.map((type) => ({
    label: t(type.langKey),
    value: type.id,
  }));
};

const getComponentTypes = (
  t: ITranslationFunc,
  typeId?: ComponentTypeId[]
) => {
  const types = typeId ? componentTypes.findMulti('id', typeId) : componentTypes;
  return types.map((type) => ({
    label: t(type.langKey),
    value: type.id,
  }));
};

export const SelectUtil = {
  getStatus: getStatus,
  getUserRoles: getUserRoles,
  getPanelLanguages: getPanelLanguages,
  getElementTypes: getElementTypes,
  getComponentTypes: getComponentTypes
};
