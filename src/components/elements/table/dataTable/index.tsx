import React, { useEffect, useReducer, useRef } from 'react';
import DataTable, { TableProps } from 'react-data-table-component';
import ComponentTableToggleMenu, {
  IComponentTableToggleMenuItem,
} from '@components/elements/table/toggleMenu';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormType from '@components/elements/form/input/type';
import { cloneDeepWith } from 'lodash';
import ComponentTableFilterButton, {
  IComponentTableFilterButton,
} from '../filterButton';
import { useEffectAfterDidMount } from '@library/react/customHooks';

type IComponentState = {
  selectedItems: any[];
  clearSelectedRows: boolean;
  searchKey: string;
  showingItems: any[];
  activeFilterButtonIndex?: number;
};

const initialState: IComponentState = {
  selectedItems: [],
  clearSelectedRows: false,
  searchKey: '',
  showingItems: [],
};

enum ActionTypes {
  SET_SELECTED_ITEMS,
  SET_SEARCH_KEY,
  SET_CLEAR_SELECTED_ROWS,
  SET_ACTIVE_FILTER_BUTTON_INDEX,
  SET_SHOWING_ITEMS,
}

type IAction =
  | { type: ActionTypes.SET_SELECTED_ITEMS; payload: IComponentState['selectedItems'] }
  | { type: ActionTypes.SET_SEARCH_KEY; payload: IComponentState['searchKey'] }
  | { type: ActionTypes.SET_CLEAR_SELECTED_ROWS; payload: boolean }
  | {
      type: ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX;
      payload: IComponentState['activeFilterButtonIndex'];
    }
  | { type: ActionTypes.SET_SHOWING_ITEMS; payload: IComponentState['showingItems'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ITEMS:
      return { ...state, selectedItems: action.payload };
    case ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX:
      return { ...state, activeFilterButtonIndex: action.payload };
    case ActionTypes.SET_SEARCH_KEY:
      return { ...state, searchKey: action.payload };
    case ActionTypes.SET_CLEAR_SELECTED_ROWS:
      return { ...state, clearSelectedRows: action.payload };
    case ActionTypes.SET_SHOWING_ITEMS:
      return { ...state, showingItems: action.payload };
    default:
      return state;
  }
};

type IComponentPropI18 = {
  search?: string;
  noRecords?: string;
};

type IComponentProps<T = any> = {
  isSearchable?: boolean;
  searchableKeys?: string[];
  isSelectable?: boolean;
  isAllSelectable?: boolean;
  isMultiSelectable?: boolean;
  isActiveToggleMenu?: boolean;
  toggleMenuItems?: IComponentTableToggleMenuItem[];
  filterButtons?: IComponentTableFilterButton[];
  i18?: IComponentPropI18;
  onClickToggleMenuItem?: (value: any) => void;
  onSelect?: (value: T[]) => void;
  onClickFilterButton?: (button: IComponentTableFilterButton) => void;
} & TableProps<T>;

