import { useAccordionButton } from 'react-bootstrap/AccordionButton';

type IComponentProps = {
  children: any;
  eventKey: string;
  onClick?: () => void;
};

export default function ComponentAccordionToggle({ children, eventKey, onClick }: IComponentProps) {
  const decoratedOnClick = useAccordionButton(eventKey, onClick);

  return <div onClick={decoratedOnClick}>{children}</div>;
}
