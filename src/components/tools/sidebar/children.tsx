import React from 'react';
import { Collapse } from 'react-bootstrap';
import { PermissionUtil } from '@utils/permission.util';
import { ISidebarPath } from 'types/constants/sidebarNavs';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentToolSidebarChild from './child';

type IComponentProps = {
  item: ISidebarPath;
  index: number;
  activeItems: { [key: string]: boolean };
  checkPathActive: (path: string) => boolean;
  onToggleItemState: (stateKey: string) => void;
};

const ComponentToolSidebarChildren = React.memo((props: IComponentProps) => {
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  if (
    props.item.permission &&
    !PermissionUtil.check(sessionAuth!, props.item.permission)
  )
    return null;

  const state = props.item.state ? props.activeItems[props.item.state] : false;
  const isPathActive = props.checkPathActive(props.item.path);

  return (
    <li className={`nav-item ${isPathActive ? 'active' : ''}`}>
      <span>
        <div
          className={`nav-link ${state ? 'menu-expanded' : ''} ${isPathActive ? 'active' : ''}`}
          onClick={() =>
            props.item.state && props.onToggleItemState(props.item.state)
          }
          data-toggle="collapse"
        >
          <span
            className={`menu-title text-capitalize ${isPathActive ? 'active' : ''}`}
          >
            {t(props.item.title)}
          </span>
          <i className="menu-arrow"></i>
          <i className={`mdi mdi-${props.item.icon} menu-icon`}></i>
        </div>
        <Collapse in={state}>
          <ul className="nav flex-column sub-menu">
            {props.item.subPaths?.map((item, index) => {
              return item.subPaths ? (
                <ComponentToolSidebarChildren
                  {...props}
                  item={item}
                  index={index}
                />
              ) : (
                <ComponentToolSidebarChild
                  {...props}
                  item={item}
                  index={index}
                />
              );
            })}
          </ul>
        </Collapse>
      </span>
    </li>
  );
});

export default ComponentToolSidebarChildren;
