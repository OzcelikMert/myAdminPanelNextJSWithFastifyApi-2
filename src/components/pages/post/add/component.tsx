import React, { ActionDispatch, Component } from 'react';
import { EndPoints } from '@constants/endPoints';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import {
  IPostAddAction,
  IPostAddComponentFormState,
  IPostAddComponentState,
} from '@pages/post/add';
import { IUseFormReducer } from '@library/react/handles/form';
import ComponentFormSelect from '@components/elements/form/input/select';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  state: IPostAddComponentState;
  dispatch: ActionDispatch<[action: IPostAddAction]>;
  formState: IPostAddComponentFormState;
  setFormState: IUseFormReducer<IPostAddComponentFormState>['setFormState'];
};

export default function ComponentPagePostAddComponent(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const onChangeSelect = (value: string, index: number) => {
    let components = props.formState.components ?? [];
    components[index] = value;
    props.setFormState({
      components,
    });
  };

  const onAddNew = () => {
    let components = props.formState.components ?? [];
    components.push('');
    props.setFormState({
      components,
    });
  };

  const onDelete = (index: number) => {
    let components = props.formState.components ?? [];
    components.remove(index);
    props.setFormState({
      components,
    });
  };

  const Component = (_id: string, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <div className="row">
          <div className="col-md-9">
            <ComponentFormSelect
              title={t('component')}
              options={props.state.components}
              value={props.state.components?.filter(
                (item) => item.value == _id
              )}
              onChange={(item: any, e) => onChangeSelect(item.value, index)}
            />
          </div>
          <div className="col-md-3 mt-2">
            <div className="row">
              <div className="col-6">
                {_id &&
                PermissionUtil.check(
                  sessionAuth!,
                  ComponentEndPointPermission.UPDATE
                ) ? (
                  <a
                    href={EndPoints.COMPONENT_WITH.EDIT(_id)}
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
                  onClick={(event) => onDelete(index)}
                >
                  <i className="mdi mdi-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                {props.formState.components?.map((componentId, index) => {
                  return Component(componentId, index);
                })}
                <div
                  className={`col-md-7 text-start ${(props.formState.components?.length ?? 0) > 0 ? 'mt-4' : ''}`}
                >
                  <button
                    type={'button'}
                    className="btn btn-gradient-success btn-lg"
                    onClick={() => onAddNew()}
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
}
