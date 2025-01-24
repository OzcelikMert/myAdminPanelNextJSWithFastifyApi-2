import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ComponentToolNavbarNotifications = React.memo(() => {
  return (
    <Dropdown align={'end'}>
      <Dropdown.Toggle className="nav-link count-indicator">
        <i className="mdi mdi-bell-outline"></i>
        <span className="count-symbol bg-danger"></span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
        <h6 className="p-3 mb-0">Notifications</h6>
        <div className="dropdown-divider"></div>
        <Dropdown.Item
          className="dropdown-item preview-item"
          onClick={(evt) => evt.preventDefault()}
        >
          <div className="preview-thumbnail">
            <div className="preview-icon bg-success">
              <i className="mdi mdi-calendar"></i>
            </div>
          </div>
          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
            <h6 className="preview-subject font-weight-normal mb-1">
              Event today
            </h6>
            <p className="text-gray ellipsis mb-0">
              Just a reminder that you have an event today
            </p>
          </div>
        </Dropdown.Item>
        <div className="dropdown-divider"></div>
        <Dropdown.Item
          className="dropdown-item preview-item"
          onClick={(evt) => evt.preventDefault()}
        >
          <div className="preview-thumbnail">
            <div className="preview-icon bg-warning">
              <i className="mdi mdi-settings"></i>
            </div>
          </div>
          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
            <h6 className="preview-subject font-weight-normal mb-1">
              Settings
            </h6>
            <p className="text-gray ellipsis mb-0">Update dashboard</p>
          </div>
        </Dropdown.Item>
        <div className="dropdown-divider"></div>
        <Dropdown.Item
          className="dropdown-item preview-item"
          onClick={(evt) => evt.preventDefault()}
        >
          <div className="preview-thumbnail">
            <div className="preview-icon bg-info">
              <i className="mdi mdi-link-variant"></i>
            </div>
          </div>
          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
            <h6 className="preview-subject font-weight-normal mb-1">
              Launch Admin
            </h6>
            <p className="text-gray ellipsis mb-0">New admin wow!</p>
          </div>
        </Dropdown.Item>
        <div className="dropdown-divider"></div>
        <h6 className="p-3 mb-0 text-center cursor-pointer">
          See all notifications
        </h6>
      </Dropdown.Menu>
    </Dropdown>
  );
});

export default ComponentToolNavbarNotifications;
