import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

export enum NavbarProfileDropdownItems {
  Profile,
  ChangePassword,
  Lock,
  SignOut,
}

type IComponentProps = {
  onClickDropdownItem: (item: NavbarProfileDropdownItems) => void;
};

const ComponentToolNavbarProfile = React.memo((props: IComponentProps) => {
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  return (
    <Dropdown align={'end'}>
      <Dropdown.Toggle className="nav-link">
        <div className="nav-profile-img">
          <Image
            src={ImageSourceUtil.getUploadedImageSrc(sessionAuth?.user.image)}
            alt={sessionAuth?.user.name ?? ''}
            width={30}
            height={30}
            className="img-fluid"
          />
          <span className="availability-status online"></span>
        </div>
        <div className="nav-profile-text">
          <p className="mb-1">{sessionAuth?.user.name}</p>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="navbar-dropdown">
        <Dropdown.Item
          onClick={(evt) =>
            props.onClickDropdownItem(NavbarProfileDropdownItems.Profile)
          }
        >
          <i className="mdi mdi-account-circle me-2 text-primary"></i>
          {t('profile')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(evt) =>
            props.onClickDropdownItem(NavbarProfileDropdownItems.ChangePassword)
          }
        >
          <i className="mdi mdi-key me-2 text-primary"></i>
          {t('changePassword').toCapitalizeCase()}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            props.onClickDropdownItem(NavbarProfileDropdownItems.Lock)
          }
        >
          <i className="mdi mdi-lock me-2 text-primary"></i>
          {t('lock')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            props.onClickDropdownItem(NavbarProfileDropdownItems.SignOut)
          }
        >
          <i className="mdi mdi-logout me-2 text-primary"></i>
          {t('signOut')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
});

export default ComponentToolNavbarProfile;
