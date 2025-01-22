import React from 'react';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

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

type IComponentProps = {
  userRoleId: UserRoleId;
  className?: string;
};

const ComponentThemeBadgeUserRole = React.memo((props: IComponentProps) => {
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
});

export default ComponentThemeBadgeUserRole;
