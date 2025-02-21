import React from 'react';
import ComponentThemeFormSelectImage from '@components/theme/form/inputs/selectImage';
import dynamic from 'next/dynamic';
import { IComponentElementModel } from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

const ComponentThemeFormInputRichTextbox = dynamic(
  () => import('@components/theme/form/inputs/richTextbox'),
  { ssr: false }
);

const TextArea = React.memo((props: { name: string }) => {
  const t = useAppSelector(selectTranslation);

  return (
    <ComponentThemeFormInput title={t('text')} type={'textarea'} {...props} />
  );
});

const RichText = React.memo((props: { name: string }) => {
  return <ComponentThemeFormInputRichTextbox {...props} />;
});

const Image = React.memo((props: { name: string }) => {
  return (
    <div>
      <ComponentThemeFormSelectImage
        {...props}
        isMulti={false}
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
        <ComponentThemeFormInput
          title={t('text')}
          type={'text'}
          name={props.nameText}
        />
      </div>
      <div className="col-md-6">
        <ComponentThemeFormInput
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

  return <ComponentThemeFormInput title={t('text')} type={'text'} {...props} />;
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
