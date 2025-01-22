import React from 'react';
import dynamic from 'next/dynamic';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  { ssr: false, loading: () => <p>Loading...</p> }
);

type IComponentProps = {
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddTabContent = React.memo((props: IComponentProps) => {
  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <ComponentThemeRichTextBox
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.itemId.contents.content`
              : `contents.content`
          }
        />
      </div>
    </div>
  );
});

export default ComponentPagePostAddTabContent;
