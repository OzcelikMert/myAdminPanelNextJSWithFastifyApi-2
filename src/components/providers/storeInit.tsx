import { IAppStore, makeStore } from '@lib/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'

export default function ComponentProviderStoreInit({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<IAppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}