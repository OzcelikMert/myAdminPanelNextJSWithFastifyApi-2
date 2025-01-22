import { IAppStore, makeStore } from '@redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

type IComponentProps = {
  children: React.ReactNode;
};

const ComponentProviderStoreInit = (props: IComponentProps) => {
  const storeRef = useRef<IAppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{props.children}</Provider>;
};

export default ComponentProviderStoreInit;
