import React from 'react';
import ComponentThemeToolTipFormFieldErrors from '../tooltip/formFieldErrors';

type IComponentProps = {
  title: string;
  keys?: string[];
  showFormFieldErrors?: boolean;
};

const ComponentThemeTabTitle = React.memo((props: IComponentProps) => {
  console.log("ComponentThemeTabTitle", props);

  return (
    <div>
      <b>{props.title}</b>{' '}
      {props.showFormFieldErrors ? (
        <ComponentThemeToolTipFormFieldErrors
          keys={props.keys ?? []}
          className="col-md text-center text-md-start mb-2 mb-md-0"
          iconFontSize="5"
          hideFieldTitles
        />
      ) : null}
    </div>
  );
});

export default ComponentThemeTabTitle;
