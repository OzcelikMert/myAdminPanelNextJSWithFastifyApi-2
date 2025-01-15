import React from 'react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import dynamic from 'next/dynamic';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormContext } from 'react-hook-form';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  { ssr: false }
);

type IComponentState = {} & { [key: string]: any };

type IComponentProps = {
  data: Partial<IComponentElementModel>;
  index: number
};

export default function ComponentPageComponentElementTypeInput(
  props: IComponentProps
) {
  const contentInputName = `elements.${props.index}.contents.content`;
  const urlInputName = `elements.${props.index}.contents.url`;
  const t = useAppSelector(selectTranslation);
  const { register, formState: {errors}, setValue } = useFormContext();
  const registeredInputContent = register(contentInputName);
  const registeredInputURL = register(urlInputName);

  const onChangeContent = (text: string) => {
    setValue(contentInputName, text);
  }

  const TextArea = () => {
    return (
      <ComponentFormInput
        type={'textarea'}
        title={t('text')}
        name={contentInputName}
      />
    );
  };

  const RichText = () => {
    return (
      <ComponentThemeRichTextBox
        value={props.data.contents?.content ?? ''}
        onChange={(e) => onChangeContent(e)}
      />
    );
  };

  const Image = () => {
    return (
      <div>
        <ComponentThemeChooseImage
          onSelected={(images) => onChangeContent(images[0])}
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
          <ComponentFormInput
            type={'text'}
            title={t('text')}
            name={contentInputName}
          />
        </div>
        <div className="col-md-6 mt-3 mt-lg-0">
          <ComponentFormInput
            type={'text'}
            title={t('url')}
            name={urlInputName}
          />
        </div>
      </div>
    );
  };

  const Text = () => {
    return (
      <ComponentFormInput
        type={'text'}
        title={t('text')}
        name={contentInputName}
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
