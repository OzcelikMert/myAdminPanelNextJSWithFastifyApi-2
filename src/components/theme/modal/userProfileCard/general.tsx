import React from 'react';
import { IUserModel } from 'types/models/user.model';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeBadgeUserRole from '@components/theme/badge/userRole';
import { StatusId } from '@constants/status';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  userInfo: IUserModel;
};

const ComponentThemeUserProfileCardGeneral = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="general">
      <h6 className="pb-1 border-bottom fw-bold text-end">{t('general')}</h6>
      <div className="row">
        <div className="col-sm-12 mb-3">
          <span className="fw-bold">
            {t('email')}:
            <h6 className="text-muted d-inline-block ms-1">
              {props.userInfo.email}
            </h6>
          </span>
        </div>
        <div className="col-sm-12 mb-3">
          <span className="fw-bold">
            {t('phone')}:
            <h6 className="text-muted d-inline-block ms-1">
              {props.userInfo.phone || '---'}
            </h6>
          </span>
        </div>
        <div className="col-sm-12 mb-3">
          <span className="fw-bold">
            {t('role')}:
            <ComponentThemeBadgeUserRole
              userRoleId={props.userInfo.roleId}
              className="ms-1"
            />
          </span>
        </div>
        <div className="col-sm-12 mb-3">
          <span className="fw-bold">
            {t('status')}:
            {
              <ComponentThemeBadgeStatus
                statusId={props.userInfo.statusId}
                className="ms-1"
              />
            }
          </span>
        </div>
        {props.userInfo.statusId == StatusId.Banned ? (
          <div className="col-sm-12 mb-3">
            <div className="row">
              <div className="col-sm-12 mb-3">
                <p className="fw-bold">
                  {t('banDateEnd')}:
                  <h6 className="text-muted d-inline-block ms-1">
                    {new Date(
                      props.userInfo.banDateEnd || ''
                    ).toLocaleDateString() || ''}
                  </h6>
                </p>
              </div>
              <div className="col-sm-12 mb-3">
                <p className="fw-bold">
                  {t('banComment')}:
                  <h6 className="text-muted d-inline-block ms-1">
                    {props.userInfo.banComment || '---'}
                  </h6>
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="col-sm-12">
          <span className="fw-bold">
            {t('comment')}:
            <small className="fw-bold ms-1 text-muted">
              {props.userInfo.comment || '---'}
            </small>
          </span>
        </div>
      </div>
    </div>
  );
});

export default ComponentThemeUserProfileCardGeneral;
