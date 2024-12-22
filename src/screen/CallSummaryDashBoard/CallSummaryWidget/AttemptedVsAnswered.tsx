import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import useUserStore from '../../../store/userStore';

const AttemptedVsAnswered = ({
  callAttemmpted,
  callAnswered,
  user,
  todayTaskForAdmin,
  selectedAgents
}) => {
  const users = useUserStore.getState();

  let data;

  if (users?.user?.role === 'ADMIN' && selectedAgents._id === '') {
    data = todayTaskForAdmin.map((item, index) => ({
      name: item.name,
      attempted: item.totalcallLAttemptedForAdmin || 0,
      answered: item.totalcallLAnsweredforGraphForAdmin || 0
    }));
  } else {
    data = [
      {
        name: users?.user?.role === 'ADMIN' ? selectedAgents.firstName : user,
        attempted: callAttemmpted,
        answered: callAnswered
      }
    ];
  }

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
        dataKey="attempted"
        fill="rgba(128, 128, 128, 0.296)"
        name="Calls Attempted"
        stackId="a"
      />
      <Bar
        dataKey="answered"
        fill="#0097b2"
        radius={[0, 10, 10, 0]}
        name="Calls Answered"
        stackId="a"
      />
    </BarChart>
  );
};

export default AttemptedVsAnswered;
