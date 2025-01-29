import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeChooseImageForm from '@components/theme/chooseImage/form';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';

const Item = React.memo((imageProps: { item: string; index: number }) => {
  return (
    <div className="col-md-3 mb-3">
      <Image
        src={ImageSourceUtil.getUploadedImageSrc(imageProps.item)}
        alt={imageProps.item}
        className="post-image img-fluid"
        layout="responsive"
        objectFit="contain"
        width={0}
        height={0}
      />
    </div>
  );
});

type IComponentProps = {
  images?: string[];
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabGallery = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImageForm
            name={
              props.isECommerceVariation
                ? `eCommerce.variations.${props.index}.itemId.eCommerce.images`
                : `eCommerce.images`
            }
            isMulti={true}
            showModalButtonText={t('selectImages')}
          />
        </div>
        <div className="col-md-12 mb-3">
          <div className="row">
            {props.images?.map((item, index) => (
              <Item item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabGallery;
