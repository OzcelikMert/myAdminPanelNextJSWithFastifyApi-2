import React from 'react';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';

type IComponentProps = {
  userRoleId: UserRoleId;
  className?: string;
};

export default function ComponentThemeBadgeUserRole(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);

  return (
    <label
      className={`badge badge-gradient-${getUserRoleColor(props.userRoleId)} text-start ${props.className ?? ''}`}
    >
      {t(
        userRoles.findSingle('id', props.userRoleId)?.langKey ?? '[noLangAdd]'
      )}
    </label>
  );
}

export function getUserRoleColor(roleId: UserRoleId): string {
  let className = ``;
  switch (roleId) {
    case UserRoleId.SuperAdmin:
      className = `dark`;
      break;
    case UserRoleId.Admin:
      className = `primary`;
      break;
    case UserRoleId.Editor:
      className = `danger`;
      break;
    case UserRoleId.Author:
      className = `success`;
      break;
    case UserRoleId.User:
      className = `info`;
      break;
  }
  return className;
}
