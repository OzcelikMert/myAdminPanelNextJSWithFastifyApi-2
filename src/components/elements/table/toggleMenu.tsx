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
  label?: string | any;
  title?: string;
  itemCount?: number;
  onChange: (value: any) => void;
};

const ComponentTableToggleMenu = React.memo((props: IComponentProps) => {
  return (
    <Dropdown align={'end'} className="theme-table-toggle">
      <Dropdown.Toggle className="theme-table-toggle-btn p-0">
        {props.label ?? <i className="mdi mdi-dots-horizontal"></i>}
        {props.itemCount ? (<b>({props.itemCount})</b>) : null}
      </Dropdown.Toggle>
      <Dropdown.Menu className="theme-table-toggle-menu">
        {props.title ? (
          <Dropdown.Header className="theme-table-toggle-title">
            {props.title}
          </Dropdown.Header>
        ) : null}
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
});

export default ComponentTableToggleMenu;
