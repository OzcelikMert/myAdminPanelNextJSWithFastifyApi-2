import { useDidMount } from '@library/react/hooks';
import React, { Component, useEffect } from 'react';

type IComponentState = {
  isDidMount: boolean;
};

const initialState: IComponentState = {
  isDidMount: false,
};

type IComponentProps = {
  children: React.ReactNode;
};

const ComponentProviderNoSSR = (props: IComponentProps) => {
  const [isDidMount, setIsDidMount] = React.useState(initialState.isDidMount);

  useDidMount(() => {
    setIsDidMount(true);
  });

  return (
    <div suppressHydrationWarning>{isDidMount ? props.children : null}</div>
  );
};

export default ComponentProviderNoSSR;
