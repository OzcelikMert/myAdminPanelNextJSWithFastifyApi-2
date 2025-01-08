import { DependencyList, useEffect, useRef } from "react"


type ICallbackFuncWithoutParams<T = void> = () => T;

export const useDidMount = (callback: ICallbackFuncWithoutParams | ICallbackFuncWithoutParams<ICallbackFuncWithoutParams>) => {
    const didMount = useRef<boolean>(false);
    useEffect(() => {
      if (callback && !didMount.current) {
        didMount.current = true
        let returnFunc = callback();
        if(typeof returnFunc === 'function') {
            return returnFunc;
        }
      }
    }, [])
};

export const useEffectAfterDidMount = (callback: ICallbackFuncWithoutParams | ICallbackFuncWithoutParams<ICallbackFuncWithoutParams>, deps?: DependencyList) => {
  const didMount = useRef<boolean>(false);
  useEffect(() => {
    if (callback && didMount.current) {
      let returnFunc = callback();
      if(typeof returnFunc === 'function') {
          return returnFunc;
      }
    }
    didMount.current = true
  }, deps ?? [])
};