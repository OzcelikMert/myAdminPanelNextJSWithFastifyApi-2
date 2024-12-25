import React from 'react';

type IComponentProps = {
  name: string;
  updatedAt: string;
};

export default function ComponentTableUpdatedBy(props: IComponentProps) {
  return (
    <div className="text-center">
      <b>{props.name}</b>
      <br />
      <small>({new Date(props.updatedAt).toLocaleDateString()})</small>
    </div>
  );
}
