import React from 'react';
import { EndPoints } from '@constants/endPoints';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import ComponentFormSelect from '@components/elements/form/input/select';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPagePostAddState } from '@pages/post/add';

type IComponentProps = {
  components?: IPagePostAddState['components'];
  selectedComponents?: string[];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddComponents = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const Component = React.memo(
    (componentProps: { _id: string; index: number }) => {
      return (
        <div className={`col-md-12 ${componentProps.index > 0 ? 'mt-5' : ''}`}>
          <div className="row">
            <div className="col-md-9">
              <ComponentFormSelect
                title={t('component')}
                name={`components.${componentProps.index}`}
                options={props.components}
                value={props.components?.filter(
                  (item) => item.value == componentProps._id
                )}
              />
            </div>
            <div className="col-md-3 mt-2">
              <div className="row">
                <div className="col-6">
                  {componentProps._id &&
                  PermissionUtil.check(
                    sessionAuth!,
                    ComponentEndPointPermission.UPDATE
                  ) ? (
                    <a
                      href={EndPoints.COMPONENT_WITH.EDIT(componentProps._id)}
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
                    onClick={(event) => props.onClickDelete(componentProps._id)}
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

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-header text-center pt-3">
          <h4>{t('components')}</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 mt-2">
              <div className="row">
                {props.components?.map((_id, index) => (
                  <Component _id={_id.value} index={index} />
                ))}
                <div
                  className={`col-md-7 text-start ${(props.components?.length ?? 0) > 0 ? 'mt-4' : ''}`}
                >
                  <button
                    type={'button'}
                    className="btn btn-gradient-success btn-lg"
                    onClick={() => props.onClickAddNew()}
                  >
                    + {t('addNew')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostAddComponents;
