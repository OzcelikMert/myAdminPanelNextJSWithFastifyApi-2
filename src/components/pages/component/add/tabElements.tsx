import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import {
  IPageComponentAddFormState,
  IPageComponentAddState,
} from '@pages/component/add';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import ComponentPageComponentAddElement from './element';

type IComponentProps = {
  state: IPageComponentAddState;
  form: UseFormReturn<IPageComponentAddFormState>;
  onCreateNewElement: () => void
  onEdit: (_id: string) => void;
  onDelete: (_id: string) => void;
};

const ComponentPageComponentAddTabElements = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const sessionAuth = useAppSelector((state) => state.sessionState.auth);

    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <div className="row">
            {props.form
              .getValues()
              .elements?.orderBy('rank', 'asc')
              .map((item, index) => <ComponentPageComponentAddElement 
                index={index}
                item={item}
                onDelete={(_id) => props.onDelete(_id)}
                onEdit={(_id) => props.onEdit(_id)}
              />)}
          </div>
        </div>
        {PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.SuperAdmin
        ) ? (
          <div
            className={`col-md-7 text-start ${props.form.getValues().elements.length > 0 ? 'mt-4' : ''}`}
          >
            <button
              type={'button'}
              className="btn btn-gradient-success btn-lg"
              onClick={() => props.onCreateNewElement()}
            >
              + {t('addNew')}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);

export default ComponentPageComponentAddTabElements;
