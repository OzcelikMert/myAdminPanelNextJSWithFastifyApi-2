import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type IComponentProps = {
  message: string;
  children: React.ReactElement;
};

export default function ComponentToolTip(props: IComponentProps) {

  return (
    <OverlayTrigger
      delay={{ hide: 150, show: 150 }}
      overlay={(overlayProps) => <Tooltip {...overlayProps}>{props.message}</Tooltip>}
      placement="top"
    >
      {props.children}
    </OverlayTrigger>
  );
}
