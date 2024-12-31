import React from 'react';

export interface IComponentTableFilterButton<T = any[]> {
  title?: string;
  icon?: string | React.ReactNode;
  className?: string;
  onFilter: (items: T) => T;
  key?: any
}

type IComponentProps<T = any[]> = {
  item: IComponentTableFilterButton<T>;
  onClick: () => void;
  isActive?: boolean;
};

export default function ComponentTableFilterButton<T>(
  props: IComponentProps<T>
) {
  return (
    <button
      type="button"
      className={`btn btn-gradient-primary btn-lg list-mode-btn ${props.item.className ?? ''} ${props.isActive ? 'active' : ''}`}
      onClick={props.isActive ? undefined : () => props.onClick()}
    >
      {props.item.icon ? (
        typeof props.item.icon === 'string' ? (
          <i className={`${props.item.icon} me-2`}></i>
        ) : (
          props.item.icon
        )
      ) : null}
      {props.item.title}
    </button>
  );
}
