import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { ISettingContactFormModel } from 'types/models/setting.model';
import ComponentThemeFormInputSwitch from '@components/theme/form/inputs/switch';

type IComponentProps = {
  item: ISettingContactFormModel;
  index: number;
  showEditAndDeleteButton?: boolean;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
};

const ComponentPageSettingsContactFormsItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className={`col-md-12 ${props.index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet
          legend={`${props.item.title} (#${props.item.key})`}
          legendElement={
            props.showEditAndDeleteButton ? (
              <span>
                <i
                  className="mdi mdi-pencil-box text-warning fs-1 cursor-pointer ms-2"
                  onClick={() => props.onEdit && props.onEdit(props.item._id)}
                ></i>
                <i
                  className="mdi mdi-minus-box text-danger fs-1 cursor-pointer ms-2"
                  onClick={() =>
                    props.onDelete && props.onDelete(props.item._id)
                  }
                ></i>
              </span>
            ) : undefined
          }
        >
          <div className="row">
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="text"
                name={`contactForms.${props.index}.name`}
                title={t('name')}
              />
            </div>
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="email"
                name={`contactForms.${props.index}.targetEmail`}
                title={t('targetEmail')}
              />
            </div>
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="email"
                name={`contactForms.${props.index}.email`}
                title={t('email')}
              />
            </div>
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="password"
                name={`contactForms.${props.index}.password`}
                title={t('password')}
              />
            </div>
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="text"
                name={`contactForms.${props.index}.host`}
                title={t('host')}
              />
            </div>
            <div className="col-md-12">
              <ComponentThemeFormInput
                type="number"
                name={`contactForms.${props.index}.port`}
                title={t('port')}
              />
            </div>
            <div className="col-md-7">
              <ComponentThemeFormInputSwitch
                title={t('hasSSL')}
                name={`contactForms.${props.index}.hasSSL`}
              />
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  }
);

export default ComponentPageSettingsContactFormsItem;
