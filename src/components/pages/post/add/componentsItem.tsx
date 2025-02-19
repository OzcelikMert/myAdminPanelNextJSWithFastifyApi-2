import React from 'react';
import { EndPoints } from '@constants/endPoints';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPagePostAddState } from '@pages/post/add';
import Link from 'next/link';

type IComponentProps = {
  components?: IPagePostAddState['components'];
  item: string;
  index: number;
  showEditButton?: boolean;
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddComponentsItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className={`col-md-12 ${props.index > 0 ? 'mt-3' : ''}`}>
        <div className="row">
          <div className="col-md-9">
            <ComponentThemeFormInputSelect
              title={t('component')}
              name={`components.${props.index}`}
              options={props.components}
              watch
            />
          </div>
          <div className="col-md-3 mt-2 mt-md-0 align-content-center">
            <div className="row">
              <div className="col-6">
                {props.showEditButton ? (
                  <Link
                    href={EndPoints.COMPONENT_WITH.EDIT(props.item)}
                    target="_blank"
                    className="btn btn-gradient-warning btn-lg"
                    referrerPolicy="no-referrer"
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </Link>
                ) : null}
              </div>
              <div className="col-6 text-end">
                <button
                  type="button"
                  className="btn btn-gradient-danger btn-lg"
                  onClick={(event) => props.onClickDelete(props.item)}
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
