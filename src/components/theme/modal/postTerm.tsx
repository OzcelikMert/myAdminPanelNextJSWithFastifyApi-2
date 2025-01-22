import React from 'react';
import { Modal } from 'react-bootstrap';
import { PostTermTypeId, postTermTypes } from '@constants/postTermTypes';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import PagePostTermAdd, {
  IPagePostTermAddFormState,
  IPagePostTermAddState,
} from '@pages/post/term/add';
import { PostTypeId } from '@constants/postTypes';

type IComponentProps = {
  _id?: string;
  postTypeId: PostTypeId;
  termTypeId: PostTermTypeId;
  isShow: boolean;
  items?: IPagePostTermAddState['items'];
  onHide: () => void;
  onSubmit: (item: IPagePostTermAddFormState) => void;
};

const ComponentThemeModalPostTerm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  const selectedTerm = postTermTypes.findSingle("id", props.termTypeId);

  return (
    <Modal className="form-modal" size="lg" centered show={props.isShow}>
      <Modal.Header className="border-bottom-0">
        <div className="w-100 text-end">
          <button
            className="btn btn-gradient-dark"
            onClick={() => props.onHide()}
          >
            <i className="fa fa-close"></i>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body className="m-0 p-0">
        <div className="card">
          <div className="card-body">
            <h4 className="text-center">{t(selectedTerm?.langKey ?? "[noLangAdd]")}</h4>
            <PagePostTermAdd
              _id={props._id}
              postTypeId={props.postTypeId}
              termTypeId={props.termTypeId}
              items={props.items}
              isModal
              onSubmit={(item) => props.onSubmit(item)}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default ComponentThemeModalPostTerm;
