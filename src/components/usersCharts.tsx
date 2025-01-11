import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserChartProps {
  sessions: { start_time: string; duration: string }[];
}

export const UserChart: React.FC<UserChartProps> = ({ sessions }) => {
  const labels = Array.from(
    new Set(
      sessions.map((session) =>
        new Date(session.start_time).toLocaleDateString()
      )
    )
  );

  const durations = labels.map((label) => {
    const totalDuration = sessions
      .filter(
        (session) => new Date(session.start_time).toLocaleDateString() === label
      )
      .reduce((acc, session) => {
        const durationParts = session.duration.split("h ");
        const [hours, minutes] = durationParts.map(Number);
        return acc + hours * 60 + minutes;
      }, 0);
    return totalDuration / 60; // Converter de minutos para horas
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Horas por Dia",
        data: durations,
        backgroundColor: "rgb(230, 121, 0, 0.5)",
        borderColor: "rgb(230, 121, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Horas Trabalhadas por Dia",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Horas",
        },
      },
      x: {
        title: {
          display: true,
          text: "Dias",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};
