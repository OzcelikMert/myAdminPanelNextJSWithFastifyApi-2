import React, { Component, use, useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { ISidebarPath } from 'types/constants/sidebarNavs';
import clone from 'clone';
import { sidebarNavs } from '@constants/sidebarNavs';
import { PermissionUtil } from '@utils/permission.util';
import { RouteUtil } from '@utils/route.util';
import { EndPoints } from '@constants/endPoints';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { useRouter } from 'next/router';
import { selectTranslation } from '@lib/features/translationSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  activeItems: { [key: string]: any };
};

const initialState: IComponentState = {
  activeItems: {},
};

export default function ComponentToolSidebar() {
  const [activeItems, setActiveItems] = useState(initialState.activeItems);

  const router = useRouter();
  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  useDidMountHook(() => {
    onRouteChanged();
  });

  const onRouteChanged = () => {
    setActiveItems(initialState.activeItems);
    findActiveItems(sidebarNavs);
  };

  const findActiveItems = (sidebarSubPaths: ISidebarPath[]) => {
    for (const sidebarNav of sidebarSubPaths) {
      if (router.asPath.startsWith(sidebarNav.path)) {
        toggleItemState(sidebarNav.state);
      }

      if (sidebarNav.subPaths) findActiveItems(sidebarNav.subPaths);
    }
  };

  const toggleItemState = (stateKey?: string) => {
    if (stateKey) {
      setActiveItems({
        ...activeItems,
        [stateKey]: !activeItems[stateKey],
      })
    }
  };

  const isPathActive = (path: string) => {
    return router.asPath.startsWith(path);
  };

  const navigatePage = async (path: string) => {
    await RouteUtil.change({
      router,
      appDispatch,
      path: path || EndPoints.DASHBOARD,
    });
    onRouteChanged();
  };

  const HasChild = (props: ISidebarPath) => {
    if (
      props.permission &&
      !PermissionUtil.check(sessionAuth!, props.permission)
    )
      return null;
    return (
      <span
        className={`nav-link ${isPathActive(props.path) ? 'active' : ''}`}
        onClick={() =>
          isPathActive(props.path) ? null : navigatePage(props.path)
        }
      >
        <span
          className={`menu-title text-capitalize ${isPathActive(props.path) ? 'active' : ''}`}
        >
          {t(props.title)}
        </span>
        <i className={`mdi mdi-${props.icon} menu-icon`}></i>
      </span>
    );
  };

  const HasChildren = (props: ISidebarPath) => {
    if (
      props.permission &&
      !PermissionUtil.check(sessionAuth!, props.permission)
    )
      return null;
    const state = props.state ? activeItems[props.state] : false;
    return (
      <span>
        <div
          className={`nav-link ${state ? 'menu-expanded' : ''} ${isPathActive(props.path) ? 'active' : ''}`}
          onClick={() => toggleItemState(props.state)}
          data-toggle="collapse"
        >
          <span
            className={`menu-title text-capitalize ${isPathActive(props.path) ? 'active' : ''}`}
          >
            {t(props.title)}
          </span>
          <i className="menu-arrow"></i>
          <i className={`mdi mdi-${props.icon} menu-icon`}></i>
        </div>
        <Collapse in={state}>
          <ul className="nav flex-column sub-menu">
            {props.subPaths?.map((item, index) => {
              return (
                <li className="nav-item" key={index}>
                  {item.subPaths ? (
                    <HasChildren key={index} {...item} />
                  ) : (
                    <HasChild key={index} {...item} />
                  )}
                </li>
              );
            })}
          </ul>
        </Collapse>
      </span>
    );
  };

  const Item = (props: ISidebarPath) => {
    return (
      <li className={`nav-item ${isPathActive(props.path) ? 'active' : ''}`}>
        {props.subPaths ? <HasChildren {...props} /> : <HasChild {...props} />}
      </li>
    );
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav pt-5">
        {sidebarNavs.map((item, index) => {
          return <Item key={index} {...item} />;
        })}
      </ul>
    </nav>
  );
}
