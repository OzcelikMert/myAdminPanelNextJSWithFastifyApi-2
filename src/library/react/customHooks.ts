import { DependencyList, useEffect, useRef } from "react"

type ICallBackFunc<T = void> = () => T;

export const useDidMountHook = (callback: () => ICallBackFunc | ICallBackFunc<ICallBackFunc>, deps?: DependencyList) => {
    const didMount = useRef<boolean>(null)
  
    useEffect(() => {
      if (callback && !didMount.current) {
        didMount.current = true
        let returnFunc = callback();
        if(typeof returnFunc === 'function') {
            return returnFunc();
        }
      }
    }, deps)
}