import React, { Component } from 'react';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import PageGalleryList from '@pages/gallery/list';
import PageGalleryUpload from '@pages/gallery/upload';
import { IGalleryGetResultService } from 'types/services/gallery.service';

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

export default function ComponentThemeChooseImageGallery(props: IComponentProps) {
  const [formActiveKey, setFormActiveKey] = React.useState(initialState.formActiveKey);
  const [uploadedImages, setUploadedImages] = React.useState(initialState.uploadedImages);

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
            <div className="theme-tabs">
              <Tabs
                onSelect={(key: any) => setFormActiveKey(key)}
                activeKey={formActiveKey}
                className="mb-5"
                transition={false}
              >
                <Tab eventKey="upload" title={'Upload'}>
                  <PageGalleryUpload
                    uploadedImages={(uploadedImages) => setUploadedImages(uploadedImages)}
                    isModal
                  />
                </Tab>
                <Tab eventKey="list" title={'List'}>
                  <PageGalleryList
                    isModal={true}
                    uploadedImages={uploadedImages}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
