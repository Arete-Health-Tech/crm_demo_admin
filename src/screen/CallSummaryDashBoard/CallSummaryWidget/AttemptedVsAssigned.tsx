import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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
        fontSize: '18px',
        marginBottom: '20px'
      }}
    >
      <Legend
        layout="horizontal"
        verticalAlign="top"
        align="center"
        iconType="square"
        wrapperStyle={{ marginBottom: '10px' }}
      />

      <XAxis type="number" axisLine={false} tickLine={false} />
      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
      <Tooltip />
      <Bar
        dataKey="answered"
        fill="rgba(128, 128, 128, 0.296)"
        name="Calls Answered"
        stackId="a"
      />
      <Bar
        dataKey="attempted"
        fill="#0097b2"
        radius={[0, 10, 10, 0]}
        name="Calls Attempted"
        stackId="a"
      />
    </BarChart>
  );
};

export default AttemptedVsAssigned;
