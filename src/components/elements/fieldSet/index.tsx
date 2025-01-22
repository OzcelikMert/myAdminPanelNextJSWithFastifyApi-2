import React, { Component } from 'react';

type IComponentProps = {
  legend?: string;
  legendElement?: React.ReactNode;
  children: React.ReactNode;
};

const ComponentFieldSet = React.memo((props: IComponentProps) => {
  return (
    <div className="theme-input static">
      <span className="label">
        {props.legend} {props.legendElement}
      </span>
      <div className="field row d-flex m-0 pb-3 pt-3">{props.children}</div>
    </div>
  );
});

export default ComponentFieldSet;
