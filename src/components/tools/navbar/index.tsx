import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { AuthService } from '@services/auth.service';
import { LocalStorageUtil } from '@utils/localStorage.util';
import DarkModeToggle from 'react-dark-mode-toggle';
import { ThemeUtil } from '@utils/theme.util';
import Image from 'next/image';
import { IThemeKeys } from 'types/constants/themeKeys';
import { EndPoints } from '@constants/endPoints';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { RouteUtil } from '@utils/route.util';
import { useRouter } from 'next/router';
import { setIsLockState } from '@redux/features/appSlice';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useDidMount } from '@library/react/customHooks';
import ComponentToolNavbarProfile, { NavbarProfileDropdownItems } from './profile';

type IComponentState = {
  isDarkTheme: boolean;
};

const initialState: IComponentState = {
  isDarkTheme: false,
};

const ComponentToolNavbar = React.memo(() => {
  const abortController = new AbortController();

  const router = useRouter();
  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  const [isDarkTheme, setIsDarkTheme] = useState(
    LocalStorageUtil.getTheme() == 'dark'
  );

  useDidMount(() => {
    return () => {
      abortController.abort();
    };
  });

  const toggleOffCanvas = () => {
    (
      document.querySelector('.sidebar-offcanvas') as HTMLCanvasElement
    ).classList.toggle('active');
  };

  const onChangeTheme = () => {
    let theme: IThemeKeys = 'default';
    setIsDarkTheme((state) => {
      theme = !state ? 'dark' : 'default';
      return !state;
    });
    LocalStorageUtil.setTheme(theme);
    ThemeUtil.changeTheme(theme);
  };

  const onClickProfileDropdownItem = async (
    item: NavbarProfileDropdownItems
  ) => {
    switch (item) {
      case NavbarProfileDropdownItems.Profile:
        await RouteUtil.change({
          router,
          path: EndPoints.SETTINGS_WITH.PROFILE,
        });
        break;
      case NavbarProfileDropdownItems.ChangePassword:
        await RouteUtil.change({
          router,
          path: EndPoints.SETTINGS_WITH.CHANGE_PASSWORD,
        });
        break;
      case NavbarProfileDropdownItems.Lock:
        const resultLock = await AuthService.logOut(abortController.signal);
        if (resultLock.status) {
          appDispatch(setIsLockState(true));
        }
        break;
      case NavbarProfileDropdownItems.SignOut:
        const resultSignOut = await AuthService.logOut(abortController.signal);
        if (resultSignOut.status) {
          await RouteUtil.change({
            router,
            path: EndPoints.LOGIN,
          });
          appDispatch(setSessionAuthState(null));
        }
        break;
    }
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" href={EndPoints.DASHBOARD}>
          <Image
            src="/images/ozcelikLogo.png"
            alt="logo"
            width={100}
            height={75}
            className="img-fluid"
          />
        </Link>
        <Link
          className="navbar-brand brand-logo-mini"
          href={EndPoints.DASHBOARD}
        >
          <Image
            src="/images/ozcelikLogoMini.png"
            alt="logo"
            width={50}
            height={50}
            className="img-fluid"
          />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <ul className="navbar-nav navbar-nav-right">
          <DarkModeToggle
            onChange={() => onChangeTheme()}
            checked={isDarkTheme}
            size={55}
          />
          <li className="nav-item nav-profile">
            <ComponentToolNavbarProfile
              onClickDropdownItem={item => onClickProfileDropdownItem(item)}
            />
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={() => toggleOffCanvas()}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
});

export default ComponentToolNavbar;
