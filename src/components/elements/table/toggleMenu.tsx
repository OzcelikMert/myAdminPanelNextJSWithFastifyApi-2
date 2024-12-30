import React from 'react';
import { Dropdown } from 'react-bootstrap';

export interface IComponentTableToggleMenuItem {
  label: any;
  value: any;
  className?: string;
  icon?: string;
}

type IComponentProps = {
  items: IComponentTableToggleMenuItem[];
  onChange: (value: any) => void;
  label?: string | any;
};

export default function ComponentTableToggleMenu(props: IComponentProps) {
  return (
    <Dropdown align={'end'} className="theme-table-toggle">
      <Dropdown.Toggle className="theme-table-toggle-btn p-0">
        {props.label ?? <i className="mdi mdi-dots-horizontal"></i>}
      </Dropdown.Toggle>
      <Dropdown.Menu className="theme-table-toggle-menu">
        {props.items.map((item, index) => {
          return (
            <Dropdown.Item
              className={`${item.className ?? ''}`}
              onClick={(event) => props.onChange(item.value)}
              key={index}
            >
              {item.icon ? <i className={`${item.icon} me-2`}></i> : null}
              {item.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}