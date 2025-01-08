import { ActionDispatch, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import Image from 'next/image';
import {
  IPostAddAction,
  IPostAddComponentFormState,
  IPostAddComponentState,
} from '@pages/post/add';
import ComponentFieldSet from '@components/elements/fieldSet';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IUseFormReducer } from '@library/react/handles/form';

type IComponentState = {
  mainTabActiveKey: string;
};

const initialState: IComponentState = {
  mainTabActiveKey: 'general',
};

type IComponentProps = {
  state: IPostAddComponentState;
  dispatch: ActionDispatch<[action: IPostAddAction]>;
  formState: IPostAddComponentFormState;
  setFormState: IUseFormReducer<IPostAddComponentFormState>['setFormState'];
};

export default function ComponentPagePostAddBeforeAndAfter(
  props: IComponentProps
) {
  const [mainTabActiveKey, setMainTabActiveKey] = useState(
    initialState.mainTabActiveKey
  );

  const t = useAppSelector(selectTranslation);

  const TabGallery = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImage
            onSelected={(images) =>
              props.setFormState({
                ...props.formState,
                beforeAndAfter: {
                  ...props.formState.beforeAndAfter!,
                  images,
                },
              })
            }
            isMulti={true}
            selectedImages={props.formState.beforeAndAfter?.images}
            showModalButtonText={t('gallery')}
          />
        </div>
        <div className="col-md-12 mb-3">
          <div className="row">
            {props.formState.beforeAndAfter?.images.map((image) => (
              <div className="col-md-3 mb-3">
                <Image
                  src={ImageSourceUtil.getUploadedImageSrc(image)}
                  alt="Empty Image"
                  className="post-image img-fluid"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TabOptions = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFieldSet legend={t('imageBefore')}>
            <ComponentThemeChooseImage
              onSelected={(images) =>
                props.setFormState({
                  ...props.formState,
                  beforeAndAfter: {
                    ...props.formState.beforeAndAfter!,
                    imageBefore: images[0],
                  },
                })
              }
              isMulti={false}
              selectedImages={
                props.formState.beforeAndAfter?.imageBefore
                  ? [props.formState.beforeAndAfter.imageBefore]
                  : undefined
              }
              isShowReviewImage={true}
              reviewImage={props.formState.beforeAndAfter?.imageBefore}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFieldSet legend={t('imageAfter')}>
            <ComponentThemeChooseImage
              onSelected={(images) =>
                props.setFormState({
                  ...props.formState,
                  beforeAndAfter: {
                    ...props.formState.beforeAndAfter!,
                    imageAfter: images[0],
                  },
                })
              }
              isMulti={false}
              selectedImages={
                props.formState.beforeAndAfter?.imageAfter
                  ? [props.formState.beforeAndAfter.imageAfter]
                  : undefined
              }
              isShowReviewImage={true}
              reviewImage={props.formState.beforeAndAfter?.imageAfter}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
      </div>
    );
  };

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-header text-center pt-3">
          <h4>{t('beforeAndAfter')}</h4>
        </div>
        <div className="card-body">
          <div className="theme-tabs">
            <Tabs
              onSelect={(key: any) => setMainTabActiveKey(key)}
              activeKey={mainTabActiveKey}
              className="mb-5"
              transition={false}
            >
              <Tab eventKey="general" title={t('general')}>
                <TabOptions />
              </Tab>
              <Tab eventKey="gallery" title={t('gallery')}>
                <TabGallery />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
