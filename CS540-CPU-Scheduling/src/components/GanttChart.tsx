import React, { useEffect, useRef } from "react";
import { Chart, ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
Chart.register(ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface GanttChartProps {
    algorithm: string;
    result: any[];
    color: string; // Add a color prop
}

const GanttChart: React.FC<GanttChartProps> = ({ algorithm, result, color }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<"scatter"> | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                // Destroy existing chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Create dataset for the algorithm's result
                const dataset = {
                    label: algorithm,
                    backgroundColor: color,
                    borderColor: color,
                    fill: false,
                    borderWidth: 15,
                    pointRadius: 0,
                    data: result.map((p) => ({
                        x: p.startTime,
                        y: p.id,
                        x2: p.finishTime,
                    })),
                };

                // Create the chart
                chartInstance.current = new Chart(ctx, {
                    type: "scatter",
                    data: {
                        datasets: [dataset],
                    },
                    options: {
                        scales: {
                            x: {
                                type: "linear",
                                position: "bottom",
                                title: {
                                    display: true,
                                    text: "Timeline",
                                },
                                min: 0, // Start the x-axis from 0
                                ticks: {
                                    stepSize: 1,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Process ID",
                                },
                                min: 0, // Start the y-axis from 0
                                ticks: {
                                    stepSize: 1,
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const data = context.raw as { x: number; y: number; x2: number };
                                        return `Process ${data.y}: ${data.x} to ${data.x2}`;
                                    },
                                },
                            },
                            legend: {
                                display: true,
                                position: "top",
                            },
                        },
                    },
                });

                // Add a custom plugin to draw horizontal bars
                const plugin = {
                    id: "customHorizontalBars",
                    beforeDatasetsDraw: (chart: any) => {
                        const ctx = chart.ctx;
                        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            meta.data.forEach((index: number) => {
                                const data = dataset.data[index];
                                const xScale = chart.scales.x;
                                const yScale = chart.scales.y;

                                const xStart = xScale.getPixelForValue(data.x);
                                const xEnd = xScale.getPixelForValue(data.x2);
                                const y = yScale.getPixelForValue(data.y);

                                ctx.save();
                                ctx.fillStyle = dataset.backgroundColor;
                                ctx.fillRect(xStart, y - 5, xEnd - xStart, 10); // Draw a horizontal bar
                                ctx.restore();
                            });
                        });
                    },
                };

                // Register the custom plugin
                Chart.register(plugin);
            }
        }

        // Cleanup on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [algorithm, result, color]);

    return <canvas ref={chartRef} />;
};

export default GanttChart;