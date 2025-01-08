import { cloneDeepWith } from 'lodash';
import React, { Component } from 'react';

type ISetFormStateFuncParam<T> = (state: T) => T;

export type IUseFormReducer<T = any> = {
  formState: T;
  setFormState: (state: Partial<T> | ISetFormStateFuncParam<T>) => void;
  onChangeInput: (event: React.ChangeEvent<any>) => void;
  onChangeSelect: (name: string | undefined, value: any) => any;
};

function setDataWithKeys(
  data: any,
  keys: string[],
  value: any,
  isArrayPush: boolean = false
) {
  const key = keys[0];
  if (keys.length === 1) {
    if (isArrayPush) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [value];
      }
    } else {
      data[key] = value;
    }
  } else {
    if (typeof data[key] === 'undefined') {
      data[key] = {};
    }

    data[key] = setDataWithKeys(data[key], keys.slice(1), value, isArrayPush);
  }

  return data;
}

enum ActionTypes {
  SET_STATE,
  UPDATE_FIELD,
  UPDATE_SELECT,
}

type IAction<T> =
  | {
      type: ActionTypes.SET_STATE;
      payload: { value: Partial<T> | ISetFormStateFuncParam<T> };
    }
  | { type: ActionTypes.UPDATE_FIELD; payload: { name: string; value: any } }
  | { type: ActionTypes.UPDATE_SELECT; payload: { name: string; value: any } };

function formReducer<T>(state: T, action: IAction<T>): T {
  switch (action.type) {
    case ActionTypes.SET_STATE: {
      const { value } = action.payload;
      return {
        ...state,
        ...(typeof value === 'function' ? value(state) : value),
      };
    }
    case ActionTypes.UPDATE_FIELD: {
      const { name, value } = action.payload;
      const keys = name.split('.');
      return setDataWithKeys(cloneDeepWith(state), keys, value);
    }
    case ActionTypes.UPDATE_SELECT: {
      const { name, value } = action.payload;
      let newState = cloneDeepWith(state);
      const keys = name.split('.');
      if (Array.isArray(value)) {
        newState = setDataWithKeys(newState, keys, []);
        value.forEach((item) => {
          const data = typeof item.value !== 'undefined' ? item.value : item;
          newState = setDataWithKeys(newState, keys, data, true);
        });
      } else {
        newState = setDataWithKeys(newState, keys, value);
      }
      return newState;
    }
    default:
      return state;
  }
}

export function useFormReducer<T>(initialState: T): IUseFormReducer<T> {
  const [formState, dispatch] = React.useReducer(formReducer, initialState);

  const onChangeInput: IUseFormReducer<T>['onChangeInput'] = (event) => {
    const { name, type, value, checked } = event.target;
    if (name) {
      const newValue =
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value) || 0
            : value;

      dispatch({ type: ActionTypes.UPDATE_FIELD, payload: { name, value: newValue } });
    }
  };

  const onChangeSelect: IUseFormReducer<T>['onChangeSelect'] = (
    name,
    value
  ) => {
    if (name) {
      dispatch({ type: ActionTypes.UPDATE_SELECT, payload: { name, value } });
    }
  };

  const setFormState: IUseFormReducer<T>['setFormState'] = (state) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { value: state } });
  };

  return { formState, setFormState, onChangeInput, onChangeSelect };
}
