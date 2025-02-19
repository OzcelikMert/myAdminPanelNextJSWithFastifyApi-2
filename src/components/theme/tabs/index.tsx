import React from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { IComponentThemeTabProps } from './tab';

type IChildProps = React.ReactElement<IComponentThemeTabProps> | null;

const Child = React.memo((props: IChildProps & { showChildren: boolean }) => {
  return (
    <Tab.Pane eventKey={props.props.eventKey}>
      {props.showChildren ? props.props.children : null}
    </Tab.Pane>
  );
});

type IComponentProps = {
  children: IChildProps[];
  onSelect?: (eventKey: string) => void;
  activeKey?: string;
  defaultActiveKey?: string;
};

const ComponentThemeTabs = React.memo((props: IComponentProps) => {
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
                (item, index) =>
                  item && (
                    <Child
                      {...item}
                      key={item.key ?? `tab-content-item-${index}`}
                      showChildren={props.activeKey == item.props.eventKey}
                    />
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
