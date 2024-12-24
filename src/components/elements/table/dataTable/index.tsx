import React, { Component, useEffect } from 'react';
import DataTable, { TableProps } from 'react-data-table-component';
import ComponentTableToggleMenu, {
  IThemeToggleMenuItem,
} from '@components/elements/table/toggleMenu';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormType from '@components/elements/form/input/type';

type IComponentState = {
  selectedItems: any[];
  clearSelectedRows: boolean;
  searchKey: string;
};

const initialState: IComponentState = {
  selectedItems: [],
  clearSelectedRows: false,
  searchKey: '',
};

type IComponentPropI18 = {
  search?: string;
  noRecords?: string;
};

type IComponentProps<T> = {
  onSelect?: (rows: T[]) => void;
  onSearch?: (searchKey: string) => void;
  isSearchable?: boolean;
  isSelectable?: boolean;
  isAllSelectable?: boolean;
  isMultiSelectable?: boolean;
  selectedRows?: T[];
  isActiveToggleMenu?: boolean;
  toggleMenuItems?: IThemeToggleMenuItem[];
  onSubmitToggleMenuItem?: (value: any) => void;
  i18?: IComponentPropI18;
} & TableProps<T>;

export default function ComponentDataTable<T>(props: IComponentProps<T>) {
  const [selectedItems, setSelectedItems] = React.useState<
    IComponentState['selectedItems']
  >(props.selectedRows ?? initialState.selectedItems);
  const [clearSelectedRows, setClearSelectedRows] = React.useState<
    IComponentState['clearSelectedRows']
  >(initialState.clearSelectedRows);
  const [searchKey, setSearchKey] = React.useState<
    IComponentState['searchKey']
  >(initialState.searchKey);

  let listPage = 0;
  let listPagePerCount = 10;

  const dateSort = (
    a: { createdAt?: string | Date },
    b: { createdAt?: string | Date }
  ) => {
    return new Date(a.createdAt || '').getTime() >
      new Date(b.createdAt || '').getTime()
      ? 1
      : -1;
  };

  useEffect(() => {
    setSelectedItems(props.selectedRows ?? []);
  }, [props.selectedRows]);

  const getItemListForPage = () => {
    return props.data.slice(
      listPagePerCount * listPage,
      (listPage + 1) * listPagePerCount
    );
  };

  const isCheckedSelectAll = () => {
    const items = getItemListForPage();
    return (
      props.data.length > 0 &&
      items.every((item) => selectedItems.includes(item))
    );
  };

  const onSelectAll = () => {
    const items = getItemListForPage();
    for (const item of items) {
      onSelect(item, isCheckedSelectAll());
    }
  };

  const onSelect = (item: T, remove: boolean = true) => {
    const findIndex = selectedItems.indexOfKey('', item);

    if (findIndex > -1) {
      if (remove) {
        setSelectedItems(
          selectedItems.filter((_, index) => index !== findIndex)
        );
      }
    } else {
      if (props.isMultiSelectable === false) {
        setSelectedItems([]);
      }
      setSelectedItems([...selectedItems, item]);
    }

    if (props.onSelect) props.onSelect(selectedItems);
  };

  const getColumns = () => {
    let columns = [...props.columns];

    if (props.isActiveToggleMenu) {
      if (columns.length > 0) {
        columns[0].name =
          selectedItems.length > 0 ? (
            <ComponentTableToggleMenu
              items={props.toggleMenuItems ?? []}
              onChange={(value) =>
                props.onSubmitToggleMenuItem
                  ? props.onSubmitToggleMenuItem(value)
                  : null
              }
            />
          ) : (
            columns[0].name
          );
        columns[0].sortable = columns[0].sortable && selectedItems.length === 0;
      }
    }

    if (props.isSelectable) {
      columns = [
        {
          name: !props.isAllSelectable ? null : (
            <div>
              <ComponentFormCheckBox
                checked={isCheckedSelectAll()}
                onChange={(e) => onSelectAll()}
              />
            </div>
          ),
          width: '55px',
          cell: (row: any) => (
            <div>
              <ComponentFormCheckBox
                checked={selectedItems.includes(row)}
                onChange={(e) => onSelect(row)}
              />
            </div>
          ),
        },
        ...columns,
      ];
    }

    return columns;
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
    if (props.onSearch) props.onSearch(searchKey);
  };

  return (
    <div className="theme-table">
      {props.isSearchable ? (
        <div className="row pt-2 pb-2 m-0">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <ComponentFormType
              title={`${props.i18?.search ?? 'Search'}`}
              type="text"
              value={searchKey}
              onChange={(e: any) => onSearch(e)}
            />
          </div>
        </div>
      ) : null}
      <div className="table-responsive">
        <DataTable
          customStyles={{
            progress: { style: { backgroundColor: 'transparent' } },
          }}
          className="theme-data-table"
          columns={getColumns()}
          data={props.data}
          noHeader
          fixedHeader
          defaultSortAsc={false}
          pagination
          highlightOnHover
          onChangePage={(page: number, totalRows: number) => {
            listPage = page - 1;
            setClearSelectedRows(!clearSelectedRows);
          }}
          clearSelectedRows={clearSelectedRows}
          noDataComponent={
            <h5>
              {props.i18?.noRecords ?? 'There are no records to display'}
              <i className="mdi mdi-emoticon-sad-outline"></i>
            </h5>
          }
          paginationComponentOptions={{
            noRowsPerPage: true,
            rangeSeparatorText: '/',
            rowsPerPageText: '',
          }}
          progressComponent={
            <ComponentSpinnerDonut customClass="component-table-spinner" />
          }
          progressPending={props.progressPending}
        />
      </div>
    </div>
  );
}
