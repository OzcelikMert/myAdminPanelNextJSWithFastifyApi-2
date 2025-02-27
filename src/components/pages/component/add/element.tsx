import React from 'react';
import { useAppSelector } from '@redux/hooks';
import ComponentFieldSet from '@components/elements/fieldSet';
import { IComponentGetResultServiceElement } from 'types/services/component.service';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import ComponentPageComponentAddElementTypeInput from './elementTypeInput';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import ComponentThemeToolTipFormFieldErrors from '@components/theme/tooltip/formFieldErrors';

type IComponentProps = {
  item: IComponentGetResultServiceElement;
  index: number;
  onEdit: (_id: string) => void;
  onDelete: (_id: string) => void;
};

const ComponentPageComponentAddElement = React.memo(
  (props: IComponentProps) => {
    const sessionAuth = useAppSelector((state) => state.sessionState.auth);

    return (
      <div className={`col-md-12 ${props.index > 0 ? 'mt-3' : ''}`}>
        <ComponentFieldSet
          legend={`${props.item.title} ${PermissionUtil.checkPermissionRoleRank(sessionAuth!.user.roleId, UserRoleId.SuperAdmin) ? `(#${props.item.key})` : ''}`}
          legendElement={
            PermissionUtil.checkPermissionRoleRank(
              sessionAuth!.user.roleId,
              UserRoleId.SuperAdmin
            ) ? (
              <span>
                <i
                  className="mdi mdi-pencil-box text-warning fs-1 cursor-pointer ms-2"
                  onClick={() => props.onEdit(props.item._id)}
                ></i>
                <i
                  className="mdi mdi-minus-box text-danger fs-1 cursor-pointer ms-2"
                  onClick={() => props.onDelete(props.item._id)}
                ></i>
              </span>
            ) : undefined
          }
        >
          <div className="row">
            <div className="col-md">
              <ComponentPageComponentAddElementTypeInput
                data={props.item}
                index={props.index}
              />
            </div>
            {
              <ComponentThemeToolTipFormFieldErrors
                className="col-md-1 align-content-center"
                keys={[`elements.${props.index}`]}
                hideFieldTitles
              />
            }
            {
              <ComponentThemeToolTipMissingLanguages
                alternates={props.item.alternates ?? []}
                div={true}
                divClass="col-md-1 align-content-center"
              />
            }
          </div>
        </ComponentFieldSet>
      </div>
    );
  }
);

export default ComponentPageComponentAddElement;
