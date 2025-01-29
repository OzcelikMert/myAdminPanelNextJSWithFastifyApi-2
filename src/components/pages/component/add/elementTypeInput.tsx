import React from 'react';
import ComponentThemeChooseImageForm from '@components/theme/chooseImage/form';
import dynamic from 'next/dynamic';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

const ComponentFormInputRichTextbox = dynamic(
  () => import('@components/elements/form/inputs/richTextbox'),
  { ssr: false }
);

const TextArea = React.memo((props: { name: string }) => {
  const t = useAppSelector(selectTranslation);

  return <ComponentFormInput title={t('text')} type={'textarea'} {...props} />;
});

const RichText = React.memo((props: { name: string }) => {
  return <ComponentFormInputRichTextbox {...props} />;
});

const Image = React.memo((props: { name: string }) => {
  return (
    <div>
      <ComponentThemeChooseImageForm
        {...props}
        isMulti={false}
        isShowReviewImage={true}
        reviewImageClassName={'post-image'}
      />
    </div>
  );
});

const Button = React.memo((props: { nameText: string; nameUrl: string }) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-6">
        <ComponentFormInput
          title={t('text')}
          type={'text'}
          name={props.nameText}
        />
      </div>
      <div className="col-md-6 mt-3 mt-lg-0">
        <ComponentFormInput
          title={t('url')}
          type={'text'}
          name={props.nameUrl}
        />
      </div>
    </div>
  );
});

const Text = React.memo((props: { name: string }) => {
  const t = useAppSelector(selectTranslation);

  return <ComponentFormInput title={t('text')} type={'text'} {...props} />;
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

    switch (props.data.typeId) {
      case ElementTypeId.TextArea:
        return <TextArea name={contentInputName} />;
      case ElementTypeId.Image:
        return <Image name={contentInputName} />;
      case ElementTypeId.Button:
        return <Button nameText={contentInputName} nameUrl={urlInputName} />;
      case ElementTypeId.RichText:
        return <RichText name={contentInputName} />;
      default:
        return <Text name={contentInputName} />;
    }
  }
);

export default ComponentPageComponentAddElementTypeInput;
