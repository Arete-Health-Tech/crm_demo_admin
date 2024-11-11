import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function CallNotAnswered() {
  return (
    <PieChart
      series={[
        {
          data: [
            {
              id: 0,
              value: 10,
              label: 'DNP',
              color: 'rgba(128, 128, 128, 0.296)'
            },
            { id: 1, value: 15, label: 'Not Contacted', color: '#0097b2' }
          ]
        }
      ]}
      width={600}
      height={210}
    />
  );
}
