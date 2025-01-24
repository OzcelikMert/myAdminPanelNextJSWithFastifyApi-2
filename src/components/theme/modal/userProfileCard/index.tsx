import { Modal } from 'react-bootstrap';
import { IUserModel } from 'types/models/user.model';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { PermissionUtil } from '@utils/permission.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import React from 'react';
import ComponentThemeUserProfileCardSocialMedia from './socialMedia';
import ComponentThemeUserProfileCardGeneral from './general';
import ComponentThemeUserProfileCardPermissions from './permissions';

type IComponentProps = {
  isShow: boolean;
  onClose: any;
  userInfo: IUserModel;
};

const ComponentThemeUserProfileCard = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

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
                <ComponentThemeUserProfileCardSocialMedia
                  userInfo={props.userInfo}
                />
              </div>
            </div>
            <div className="col-sm-8 position-relative card-profile-title">
              <div className="p-2">
                <ComponentThemeUserProfileCardGeneral
                  userInfo={props.userInfo}
                />
                {PermissionUtil.checkPermissionRoleRank(
                  sessionAuth!.user.roleId,
                  props.userInfo.roleId,
                  true
                ) ? (
                  <ComponentThemeUserProfileCardPermissions
                    userInfo={props.userInfo}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default ComponentThemeUserProfileCard;
