import React from 'react';
import ComponentThemeToolTipFormFieldErrors from '../tooltip/formFieldErrors';

type IComponentProps = {
  title: string;
  keys?: string[];
  showFormFieldErrors?: boolean;
};

const ComponentThemeTabTitle = React.memo((props: IComponentProps) => {
  return (
    <div>
      <b>{props.title}</b>{' '}
      {props.showFormFieldErrors ? (
        <ComponentThemeToolTipFormFieldErrors
          keys={props.keys ?? []}
          className=""
          iconFontSize="5"
          hideFieldTitles
        />
      ) : null}
    </div>
  );
});

export default ComponentThemeTabTitle;
