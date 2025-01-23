import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeBadgeUserRole from '@components/theme/badge/userRole';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import { IPageProfileState } from '@pages/settings/profile';

type IComponentProps = {
  item?: IPageProfileState['item'];
};

const ComponentPageProfileMainInfo = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h6 className="pb-1 border-bottom fw-bold text-start">
            {t('general')}
          </h6>
          <div className="row">
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('email')}:
                <h6 className="d-inline-block ms-2">{props.item?.email}</h6>
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('role')}:
                <ComponentThemeBadgeUserRole
                  userRoleId={props.item!.roleId}
                  className="ms-2"
                />
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('status')}:
                <ComponentThemeBadgeStatus
                  statusId={props.item!.statusId}
                  className="ms-2"
                />
              </span>
            </div>
            <div className="col-sm-12 pb-2 pt-2">
              <span className="mb-2 fw-bold">
                {t('createdDate')}:
                <h6 className="d-inline-block ms-2">
                  {new Date(props.item?.createdAt || '').toLocaleString()}
                </h6>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageProfileMainInfo;
