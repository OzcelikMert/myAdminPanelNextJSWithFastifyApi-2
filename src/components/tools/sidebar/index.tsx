import React, { useState } from 'react';
import { ISidebarPath } from 'types/constants/sidebarNavs';
import { sidebarNavs } from '@constants/sidebarNavs';
import { RouteUtil } from '@utils/route.util';
import { EndPoints } from '@constants/endPoints';
import { useRouter } from 'next/router';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentToolSidebarChildren from './children';
import ComponentToolSidebarChild from './child';

type IComponentState = {
  activeItems: { [key: string]: boolean };
};

const initialState: IComponentState = {
  activeItems: {},
};

const ComponentToolSidebar = React.memo(() => {
  const [activeItems, setActiveItems] = useState(initialState.activeItems);

  const router = useRouter();

  useDidMount(() => {
    onRouteChanged();
  });

  useEffectAfterDidMount(() => {
    onRouteChanged();
  }, [router.asPath]);

  const onRouteChanged = () => {
    setActiveItems(initialState.activeItems);
    findActiveItems(sidebarNavs);
  };

  const findActiveItems = (sidebarSubPaths: ISidebarPath[]) => {
    for (const sidebarNav of sidebarSubPaths) {
      if (isPathActive(sidebarNav.path)) {
        toggleItemState(sidebarNav.state);
      }

      if (sidebarNav.subPaths) findActiveItems(sidebarNav.subPaths);
    }
  };

  const toggleItemState = (stateKey?: string) => {
    if (stateKey) {
      setActiveItems((state) => ({ ...state, [stateKey]: !state[stateKey] }));
    }
  };

  const isPathActive = (path: string) => {
    return router.asPath.startsWith(path);
  };

  const getKey = (id: string) => {
    return `sidebarItem_${id}`;
  }

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav pt-5">
        {sidebarNavs.map((item, index) => {
          return item.subPaths ? (
            <ComponentToolSidebarChildren
              key={getKey(item.id)}
              item={item}
              index={index}
              activeItems={activeItems}
              checkPathActive={(path) => isPathActive(path)}
              onToggleItemState={(stateKey) => toggleItemState(stateKey)}
            />
          ) : (
            <ComponentToolSidebarChild
              key={getKey(item.id)}
              item={item}
              index={index}
              checkPathActive={(path) => isPathActive(path)}
            />
          );
        })}
      </ul>
    </nav>
  );
});

export default ComponentToolSidebar;
