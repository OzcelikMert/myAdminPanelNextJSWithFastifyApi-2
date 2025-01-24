import React from 'react';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPagePostAddState } from '@pages/post/add';
import ComponentPagePostAddComponentsItem from './componentsItem';

type IComponentProps = {
  components?: IPagePostAddState['components'];
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddComponents = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

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
                  <ComponentPagePostAddComponentsItem
                    _id={_id.value}
                    index={index}
                    showEditButton={PermissionUtil.check(
                      sessionAuth!,
                      ComponentEndPointPermission.UPDATE
                    )}
                    onClickAddNew={() => props.onClickAddNew()}
                    onClickDelete={(_id) => props.onClickDelete(_id)}
                  />
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
