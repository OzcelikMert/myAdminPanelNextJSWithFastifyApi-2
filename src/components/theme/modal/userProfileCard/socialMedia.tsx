import React from 'react';
import { IUserModel } from 'types/models/user.model';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  userInfo: IUserModel;
};

const ComponentThemeUserProfileCardSocialMedia = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <ul className="social-link list-unstyled">
        <li>
          <a href={props.userInfo.facebook} target="_blank" rel="noreferrer">
            <i className="mdi mdi-facebook"></i>
          </a>
        </li>
        <li>
          <a href={props.userInfo.twitter} target="_blank" rel="noreferrer">
            <i className="mdi mdi-twitter"></i>
          </a>
        </li>
        <li>
          <a href={props.userInfo.instagram} target="_blank" rel="noreferrer">
            <i className="mdi mdi-instagram"></i>
          </a>
        </li>
      </ul>
    );
  }
);

export default ComponentThemeUserProfileCardSocialMedia;
