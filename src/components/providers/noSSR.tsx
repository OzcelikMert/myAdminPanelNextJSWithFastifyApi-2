import React, { Component, useEffect } from 'react';

type IComponentState = {
  isDidMount: boolean;
};

const initialState: IComponentState = {
  isDidMount: false
};

type IComponentProps = {
  children: React.ReactNode;
};

export default function ComponentProviderNoSSR( { children } : IComponentProps ) {
  const [isDidMount, setIsDidMount] = React.useState(initialState.isDidMount);

  useEffect(() => {
    setIsDidMount(true);
  }, []);

  return (
    <div suppressHydrationWarning>
      {isDidMount ? children : null}
    </div>
  );
}