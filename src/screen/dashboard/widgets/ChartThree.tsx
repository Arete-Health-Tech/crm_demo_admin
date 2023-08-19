import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ChartThree() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: ['New Lead', 'Contacted', 'Orientation','Nurturung','Working','Converted'],
          scaleType: 'band'
        }
      ]}
      series={[
        {
          data: [2, 5, 3,4,1,9]
        }
      ]}
      width={500}
      height={450}
    />
  );
}
