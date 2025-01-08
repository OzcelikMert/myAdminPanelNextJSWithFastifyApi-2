import { Bar, ChartProps } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import { useReducer } from 'react';
import { useDidMount } from '@library/react/customHooks';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

type IComponentState = {
  options: ChartProps<'bar'>['options'];
  data: ChartData<'bar'>;
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
      point: {
        radius: 0,
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
  | { type: ActionTypes.SET_OPTIONS; payload: IComponentState['options'] }
  | { type: ActionTypes.SET_DATA; payload: IComponentState['data'] }
  | { type: ActionTypes.SET_IS_LOADING; payload: IComponentState['isLoading'] };

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
  labels: string[];
  data: any[];
  label: string;
};

export default function ComponentChartBar(props: IComponentProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useDidMount(() => {
    init();
  });

  const init = () => {
    const ctx = (
      document.createElement('canvas') as HTMLCanvasElement
    ).getContext('2d') as CanvasFillStrokeStyles;

    const gradientBar = ctx.createLinearGradient(0, 0, 0, 181);
    gradientBar.addColorStop(0, '#6e3a87');
    gradientBar.addColorStop(1, 'rgba(154, 85, 255, 1)');

    dispatch({
      type: ActionTypes.SET_DATA,
      payload: {
        labels: props.labels,
        datasets: [
          {
            label: props.label,
            borderColor: gradientBar,
            backgroundColor: gradientBar,
            hoverBackgroundColor: gradientBar,
            borderWidth: 1,
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
    <Bar
      itemRef="chart"
      className="chartLegendContainer"
      data={state.data}
      options={state.options}
    />
  );
}
