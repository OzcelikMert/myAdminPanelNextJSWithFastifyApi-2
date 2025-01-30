import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import Image from 'next/image';
import { IPageLanguageAddState } from '@pages/language/add';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  flags: IPageLanguageAddState['flags'];
  image: string;
};

const ComponentPageLanguageAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-1 m-auto">
              <Image
                src={ImageSourceUtil.getUploadedFlagSrc(props.image)}
                alt={props.image}
                className="img-fluid img-sm"
                width={100}
                height={75}
              />
            </div>
            <div className="col-11">
              <ComponentFormInputSelect
                title={t('image')}
                name="image"
                options={props.flags}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('title')}*`}
            name="title"
            type="text"
            i18={{
              setErrorText: (errorCode) =>
                t(I18Util.getFormInputErrorText(errorCode), [t('title')]),
            }}
            required
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('shortKey')}*`}
            name="shortKey"
            type="text"
            i18={{
              setErrorText: (errorCode) =>
                t(I18Util.getFormInputErrorText(errorCode), [t('shortKey')]),
            }}
            required
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('locale')}*`}
            name="locale"
            type="text"
            i18={{
              setErrorText: (errorCode) =>
                t(I18Util.getFormInputErrorText(errorCode), [t('locale')]),
            }}
            required
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabGeneral;
