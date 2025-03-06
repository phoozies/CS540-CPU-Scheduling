import React from "react";
import { Bar } from "react-chartjs-2";

interface GanttChartProps {
    results: any[];
}

const GanttChart: React.FC<GanttChartProps> = ({ results }) => {
    const data = {
        labels: results.map((res) => res.algorithm),
        datasets: [
            {
                label: "Waiting Time",
                data: results.map((res) => res.result.reduce((acc: number, p: any) => acc + p.waiting, 0)),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Bar data={data} />
        </div>
    );
};

export default GanttChart;