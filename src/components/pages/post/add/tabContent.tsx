import React from 'react';
import dynamic from 'next/dynamic';

const ComponentFormInputRichTextbox = dynamic(
  () => import('@components/elements/form/inputs/richTextbox'),
  { ssr: false }
);

type IComponentProps = {
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddTabContent = React.memo((props: IComponentProps) => {
  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <ComponentFormInputRichTextbox
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.product.contents.content`
              : `contents.content`
          }
        />
      </div>
    </div>
  );
});

export default ComponentPagePostAddTabContent;
