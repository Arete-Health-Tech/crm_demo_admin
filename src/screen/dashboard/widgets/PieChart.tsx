
import React, { useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface PieChartProps {
  newLead: number;
  contacted: number;
  working: number;
  orientation: number;
  nurturing: number;
}

const PieChart: React.FC<PieChartProps> = ({
  newLead,
  contacted,
  working,
  orientation,
  nurturing,
}) => {
  const chartRef = useRef<Chart<'pie'> | null>(null);

  const data = {
    labels: ['New Lead', 'Contacted', 'Working', 'Orientation', 'Nurturing'],
    datasets: [
      {
        data: [newLead, contacted, working, orientation, nurturing],
        backgroundColor: ['#3cb371', '#ffa500', '#6a5acd', '#ee82ee', '#686868'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FHCE50', '#FCCE59'],
      },
    ],
  };

  const options: ChartConfiguration<'pie'>['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
    maintainAspectRatio: false,
    responsive: false,
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = chartRef.current?.ctx;
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const setChartRef = (ref: HTMLCanvasElement | null) => {
    if (ref) {
      chartRef.current?.destroy();
      chartRef.current = new Chart(ref, {
        type: 'pie',
        data: data,
        options: options,
      });

    }
  };

  return <canvas
    width={450}
    height={470}
    ref={setChartRef} />;
};

export default PieChart;

