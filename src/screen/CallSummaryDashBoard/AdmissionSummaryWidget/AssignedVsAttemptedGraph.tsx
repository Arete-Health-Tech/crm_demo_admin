import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fontSize } from 'pdfkit';

const AttemptedVsAssigned = () => {
  const data = [
    { name: 'Meena', answered: 6, attempted: 10 },
    { name: 'Parul', answered: 8, attempted: 14 }
  ];

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      layout="vertical"
      style={{
        fontSize: '18px'
      }}
    >
      <Legend
        layout="horizontal"
        verticalAlign="top"
        align="center"
        // spacing={'40px'}
      />

      <XAxis type="number" axisLine={false} tickLine={false} />
      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
      <Tooltip />
      <Bar
        dataKey="answered"
        fill="rgba(128, 128, 128, 0.296)"
        radius={[0, 5, 5, 0]}
        name="Call Answered"
      />
      <Bar
        dataKey="attempted"
        fill="#0097b2"
        radius={[0, 5, 5, 0]}
        name="Call Attempted"
      />
    </BarChart>
  );
};

export default AttemptedVsAssigned;
