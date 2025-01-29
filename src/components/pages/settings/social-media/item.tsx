import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { ISettingSocialMediaModel } from 'types/models/setting.model';

type IComponentProps = {
  item: ISettingSocialMediaModel;
  index: number;
  showEditAndDeleteButton?: boolean;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
};

const ComponentPageSettingsSocialMediaItem = React.memo(
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
            <div className="col-md-12 mt-4">
              <ComponentFormInput
                type="text"
                name={`socialMedia.${props.index}.url`}
                title={t('url')}
              />
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  }
);

export default ComponentPageSettingsSocialMediaItem;
