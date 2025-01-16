import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import Image from 'next/image';
import {
  IPageLanguageAddFormState,
  IPageLanguageAddState,
} from '@pages/language/add';
import { ImageSourceUtil } from '@utils/imageSource.util';

type IComponentProps = {
  state: IPageLanguageAddState;
  form: UseFormReturn<IPageLanguageAddFormState>;
};

const ComponentPageLanguageAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const formValues = props.form.getValues();

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-1 m-auto">
              <Image
                src={ImageSourceUtil.getUploadedFlagSrc(formValues.image)}
                alt={formValues.image}
                className="img-fluid img-sm"
                width={100}
                height={75}
              />
            </div>
            <div className="col-11">
              <ComponentFormSelect
                title={t('image')}
                name="image"
                options={props.state.flags}
                value={props.state.flags.findSingle(
                  'value',
                  formValues.image || ''
                )}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('title')}*`}
            name="title"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('shortKey')}*`}
            name="shortKey"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('locale')}*`}
            name="locale"
            type="text"
            required={true}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabGeneral;
