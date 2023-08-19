import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780,];
const pData = [2400, 1398, 9800, 3908,];
const xLabels = [
  'M1',
  'M2',
  'M3',
  'M4',
  
];

export default function ChartOne() {
  return (
    <BarChart
      width={430}
      height={450}
      series={[
        { data: pData, label: 'Not Converted', id: 'pvId', stack: 'total' },
        { data: uData, label: ' Converted', id: 'uvId', stack: 'total' }
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
}
