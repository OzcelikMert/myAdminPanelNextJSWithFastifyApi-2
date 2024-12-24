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
import { useEffect, useState } from 'react';

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

type IComponentProps = {
  labels: string[];
  data: any[];
  label: string;
};

export default function ComponentChartBar(props: IComponentProps) {
  const [options, setOptions] = useState(initialState.options);
  const [data, setData] = useState(initialState.data);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

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

    setData({
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
    });
    setIsLoading(false);
  }

  return isLoading ? (
    <Spinner animation="border" />
  ) : (
    <Bar
      itemRef="chart"
      className="chartLegendContainer"
      data={data}
      options={options}
    />
  );
}