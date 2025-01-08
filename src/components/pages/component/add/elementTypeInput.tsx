import React from 'react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import dynamic from 'next/dynamic';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import ComponentFormType from '@components/elements/form/input/type';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  { ssr: false }
);

type IComponentState = {} & { [key: string]: any };

type IComponentProps = {
  data: Partial<IComponentElementModel>;
  onChange: (key: string, value: any) => void;
};

export default function ComponentPageComponentElementTypeInput(
  props: IComponentProps
) {
  const t = useAppSelector(selectTranslation);

  const TextArea = () => {
    return (
      <ComponentFormType
        type={'textarea'}
        title={t('text')}
        value={props.data.contents?.content}
        onChange={(e) => props.onChange('content', e.target.value)}
      />
    );
  };

  const RichText = () => {
    return (
      <ComponentThemeRichTextBox
        value={props.data.contents?.content ?? ''}
        onChange={(e) => props.onChange('content', e)}
      />
    );
  };

  const Image = () => {
    return (
      <div>
        <ComponentThemeChooseImage
          onSelected={(images) => props.onChange('content', images[0])}
          isMulti={false}
          isShowReviewImage={true}
          reviewImage={props.data.contents?.content}
          reviewImageClassName={'post-image'}
        />
      </div>
    );
  };

  const Button = () => {
    return (
      <div className="row">
        <div className="col-md-6">
          <ComponentFormType
            type={'text'}
            title={t('text')}
            value={props.data.contents?.content}
            onChange={(e) => props.onChange('content', e.target.value)}
          />
        </div>
        <div className="col-md-6 mt-3 mt-lg-0">
          <ComponentFormType
            type={'text'}
            title={t('url')}
            value={props.data.contents?.url || ''}
            onChange={(e) => props.onChange('url', e.target.value)}
          />
        </div>
      </div>
    );
  };

  const Text = () => {
    return (
      <ComponentFormType
        type={'text'}
        title={t('text')}
        value={props.data.contents?.content}
        onChange={(e) => props.onChange('content', e.target.value)}
      />
    );
  };

  switch (props.data.typeId) {
    case ElementTypeId.TextArea:
      return <TextArea />;
    case ElementTypeId.Image:
      return <Image />;
    case ElementTypeId.Button:
      return <Button />;
    case ElementTypeId.RichText:
      return <RichText />;
  }
  return <Text />;
}
