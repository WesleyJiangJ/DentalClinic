import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function BarChart({ data }) {
    const chartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Realizadas',
                data: data.completed,
                backgroundColor: '#1E1E1E',
                borderColor: '#000000',
                borderWidth: 0,
            },
            {
                label: 'Canceladas',
                data: data.cancelled,
                backgroundColor: '#C62828',
                borderColor: '#000000',
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    // display: false,
                },
            },
            y: {
                grid: {
                    // display: false,
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };
    return <Bar data={chartData} options={chartOptions} />;
};