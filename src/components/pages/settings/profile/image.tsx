import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { IPageProfileState } from '@pages/settings/profile';
import ComponentThemeChooseImage from '@components/theme/chooseImage';

type IComponentProps = {
  isLoading?: IPageProfileState["isImageChanging"];
  image?: string
  onChange: (image: string) => void;
};

const ComponentPageProfileImage = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            {props.isLoading ? (
              <ComponentSpinnerDonut customClass="profile-image-spinner" />
            ) : (
              <ComponentThemeChooseImage
                onSelected={(images) => props.onChange(images[0])}
                isMulti={false}
                isShowReviewImage={true}
                reviewImage={props.image}
                reviewImageClassName={'post-image'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    );
  }
);

export default ComponentPageProfileImage;
