import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ChartThree({ dnd, pending, todaysTask, callCompleted, reschedule }) {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: [
            'DND',
            'Pending',
            'Today Task',
            'Call Completed',
           
            'reschedule'
          ],
          scaleType: 'band'
        }
      ]}
      series={[
        {
          data: [dnd, pending, todaysTask, callCompleted, reschedule]
        }
      ]}
      width={500}
      height={450}
    />
  );
}
