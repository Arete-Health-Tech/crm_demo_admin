import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fontSize } from 'pdfkit';
import useUserStore from '../../../store/userStore';

const AttemptedVsAssigned = ({
  callAssigned,
  callAttemmpted,
  user,
  todayTaskForAdmin,
  selectedAgents
}) => {
  const users = useUserStore.getState();

  let data;
  if (users?.user?.role === 'ADMIN' && selectedAgents._id === '') {
    data = todayTaskForAdmin.map((item) => ({
      name: item.name,
      assigned: item.todaysTaskAnsweredForAdmin || 0,
      attempted: item.totalcallLAttemptedForAdmin || 0
    }));
  } else {
    data = [
      {
        name: users?.user?.role === 'ADMIN' ? selectedAgents.firstName : user,
        assigned: callAssigned || 0,
        attempted: callAttemmpted || 0
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
        fontSize: '16px'
      }}
    >
      <Legend layout="horizontal" verticalAlign="top" align="center" />
      <XAxis
        type="number"
        axisLine={false}
        tickLine={false}
        domain={[0, 'dataMax']}
      />
      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
      <Tooltip />
      <Bar
        dataKey="assigned"
        fill="rgba(128, 128, 128, 0.296)"
        radius={[0, 5, 5, 0]}
        name="Calls Assigned"
      />
      <Bar
        dataKey="attempted"
        fill="#0097b2"
        radius={[0, 5, 5, 0]}
        name="Calls Attempted"
      />
    </BarChart>
  );
};

export default AttemptedVsAssigned;
