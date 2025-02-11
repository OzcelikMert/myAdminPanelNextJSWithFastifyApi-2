import React from 'react';
import { Nav } from 'react-bootstrap';
import ComponentThemeTabTitle from './tabTitle';

export type IComponentThemeTabProps = {
  children: React.ReactNode;
  title: string;
  eventKey?: string;
  formFieldErrorKeys?: string[];
  showFormFieldErrors?: boolean;
};

const ComponentThemeTab = React.memo((props: IComponentThemeTabProps) => {
  console.log('ComponentThemeTab', props);

  return (
    <Nav.Item>
      <Nav.Link eventKey={props.eventKey}>
        <ComponentThemeTabTitle
          title={props.title}
          keys={props.formFieldErrorKeys}
          showFormFieldErrors={props.showFormFieldErrors}
        />
      </Nav.Link>
    </Nav.Item>
  );
});

export default ComponentThemeTab;
