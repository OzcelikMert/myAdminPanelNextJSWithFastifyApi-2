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
import { useEffect, useReducer } from 'react';

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

type IAction =
  | { type: 'SET_OPTIONS'; payload: IComponentState['options'] }
  | { type: 'SET_DATA'; payload: IComponentState['data'] }
  | { type: 'SET_IS_LOADING'; payload: IComponentState['isLoading'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_OPTIONS':
      return { ...state, options: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_IS_LOADING':
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

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const ctx = (
      document.createElement('canvas') as HTMLCanvasElement
    ).getContext('2d') as CanvasFillStrokeStyles;

    const gradientBar = ctx.createLinearGradient(0, 0, 0, 181);
    gradientBar.addColorStop(0, '#6e3a87');
    gradientBar.addColorStop(1, 'rgba(154, 85, 255, 1)');

    dispatch({
      type: 'SET_DATA',
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
    dispatch({ type: 'SET_IS_LOADING', payload: false });
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
