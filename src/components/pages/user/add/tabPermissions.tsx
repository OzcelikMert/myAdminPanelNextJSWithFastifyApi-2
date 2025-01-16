import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import { VariableLibrary } from '@library/variable';
import { IPageUserAddFormState, IPageUserAddState } from '@pages/user/add';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentPageUserAddPermissionGroup from './permissionGroup';

type IComponentProps = {
  state: IPageUserAddState;
  form: UseFormReturn<IPageUserAddFormState>;
  onSelectAllPermissions: (isSelected: boolean) => void;
};

const ComponentPageUserAddTabPermissions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const formValues = props.form.getValues();

    return (
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentFormCheckBox
            title={t('selectAll')}
            checked={
              props.state.permissions.length === formValues.permissions.length
            }
            onChange={(e) => props.onSelectAllPermissions(e.target.checked)}
          />
        </div>
        {props.state.permissionGroups.map((item, index) => (
          <ComponentPageUserAddPermissionGroup
            key={`permission_group_${index}`}
            item={item}
            state={props.state}
            index={index}
          />
        ))}
      </div>
    );
  }
);

export default ComponentPageUserAddTabPermissions;
