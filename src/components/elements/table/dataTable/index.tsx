import React, { useReducer, useRef, useState } from 'react';
import DataTable, { TableColumn, TableProps } from 'react-data-table-component';
import ComponentTableToggleMenu, {
  IComponentTableToggleMenuItem,
} from '@components/elements/table/toggleMenu';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentTableFilterButton, {
  IComponentTableFilterButton,
} from '../filterButton';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

export type IComponentDataTableColumn<T> = {
  isSearchable?: boolean;
} & TableColumn<T>;

type IComponentState = {
  selectedItems: any[];
  clearSelectedRows: boolean;
  searchKey: string;
  items: any[];
  showingItems: any[];
  activeFilterButtonIndex: number;
};

const initialState: IComponentState = {
  selectedItems: [],
  clearSelectedRows: false,
  searchKey: '',
  items: [],
  showingItems: [],
  activeFilterButtonIndex: -1,
};

enum ActionTypes {
  SET_SELECTED_ITEMS,
  SET_SEARCH_KEY,
  SET_CLEAR_SELECTED_ROWS,
  SET_ACTIVE_FILTER_BUTTON_INDEX,
  SET_ITEMS,
  SET_SHOWING_ITEMS,
}

type IAction =
  | {
      type: ActionTypes.SET_SELECTED_ITEMS;
      payload: IComponentState['selectedItems'];
    }
  | { type: ActionTypes.SET_SEARCH_KEY; payload: IComponentState['searchKey'] }
  | { type: ActionTypes.SET_CLEAR_SELECTED_ROWS; payload: boolean }
  | {
      type: ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX;
      payload: IComponentState['activeFilterButtonIndex'];
    }
  | { type: ActionTypes.SET_ITEMS; payload: IComponentState['items'] }
  | {
      type: ActionTypes.SET_SHOWING_ITEMS;
      payload: IComponentState['showingItems'];
    };

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
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
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
  isSelectable?: boolean;
  isAllSelectable?: boolean;
  isMultiSelectable?: boolean;
  toggleMenuItems?: IComponentTableToggleMenuItem[];
  filterButtons?: IComponentTableFilterButton[];
  i18?: IComponentPropI18;
  onClickToggleMenuItem?: (selectedRows: T[], value: any) => void;
  onSelect?: (value: T[]) => void;
  onClickFilterButton?: (button: IComponentTableFilterButton) => void;
  columns: IComponentDataTableColumn<T>[];
} & Omit<TableProps<T>, 'columns'>;

export default function ComponentDataTable<T>(props: IComponentProps<T>) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    items: props.data,
    showingItems: props.data,
    activeFilterButtonIndex:
      props.filterButtons?.indexOfKey('isDefault', true) ?? -1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const listPageRef = useRef<number>(0);
  const listPagePerCountRef = useRef<number>(10);

  useDidMount(() => {
    if (state.activeFilterButtonIndex > -1) {
      onFilter();
    } else {
      setIsLoading(false);
    }
  });

  useEffectAfterDidMount(() => {
    resetTableList();
  }, [props.data]);

  useEffectAfterDidMount(() => {
    onSearch();
    if (isLoading) {
      setIsLoading(false);
    }
  }, [state.items]);

  const resetTableList = (firstRender?: boolean) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEMS, payload: [] });
    dispatch({
      type: ActionTypes.SET_CLEAR_SELECTED_ROWS,
      payload: !state.clearSelectedRows,
    });
  };

  const getItemListForPage = () => {
    return props.data.slice(
      listPagePerCountRef.current * listPageRef.current,
      (listPageRef.current + 1) * listPagePerCountRef.current
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
    const searchKey = event ? event.target.value : state.searchKey;
    dispatch({ type: ActionTypes.SET_SEARCH_KEY, payload: searchKey });
    // Find Searched Items for Showing Items
    let searchedItems = state.items;
    if (searchKey.length > 0) {
      const searchableColumns = props.columns.findMulti('isSearchable', true);
      if (searchableColumns) {
        searchedItems = state.items.filter((item) => {
          let selectors: any[] = [];

          for (const column of searchableColumns) {
            if (column.selector) {
              const selector = column.selector(item);
              selectors.push(selector);
            }
          }

          return (
            selectors.filter(
              (selector) =>
                selector.toString().toLowerCase().search(searchKey) > -1
            ).length > 0
          );
        });
      }
    }
    // Set Showing Items
    dispatch({ type: ActionTypes.SET_SHOWING_ITEMS, payload: searchedItems });
  };

  const onFilter = async (filterButtonIndex: number = -1) => {
    if (props.filterButtons && props.filterButtons.length > 0) {
      if (!isLoading) {
        setIsLoading(true);
      }
      let index = state.activeFilterButtonIndex;
      if (filterButtonIndex > -1) {
        dispatch({
          type: ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX,
          payload: filterButtonIndex,
        });
        resetTableList();
        index = filterButtonIndex;
      }
      const filterButton = props.filterButtons[index];
      let filteredItems = props.data;
      if (filterButton.onFilter) {
        filteredItems = filterButton.onFilter(props.data);
      } else if (filterButton.onFilterAsync) {
        filteredItems = await filterButton.onFilterAsync();
      }
      dispatch({ type: ActionTypes.SET_ITEMS, payload: filteredItems });
      if (props.onClickFilterButton) {
        props.onClickFilterButton(filterButton);
      }
    }
  };

  const getColumns = () => {
    let columns = [
      ...props.columns.filter(
        (column) => typeof column.name !== 'undefined' || column.name !== null
      ),
    ];

    if (props.toggleMenuItems && props.toggleMenuItems.length > 0) {
      if (columns.length > 0) {
        columns[0].name =
          state.selectedItems.length > 0 ? (
            <ComponentTableToggleMenu
              items={props.toggleMenuItems ?? []}
              onChange={(value) =>
                props.onClickToggleMenuItem
                  ? props.onClickToggleMenuItem(state.selectedItems, value)
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

  const SearchInput = () => {
    return (
      <div className="theme-input">
        <input
          className="field"
          title={`${props.i18?.search ?? 'Search'}`}
          type="text"
          value={state.searchKey}
          onChange={(event: any) => onSearch(event)}
          placeholder=" "
        />
        <span className="label">{`${props.i18?.search ?? 'Search'}`}</span>
      </div>
    );
  };

  return (
    <div className="theme-table">
      {props.isSearchable ? (
        <div className="row pt-2 pb-2 m-0">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <SearchInput />
          </div>
        </div>
      ) : null}
      {props.filterButtons ? (
        <div className="row pt-2 pb-2 m-0 filter-buttons">
          <div className="col-md-3"></div>
          <div className="col-md-9 text-end">
            <div className="btn-group" role="group">
              {props.filterButtons.map((item, index) => (
                <ComponentTableFilterButton
                  key={`filter-button-${index}`}
                  item={item}
                  onClick={() => onFilter(index)}
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
            listPageRef.current = page - 1;
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
          progressPending={isLoading || props.progressPending}
        />
      </div>
    </div>
  );
}
