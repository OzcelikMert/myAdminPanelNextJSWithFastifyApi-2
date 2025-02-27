import { ChartProps, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import React, { useReducer } from 'react';
import { useDidMount } from '@library/react/hooks';
import { IActionWithPayload } from 'types/hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type IComponentState = {
  options: ChartProps<'line'>['options'];
  data: ChartData<'line'>;
  isLoading: boolean;
};

const initialState: IComponentState = {
  isLoading: true,
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
      },
    },
  },
};

enum ActionTypes {
  SET_OPTIONS,
  SET_DATA,
  SET_IS_LOADING,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_OPTIONS, IComponentState['options']>
  | IActionWithPayload<ActionTypes.SET_DATA, IComponentState['data']>
  | IActionWithPayload<
      ActionTypes.SET_IS_LOADING,
      IComponentState['isLoading']
    >;

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_OPTIONS:
      return { ...state, options: action.payload };
    case ActionTypes.SET_DATA:
      return { ...state, data: action.payload };
    case ActionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

type IComponentProps = {
  labels?: string[];
  data: any[];
  toolTipLabel?: string;
};

const ComponentChartLine = React.memo((props: IComponentProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useDidMount(() => {
    init();
  });

  const init = () => {
    const borderColor = '#1863d3';

    dispatch({
      type: ActionTypes.SET_DATA,
      payload: {
        labels: props.labels,
        datasets: [
          {
            pointBorderWidth: 0,
            label: props.toolTipLabel,
            borderColor: borderColor,
            borderWidth: 5,
            data: props.data,
          },
        ],
      },
    });

    dispatch({ type: ActionTypes.SET_IS_LOADING, payload: false });
  };

  return state.isLoading ? (
    <Spinner animation="border" />
  ) : (
    <Line
      itemRef="chart"
      className="chartLegendContainer"
      data={state.data}
      options={state.options}
      redraw={true}
    />
  );
});

export default ComponentChartLine;
