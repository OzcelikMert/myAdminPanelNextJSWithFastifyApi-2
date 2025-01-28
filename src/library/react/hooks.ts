import { DependencyList, useEffect, useRef } from "react"


type ICallbackFuncWithoutParams<T = void> = () => T;

export const useDidMount = (callback: ICallbackFuncWithoutParams | ICallbackFuncWithoutParams<ICallbackFuncWithoutParams>) => {
    const didMountRef = useRef<boolean>(false);
    useEffect(() => {
      if (callback && !didMountRef.current) {
        didMountRef.current = true
        let returnFunc = callback();
        if(typeof returnFunc === 'function') {
            return returnFunc;
        }
      }
    }, [])
};

export const useEffectAfterDidMount = (callback: ICallbackFuncWithoutParams | ICallbackFuncWithoutParams<ICallbackFuncWithoutParams>, deps?: DependencyList) => {
  const didMountRef = useRef<boolean>(false);
  useEffect(() => {
    if (callback && didMountRef.current) {
      let returnFunc = callback();
      if(typeof returnFunc === 'function') {
          return returnFunc;
      }
    }
    didMountRef.current = true
  }, deps ?? [])
};