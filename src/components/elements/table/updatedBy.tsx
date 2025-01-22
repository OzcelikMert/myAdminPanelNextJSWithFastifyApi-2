import React from 'react';

type IComponentProps = {
  name: string;
  updatedAt: string;
};

const ComponentTableUpdatedBy = React.memo((props: IComponentProps) => {
  return (
    <div className="text-center">
      <b>{props.name}</b>
      <br />
      <small>({new Date(props.updatedAt).toLocaleDateString()})</small>
    </div>
  );
});

export default ComponentTableUpdatedBy