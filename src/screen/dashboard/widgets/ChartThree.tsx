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
            'CallCompleted',
            'Reschedule'
          ],
          scaleType: 'band'
        }
      ]}
      series={[
        {
          data: [dnd, pending, todaysTask, callCompleted, reschedule]
        }
      ]}
      width={540}
      height={400}
      sx={{ fontSize: "12px", fontFamily: "Outfit,sans-serif" }}
    />
  );
}
