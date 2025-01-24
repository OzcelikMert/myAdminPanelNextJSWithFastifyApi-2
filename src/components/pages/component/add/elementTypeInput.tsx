import React from 'react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import dynamic from 'next/dynamic';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import ComponentFormInput, { IComponentFormInputProps } from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormContext } from 'react-hook-form';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  { ssr: false }
);

const TextArea = React.memo((props: IComponentFormInputProps) => {
  return (
    <ComponentFormInput
      type={'textarea'}
      {...props}
    />
  );
});

const RichText = React.memo((props: {value: string, onChange: (newValue: string) => void}) => {
  return (
    <ComponentThemeRichTextBox
      value={props.value}
      onChange={(e) => props.onChange(e)}
    />
  );
});

const Image = React.memo((props: {value: string, onChange: (newValue: string) => void}) => {
  return (
    <div>
      <ComponentThemeChooseImage
        onSelected={(images) => props.onChange(images[0])}
        isMulti={false}
        isShowReviewImage={true}
        reviewImage={props.value}
        reviewImageClassName={'post-image'}
      />
    </div>
  );
});

const Button = React.memo((props: {text: IComponentFormInputProps, url: IComponentFormInputProps}) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <ComponentFormInput
          type={'text'}
          {...props.text}
        />
      </div>
      <div className="col-md-6 mt-3 mt-lg-0">
        <ComponentFormInput
          type={'text'}
          {...props.url}
        />
      </div>
    </div>
  );
});

const Text = React.memo((props: IComponentFormInputProps) => {
  return (
    <ComponentFormInput
      type={'text'}
      {...props}
    />
  );
});

type IComponentProps = {
  data: Partial<IComponentElementModel>;
  index: number;
};

const ComponentPageComponentAddElementTypeInput = React.memo(
  (props: IComponentProps) => {
    const contentInputName = `elements.${props.index}.contents.content`;
    const urlInputName = `elements.${props.index}.contents.url`;
    const t = useAppSelector(selectTranslation);
    const form = useFormContext();
    const registeredInputContent = form.register(contentInputName);
    const registeredInputURL = form.register(urlInputName);

    const onChangeContent = (text: string) => {
      form.setValue(contentInputName, text);
    };

    switch (props.data.typeId) {
      case ElementTypeId.TextArea:
        return <TextArea title={t('text')} {...registeredInputContent} />;
      case ElementTypeId.Image:
        return <Image value={props.data.contents?.content ?? ""} onChange={newValue => onChangeContent(newValue)} />;
      case ElementTypeId.Button:
        return <Button text={{title: t('text'), ...registeredInputContent}} url={{title: t('url'), ...registeredInputURL}} />;
      case ElementTypeId.RichText:
        return <RichText value={props.data.contents?.content ?? ""} onChange={newValue => onChangeContent(newValue)} />;
      default:
        return <Text title={t('text')} {...registeredInputContent} />;
    }
  }
);

export default ComponentPageComponentAddElementTypeInput;
