import { Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useState } from 'react';

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip
);

type IComponentState = {
  options: any;
};

const initialState: IComponentState = {
  options: {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  },
};

type IComponentProps = {
  data: {
    labels: string[];
    datasets: {
      data: any[];
      backgroundColor?: any[];
      hoverBackgroundColor?: any[];
      borderColor?: any[];
      legendColor?: any[];
    }[];
  };
};

const ComponentChartDonut = React.memo((props: IComponentProps) => {
  const [options, setOptions] = useState(initialState.options);

  return <Doughnut data={props.data} options={options} />;
});

export default ComponentChartDonut;
