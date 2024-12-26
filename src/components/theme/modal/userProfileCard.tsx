import { Modal } from 'react-bootstrap';
import { IUserModel } from 'types/models/user.model';
import Image from 'next/image';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeBadgeUserRole from '@components/theme/badge/userRole';
import { StatusId } from '@constants/status';
import { IPermissionGroup } from 'types/constants/permissionGroups';
import { permissions } from '@constants/permissions';
import { permissionGroups } from '@constants/permissionGroups';
import { IPermission } from 'types/constants/permissions';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { PermissionUtil } from '@utils/permission.util';
import { useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import ComponentFieldSet from '@components/elements/fieldSet';

type IComponentProps = {
  isShow: boolean;
  onClose: any;
  userInfo: IUserModel;
};

export default function ComponentThemeUsersProfileCard(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const SocialMedia = () => (
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

  const General = () => (
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

  const Permissions = () => {
    const foundPermissions = permissions.findMulti(
      'id',
      props.userInfo.permissions
    );
    let foundPermissionGroups = permissionGroups.findMulti(
      'id',
      foundPermissions.map((permission) => permission.groupId)
    );
    foundPermissionGroups = foundPermissionGroups.filter(
      (group, index) =>
        foundPermissionGroups.indexOfKey('id', group.id) === index
    );

    const PermissionGroup = (props: IPermissionGroup) => (
      <div className="col-md-12 mt-3">
        <ComponentFieldSet legend={t(props.langKey)}>
          <div className="row">
            {foundPermissions
              .findMulti('groupId', props.id)
              .map((permission) => (
                <PermissionItem {...permission} />
              ))}
          </div>
        </ComponentFieldSet>
      </div>
    );

    const PermissionItem = (props: IPermission) => (
      <div className="col-3 mt-2">
        <label className="badge badge-outline-info ms-1 mb-1">
          {t(props.langKey)}
        </label>
      </div>
    );

    return (
      <div className="permissions">
        <h6 className="pb-1 border-bottom fw-bold text-end">
          {t('permissions')}
        </h6>
        <div className="row">
          {foundPermissionGroups.orderBy('rank', 'asc').map((group) => (
            <PermissionGroup {...group} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      size="lg"
      centered
      show={props.isShow}
      backdrop={true}
      onHide={props.onClose}
    >
      <Modal.Body className="m-0 p-0">
        <div className="card user-card">
          <div className="row ms-0 me-0 user-card-body">
            <div className="col-sm-4 user-profile bg-gradient-primary">
              <h5 className="exit-icon" onClick={props.onClose}>
                <i className="mdi mdi-close"></i>
              </h5>
              <div className="card-block text-center text-light mt-5">
                <div className="mb-4">
                  <Image
                    src={ImageSourceUtil.getUploadedImageSrc(
                      props.userInfo.image
                    )}
                    className="user-img img-fluid"
                    alt={props.userInfo.name}
                    width={100}
                    height={100}
                  />
                </div>
                <h4 className="fw-bold pt-3">{props.userInfo.name}</h4>
                <SocialMedia />
              </div>
            </div>
            <div className="col-sm-8 position-relative card-profile-title">
              <div className="p-2">
                <General />
                {PermissionUtil.checkPermissionRoleRank(
                  sessionAuth!.user.roleId,
                  props.userInfo.roleId,
                  true
                ) ? (
                  <Permissions />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
