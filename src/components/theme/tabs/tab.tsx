import React from 'react';
import { Nav } from 'react-bootstrap';
import ComponentThemeTabTitle from './tabTitle';

export type IComponentThemeTabProps = {
  children: React.ReactNode;
  title: string;
  eventKey?: string;
  formFieldErrorKeys?: string[];
  disabled?: boolean;
};

const ComponentThemeTab = React.memo((props: IComponentThemeTabProps) => {
  return (
    <Nav.Item>
      <Nav.Link eventKey={props.eventKey} disabled={props.disabled}>
        <ComponentThemeTabTitle
          title={props.title}
          keys={props.formFieldErrorKeys}
          showFormFieldErrors={Boolean(
            props.formFieldErrorKeys && props.formFieldErrorKeys.length > 0
          )}
        />
      </Nav.Link>
    </Nav.Item>
  );
});

export default ComponentThemeTab;
