import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Pie } from 'react-chartjs-2';

const uData = [4000, 3000, 2000, 2780,];
const pData = [2400, 1398, 9800, 3908,];
const xLabels = [
  'M1',
  'M2',
  'M3',
  'M4',
  
];

export default function PieChart() {
  const data = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [
      {
        data: [30, 40, 30], // Data values for each segment
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each segment
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };
  
      const options = {
        plugins: {
          legend: {
            display: true,
            position: 'right' as const
          }
        },
        maintainAspectRatio: false,
        responsive: false, // Set to false to allow defining custom width and height
        width: 50,
        height: 50
      };
  return <Pie data={data} options={options} />;
}
