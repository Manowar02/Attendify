import React from 'react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#0f172a',
      },
    },
  },
};

export const AttendanceDoughnut = ({ present, absent }) => {
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['#ff4d4d', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={data} options={chartOptions} />;
};

export const SubjectBarChart = ({ subjects }) => {
  const data = {
    labels: subjects.map((subject) => subject.name),
    datasets: [
      {
        label: 'Attendance %',
        data: subjects.map((subject) => subject.percentage),
        backgroundColor: '#ff4d4d',
        borderRadius: 12,
      },
    ],
  };

  return <Bar data={data} options={chartOptions} />;
};
