import React from 'react';
import { EndPoints } from '@constants/endPoints';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPagePostAddState } from '@pages/post/add';

type IComponentProps = {
  components?: IPagePostAddState['components'];
  _id: string;
  index: number;
  showEditButton?: boolean;
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddComponentsItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className={`col-md-12 ${props.index > 0 ? 'mt-5' : ''}`}>
        <div className="row">
          <div className="col-md-9">
            <ComponentFormInputSelect
              title={t('component')}
              name={`components.${props.index}`}
              options={props.components}
              value={props.components?.filter(
                (item) => item.value == props._id
              )}
            />
          </div>
          <div className="col-md-3 mt-2">
            <div className="row">
              <div className="col-6">
                {props.showEditButton ? (
                  <a
                    href={EndPoints.COMPONENT_WITH.EDIT(props._id)}
                    target="_blank"
                    className="btn btn-gradient-warning btn-lg"
                    rel="noreferrer"
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </a>
                ) : null}
              </div>
              <div className="col-6 text-end">
                <button
                  type="button"
                  className="btn btn-gradient-danger btn-lg"
                  onClick={(event) => props.onClickDelete(props._id)}
                >
                  <i className="mdi mdi-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddComponentsItem;
