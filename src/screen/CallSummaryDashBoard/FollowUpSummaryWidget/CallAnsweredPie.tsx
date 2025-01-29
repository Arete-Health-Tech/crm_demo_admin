import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const size = {
  width: 600,
  height: 210
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 30
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function CallAnswered({ todayTaskAnswered }) {
  const data = [
    {
      value: todayTaskAnswered?.CallCompleted,
      label: 'Call Completed ',
      color: '#0097b2'
    },
    {
      value: todayTaskAnswered?.dnp,
      label: 'DNP',
      color: 'rgba(128, 128, 128, 0.296)'
    }
  ];

  return (
    <PieChart series={[{ data, innerRadius: 50 }]} {...size}>
      <PieCenterLabel>
        {(todayTaskAnswered?.CallCompleted || 0) +
          (todayTaskAnswered?.dnp || 0)}
      </PieCenterLabel>
    </PieChart>
  );
}
