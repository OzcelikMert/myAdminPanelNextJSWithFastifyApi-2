import React from 'react';
import dynamic from 'next/dynamic';

const ComponentThemeFormInputRichTextbox = dynamic(
  () => import('@components/theme/form/inputs/richTextbox'),
  { ssr: false }
);

type IComponentProps = {
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddTabContent = React.memo((props: IComponentProps) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <ComponentThemeFormInputRichTextbox
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
