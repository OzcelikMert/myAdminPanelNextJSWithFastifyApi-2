import React from 'react';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

type IComponentProps = {
  children: any;
  eventKey: string;
  onClick?: () => void;
};

const ComponentAccordionToggle = React.memo((props: IComponentProps) => {
  const decoratedOnClick = useAccordionButton(props.eventKey, props.onClick);

  return <div onClick={decoratedOnClick}>{props.children}</div>;
});

export default ComponentAccordionToggle;
