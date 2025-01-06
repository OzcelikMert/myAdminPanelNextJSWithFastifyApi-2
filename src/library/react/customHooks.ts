import { Reducer, SetStateAction, useCallback, useEffect, useRef, useState } from "react"

type IDispatchWithCallback<A, S> = (
  value: A,
  callback: ICallbackFuncWithParam<S> | ICallbackFuncWithoutParams,
) => void;

type ICallbackFuncWithoutParams<T = void> = () => T;

type ICallbackFuncWithParam<S, T = void> = (state: S) => T;

export const useDidMountHook = (callback: ICallbackFuncWithoutParams | ICallbackFuncWithoutParams<ICallbackFuncWithoutParams>) => {
    const didMount = useRef<boolean>(false)
  
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

/*export const useStateWithCallback = <S>(initialValue: S): [S, IDispatchWithCallback<SetStateAction<S>, S>] => {
  const callbackRef = useRef<S>(null);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current = value;
      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = useCallback(
    (newValue: any, callback: any) => {
      callbackRef.current = callback;
      return setValue(newValue);
    },
    [],
  );

  return [value, setValueWithCallback];
};

export const useReducerWithCallback = <S>(reducer: Reducer, initialValue: S): [S, IDispatchWithCallback<SetStateAction<S>, S>] => {
  const callbackRef = useRef<S>(null);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current = value;
      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = useCallback(
    (newValue: any, callback: any) => {
      callbackRef.current = callback;
      return setValue(newValue);
    },
    [],
  );

  return [value, setValueWithCallback];
};*/