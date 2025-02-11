import React from 'react';
import { Modal } from 'react-bootstrap';
import PageGalleryList from '@pages/gallery/list';
import PageGalleryUpload from '@pages/gallery/upload';
import { IGalleryGetResultService } from 'types/services/gallery.service';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeTabs from '@components/theme/tabs';
import ComponentThemeTab from '@components/theme/tabs/tab';

type IComponentState = {
  formActiveKey: string;
  uploadedImages: IGalleryGetResultService[];
};

const initialState: IComponentState = {
  formActiveKey: 'list',
  uploadedImages: [],
};

type IComponentProps = {
  onClose: () => void;
  isShow: boolean;
  onSubmit: (images: string[]) => void;
  isMulti?: boolean;
  selectedImages?: string[];
};

const ComponentThemeChooseImageGallery = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [formActiveKey, setFormActiveKey] = React.useState(
      initialState.formActiveKey
    );
    const [uploadedImages, setUploadedImages] = React.useState(
      initialState.uploadedImages
    );

    return (
      <Modal
        size="xl"
        centered
        fullscreen
        show={props.isShow}
        backdrop={true}
        onHide={() => {
          props.onClose();
        }}
      >
        <Modal.Header className="border-bottom-0">
          <div className="w-100 text-end">
            <button
              className="btn btn-gradient-dark"
              onClick={() => {
                props.onClose();
              }}
            >
              <i className="fa fa-close"></i>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="m-0 p-0">
          <div className="card">
            <div className="card-body">
              <ComponentThemeTabs
                onSelect={(key: any) => setFormActiveKey(key)}
                activeKey={formActiveKey}
              >
                <ComponentThemeTab eventKey="upload" title={t('upload')}>
                  <PageGalleryUpload
                    onUploadImages={(images) => setUploadedImages(images)}
                    isModal
                  />
                </ComponentThemeTab>
                <ComponentThemeTab eventKey="list" title={t('list')}>
                  <PageGalleryList
                    isModal={true}
                    isMulti={props.isMulti}
                    onSubmit={(images) => props.onSubmit(images)}
                    selectedImages={props.selectedImages}
                    uploadedImages={uploadedImages}
                  />
                </ComponentThemeTab>
              </ComponentThemeTabs>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);

export default ComponentThemeChooseImageGallery;
