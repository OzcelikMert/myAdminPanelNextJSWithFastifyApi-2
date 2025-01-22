import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type IComponentProps = {
  message: string;
  children: React.ReactElement;
};

const ComponentToolTip = React.memo((props: IComponentProps) => {
  return (
    <OverlayTrigger
      delay={{ hide: 150, show: 150 }}
      overlay={(overlayProps) => (
        <Tooltip {...overlayProps}>{props.message}</Tooltip>
      )}
      placement="top"
    >
      {props.children}
    </OverlayTrigger>
  );
});

export default ComponentToolTip;
