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
import { useEffect, useState } from 'react';

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

type IComponentProps = {
  labels?: string[];
  data: any[];
  toolTipLabel?: string;
};

export default function ComponentChartLine(props: IComponentProps) {
  const [options, setOptions] = useState(initialState.options);
  const [data, setData] = useState(initialState.data);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const borderColor = '#1863d3';

    setData({
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
    });

    setIsLoading(false);
  };

  return isLoading ? (
    <Spinner animation="border" />
  ) : (
    <Line
      itemRef="chart"
      className="chartLegendContainer"
      data={data}
      options={options}
      redraw={true}
    />
  );
}
