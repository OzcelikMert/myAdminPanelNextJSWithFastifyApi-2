import React from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { IComponentThemeTabProps } from './tab';

type IChild = React.ReactElement<IComponentThemeTabProps> | null;

type IComponentProps = {
  children: IChild[];
  onSelect?: (eventKey: string) => void;
  activeKey?: string;
  defaultActiveKey?: string;
};

const ComponentThemeTabs = React.memo((props: IComponentProps) => {
  console.log('ComponentThemeTabs', props);

  return (
    <div className="theme-tabs">
      <Tab.Container
        activeKey={props.activeKey}
        defaultActiveKey={props.defaultActiveKey}
        transition={false}
        onSelect={
          props.onSelect ? (key: any, e) => props.onSelect!(key) : undefined
        }
      >
        <Row>
          <Col sm="12">
            <Nav variant="tabs">{props.children}</Nav>
          </Col>
          <Col sm="12" className="mt-4">
            <Tab.Content>
              {props.children.map(
                (child) =>
                  child && (
                    <Tab.Pane eventKey={child.props.eventKey}>
                      {props.activeKey != child.props.eventKey ? null : child.props.children}
                    </Tab.Pane>
                  )
              )}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
});

export default ComponentThemeTabs;
