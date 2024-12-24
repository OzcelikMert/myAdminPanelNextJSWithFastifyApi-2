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
    scales: {
      y: {
        beginAtZero: true,
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
  labels: string[];
  data: any[];
  toolTipLabel?: string;
};

export default function ComponentChartArea(props: IComponentProps) {
  const [options, setOptions] = useState<IComponentState['options']>(
    initialState.options
  );
  const [data, setData] = useState<IComponentState['data']>(initialState.data);
  const [isLoading, setIsLoading] = useState<IComponentState['isLoading']>(
    initialState.isLoading
  );

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const bgColor = 'rgba(28,57,189,0.71)';
    const borderColor = '#1863d3';
    const pointBorderColor = '#6a0e98';

    setData({
      labels: props.labels,
      datasets: [
        {
          fill: true,
          pointBorderWidth: 7,
          pointBorderColor: pointBorderColor,
          label: props.toolTipLabel,
          borderColor: borderColor,
          backgroundColor: bgColor,
          hoverBackgroundColor: bgColor,
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
    />
  );
}
