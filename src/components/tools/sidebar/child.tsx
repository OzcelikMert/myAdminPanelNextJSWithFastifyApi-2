import React from 'react';
import { ISidebarPath } from 'types/constants/sidebarNavs';
import { PermissionUtil } from '@utils/permission.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import Link from 'next/link';

type IComponentProps = {
  item: ISidebarPath;
  index: number;
  checkPathActive: (path: string) => boolean;
};

const ComponentToolSidebarChild = React.memo((props: IComponentProps) => {
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  if (
    props.item.permission &&
    !PermissionUtil.check(sessionAuth!, props.item.permission)
  )
    return null;

  const isPathActive = props.checkPathActive(props.item.path);

  return (
    <li className={`nav-item ${isPathActive ? 'active' : ''}`}>
      <Link
        className={`nav-link ${isPathActive ? 'active' : ''}`}
        href={isPathActive ? '#' : props.item.path}
        referrerPolicy="no-referrer"
        shallow={true}
      >
        <span
          className={`menu-title text-capitalize ${isPathActive ? 'active' : ''}`}
        >
          {t(props.item.title)}
        </span>
        <i className={`mdi mdi-${props.item.icon} menu-icon`}></i>
      </Link>
    </li>
  );
});

export default ComponentToolSidebarChild;
