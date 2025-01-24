import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

const ComponentToolNavbarMessages = React.memo(() => {
  const t = useAppSelector(selectTranslation);

  return (
    <Dropdown align={'end'}>
      <Dropdown.Toggle className="nav-link count-indicator">
        <i className="mdi mdi-email-outline"></i>
        {
          //<span className="count-symbol bg-warning"></span>
        }
      </Dropdown.Toggle>

      <Dropdown.Menu className="preview-list navbar-dropdown">
        <h6 className="p-3 mb-0">{t('messages')}</h6>
        <div className="dropdown-divider"></div>
        {/* <Dropdown.Item className="dropdown-item preview-item"
                                   onClick={evt => evt.preventDefault()}>
                        <div className="preview-thumbnail">
                            <img src={require("../../../../assets/images/faces/face4.jpg")} alt="user"
                                 className="profile-pic"/>
                        </div>
                        <div
                            className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                            <h6 className="preview-subject ellipsis mb-1 font-weight-normal"><Trans>Mark
                                send you a message</Trans></h6>
                            <p className="text-gray mb-0">
                                1 <Trans>Minutes ago</Trans>
                            </p>
                        </div>
                    </Dropdown.Item>
                    <div className="dropdown-divider"></div> */}
      </Dropdown.Menu>
    </Dropdown>
  );
});

export default ComponentToolNavbarMessages;