export default function ComponentDataTable<T>(props: IComponentProps<T>) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    showingItems: props.data,
  });

  const listPage = useRef<number>(0);
  const listPagePerCount = useRef<number>(10);

  useEffectAfterDidMount(() => {
    resetTableList();
  }, [props.data]);

  const resetTableList = (firstRender?: boolean) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEMS, payload: [] });
    dispatch({
      type: ActionTypes.SET_CLEAR_SELECTED_ROWS,
      payload: !state.clearSelectedRows,
    });
    onSearch();
  };

  const getItemListForPage = () => {
    return props.data.slice(
      listPagePerCount.current * listPage.current,
      (listPage.current + 1) * listPagePerCount.current
    );
  };

  const isCheckedSelectAll = () => {
    const items = getItemListForPage();
    return (
      props.data.length > 0 &&
      items.every((item) => state.selectedItems.includes(item))
    );
  };

  const onSelectAll = () => {
    const items = getItemListForPage();
    for (const item of items) {
      onSelect(item, isCheckedSelectAll());
    }
  };

  const onSelect = (item: T, remove: boolean = true) => {
    const findIndex = state.selectedItems.indexOfKey('', item);

    if (findIndex > -1) {
      if (remove) {
        dispatch({
          type: ActionTypes.SET_SELECTED_ITEMS,
          payload: state.selectedItems.filter(
            (_, index) => index !== findIndex
          ),
        });
      }
    } else {
      if (props.isMultiSelectable === false) {
        dispatch({ type: ActionTypes.SET_SELECTED_ITEMS, payload: [item] });
      } else {
        dispatch({
          type: ActionTypes.SET_SELECTED_ITEMS,
          payload: [...state.selectedItems, item],
        });
      }
    }

    if (props.onSelect) {
      props.onSelect(state.selectedItems);
    }
  };

  const onSearch = (event?: React.ChangeEvent<HTMLInputElement>) => {
    let searchKey = event ? event.target.value : state.searchKey;
    dispatch({ type: ActionTypes.SET_SEARCH_KEY, payload: searchKey });
    // Find Searched Items for Showing Items
    let searchedItems = props.data.filter((item: any) => {
      let isFound = true;
      if (props.searchableKeys) {
        // Search by searchableKeys
        props.searchableKeys.forEach((searchableKey) => {
          // Split searchableKey by '.'
          let keys = searchableKey.split('.');
          // Clone item
          let newData = cloneDeepWith(item);
          // Loop through keys
          for (let i = 0; i < keys.length; i++) {
            if (item[keys[i]]) {
              // Assign new data
              newData = cloneDeepWith(newData[keys[i]]);
            } else {
              newData = null;
              break;
            }
          }
          if (newData) {
            // Search newData by searchKey
            if (newData.toString().toLowerCase().search(searchKey) < 0) {
              isFound = false;
            }
          }
        });
      }
      return isFound;
    });

    // Set Showing Items
    dispatch({ type: ActionTypes.SET_SHOWING_ITEMS, payload: searchedItems });
  };

  const onFilter = (item: IComponentTableFilterButton, index: number) => {
    let filteredItems = item.onFilter(props.data);
    dispatch({ type: ActionTypes.SET_SHOWING_ITEMS, payload: filteredItems });
    dispatch({ type: ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX, payload: index });
    resetTableList();
    if (props.onClickFilterButton) {
      props.onClickFilterButton(item);
    }
  };

  const getColumns = () => {
    let columns = [
      ...props.columns.filter(
        (column) => typeof column.name !== 'undefined' || column.name !== null
      ),
    ];

    if (props.isActiveToggleMenu) {
      if (columns.length > 0) {
        columns[0].name =
          state.selectedItems.length > 0 ? (
            <ComponentTableToggleMenu
              items={props.toggleMenuItems ?? []}
              onChange={(value) =>
                props.onClickToggleMenuItem
                  ? props.onClickToggleMenuItem(value)
                  : null
              }
            />
          ) : (
            columns[0].name
          );
        columns[0].sortable =
          columns[0].sortable && state.selectedItems.length === 0;
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
                checked={state.selectedItems.includes(row)}
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

  return (
    <div className="theme-table">
      {props.isSearchable ? (
        <div className="row pt-2 pb-2 m-0">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <ComponentFormType
              title={`${props.i18?.search ?? 'Search'}`}
              type="text"
              value={state.searchKey}
              onChange={(e: any) => onSearch(e)}
            />
          </div>
        </div>
      ) : null}
      {props.filterButtons ? (
        <div className="row pt-2 pb-2 m-0">
          <div className="col-md-3"></div>
          <div className="col-md-9 text-end">
            <div className="btn-group" role="group">
              {props.filterButtons.map((item, index) => (
                <ComponentTableFilterButton
                  key={`filter-button-${index}`}
                  item={item}
                  onClick={() => onFilter(item, index)}
                  isActive={state.activeFilterButtonIndex === index}
                />
              ))}
            </div>
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
          data={state.showingItems}
          noHeader
          fixedHeader
          defaultSortAsc={false}
          pagination
          highlightOnHover
          onChangePage={(page: number, totalRows: number) => {
            listPage.current = page - 1;
            dispatch({
              type: ActionTypes.SET_CLEAR_SELECTED_ROWS,
              payload: !state.clearSelectedRows,
            });
          }}
          clearSelectedRows={state.clearSelectedRows}
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
