import React, { Component } from 'react';

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

type IAction =
  | { type: 'SET_STATE'; payload: { value: any } }
  | { type: 'UPDATE_FIELD'; payload: { name: string; value: any } }
  | { type: 'UPDATE_SELECT'; payload: { name: string; value: any } };

function formReducer(state: any, action: IAction): any {
  switch (action.type) {
    case 'SET_STATE': {
      const { value } = action.payload;
      return Object.assign(state, value);
    }
    case 'UPDATE_FIELD': {
      const { name, value } = action.payload;
      return setDataWithKeys({ ...state }, name.split('.'), value);
    }
    case 'UPDATE_SELECT': {
      const { name, value } = action.payload;
      let newState = { ...state };
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

export function useFormReducer<T>(initialState: T): {
  formState: T;
  setFormState: (state: Partial<T>) => void;
  onChangeInput: (event: React.ChangeEvent<any>) => void;
  onChangeSelect: (name: string, value: any) => any;
} {
  const [formState, dispatch] = React.useReducer(formReducer, initialState);

  const onChangeInput = (event: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = event.target;
    const newValue =
      type === 'checkbox'
        ? checked
        : type === 'number'
          ? Number(value) || 0
          : value;

    dispatch({ type: 'UPDATE_FIELD', payload: { name, value: newValue} });
  };

  const onChangeSelect = (name: string, value: any) => {
    dispatch({ type: 'UPDATE_SELECT', payload: { name, value } });
  };

  const setFormState = (state: Partial<T>) => {
    dispatch({ type: 'SET_STATE', payload: { value: state } });
  }

  return { formState, setFormState, onChangeInput, onChangeSelect };
}