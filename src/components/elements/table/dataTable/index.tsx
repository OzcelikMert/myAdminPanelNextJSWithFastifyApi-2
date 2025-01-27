import React, { useReducer, useRef, useState } from 'react';
import DataTable, { TableColumn, TableProps } from 'react-data-table-component';
import ComponentTableToggleMenu, {
  IComponentTableToggleMenuItem,
} from '@components/elements/table/toggleMenu';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentTableFilterButton, {
  IComponentTableFilterButton,
} from '../filterButton';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { IActionWithPayload } from 'types/hooks';
import ComponentToolTip from '@components/elements/tooltip';
import { cloneDeepWith } from 'lodash';

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
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEMS,
      IComponentState['selectedItems']
    >
  | IActionWithPayload<ActionTypes.SET_SEARCH_KEY, IComponentState['searchKey']>
  | IActionWithPayload<ActionTypes.SET_CLEAR_SELECTED_ROWS, boolean>
  | IActionWithPayload<
      ActionTypes.SET_ACTIVE_FILTER_BUTTON_INDEX,
      IComponentState['activeFilterButtonIndex']
    >
  | IActionWithPayload<ActionTypes.SET_ITEMS, IComponentState['items']>
  | IActionWithPayload<
      ActionTypes.SET_SHOWING_ITEMS,
      IComponentState['showingItems']
    >;

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
  toggleMenuTitle?: string;
  selectAll?: string;
};

type IComponentProps<T = any> = {
  isSearchable?: boolean;
  isSelectable?: boolean;
  isAllSelectable?: boolean;
  isMultiSelectable?: boolean;
  toggleMenuItems?: IComponentTableToggleMenuItem[];
  filterButtons?: IComponentTableFilterButton[];
  i18?: IComponentPropI18;
  onClickToggleMenuItem?: (
    selectedRows: T[],
    value: any
  ) => void | Promise<void>;
  onSelect?: (value: T[]) => void;
  columns: IComponentDataTableColumn<T>[];
} & Omit<TableProps<T>, 'columns'>;

const ComponentDataTable = React.memo(<T,>(props: IComponentProps<T>) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    items: props.data,
    showingItems: props.data,
    activeFilterButtonIndex:
      props.filterButtons?.indexOfKey('isDefault', true) ?? 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const listPageRef = useRef<number>(0);
  const listPagePerCountRef = useRef<number>(10);

  useDidMount(() => {
    if (props.filterButtons && props.filterButtons.length > 0) {
      onFilter();
    } else {
      setIsLoading(false);
    }
  });

  useEffectAfterDidMount(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    if (props.filterButtons && props.filterButtons.length > 0) {
      onFilter();
    } else {
      dispatch({ type: ActionTypes.SET_ITEMS, payload: props.data });
    }
    setIsLoading(false);
  }, [props.data]);

  useEffectAfterDidMount(() => {
    onSearch();
    if (isLoading) {
      setIsLoading(false);
    }
  }, [state.items]);

  const resetTableSelectedItems = (firstRender?: boolean) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEMS, payload: [] });
    dispatch({
      type: ActionTypes.SET_CLEAR_SELECTED_ROWS,
      payload: !state.clearSelectedRows,
    });
  };

  const getItemListForPage = () => {
    return state.items.slice(
      listPagePerCountRef.current * listPageRef.current,
      (listPageRef.current + 1) * listPagePerCountRef.current
    );
  };

  const checkAllSelected = () => {
    const items = getItemListForPage();
    return (
      state.items.length > 0 &&
      items.every((item) => state.selectedItems.includes(item))
    );
  };

  const onSelectAll = () => {
    const items = getItemListForPage();
    dispatch({
      type: ActionTypes.SET_SELECTED_ITEMS,
      payload: checkAllSelected() ? [] : items,
    });
  };

  const onSelect = (item: T, remove: boolean = true) => {
    const findIndex = state.selectedItems.indexOfKey('', item);
    let newSelectedItems = state.selectedItems;

    if (findIndex > -1) {
      if (remove) {
        newSelectedItems = newSelectedItems.filter(
          (_, index) => index !== findIndex
        );
      }
    } else {
      if (props.isMultiSelectable === false) {
        newSelectedItems = [item];
      } else {
        newSelectedItems = [...state.selectedItems, item];
      }
    }

    if (props.onSelect) {
      props.onSelect(newSelectedItems);
    }

    dispatch({
      type: ActionTypes.SET_SELECTED_ITEMS,
      payload: newSelectedItems,
    });
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
    if (JSON.stringify(searchedItems) !== JSON.stringify(state.showingItems)) {
      dispatch({ type: ActionTypes.SET_SHOWING_ITEMS, payload: searchedItems });
    }
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
        resetTableSelectedItems();
        index = filterButtonIndex;
      }
      const filterButton = props.filterButtons[index];
      let filteredItems = cloneDeepWith(props.data);
      if (filterButton.onFilter) {
        filteredItems = await filterButton.onFilter(filteredItems);
      }

      dispatch({ type: ActionTypes.SET_SEARCH_KEY, payload: '' });
      dispatch({ type: ActionTypes.SET_ITEMS, payload: filteredItems });
    }
  };

  const onClickToggleMenuItem = async (value: any) => {
    if (props.onClickToggleMenuItem) {
      await props.onClickToggleMenuItem(state.selectedItems, value);
    }
    onFilter();
    onSearch();
  };

  const getColumns = () => {
    let newColumns = cloneDeepWith(
      props.columns.filter(
        (column) => typeof column.name !== 'undefined' || column.name !== null
      )
    );

    if (props.toggleMenuItems && props.toggleMenuItems.length > 0) {
      if (newColumns.length > 0) {
        newColumns[0].name =
          state.selectedItems.length > 0 ? (
            <ComponentTableToggleMenu
              items={props.toggleMenuItems ?? []}
              title={props.i18?.toggleMenuTitle}
              onChange={(value) => onClickToggleMenuItem(value)}
            />
          ) : (
            newColumns[0].name
          );
        newColumns[0].sortable =
          newColumns[0].sortable && state.selectedItems.length === 0;
      }
    }

    if (props.isSelectable) {
      newColumns = [
        {
          name: !props.isAllSelectable ? null : (
            <ComponentToolTip message={props.i18?.selectAll ?? 'Select All'}>
              <div>
                <ComponentFormCheckBox
                  checked={checkAllSelected()}
                  onChange={(e) => onSelectAll()}
                />
              </div>
            </ComponentToolTip>
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
        ...newColumns,
      ];
    }

    return newColumns;
  };

  return (
    <div className="theme-table">
      {props.isSearchable ? (
        <div className="row pt-2 pb-2 m-0">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <ComponentFormInput
              title={`${props.i18?.search ?? 'Search'}`}
              onChange={(event: any) => onSearch(event)}
              value={state.searchKey}
            />
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
          persistTableHead
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
            <h5 className="p-5 text-center">
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
}) as <T>(props: IComponentProps<T>) => React.ReactNode;

export default ComponentDataTable;
