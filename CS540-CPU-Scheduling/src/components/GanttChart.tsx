import React, { useEffect, useRef } from "react";
import { Chart, ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
Chart.register(ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface GanttChartProps {
    results: { algorithm: string; result: any[] }[];
}

const GanttChart: React.FC<GanttChartProps> = ({ results }) => {
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

                // Create datasets for each algorithm's result
                const datasets = results.map((res, index) => {
                    const colors = [
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(75, 192, 192, 0.8)",
                        "rgba(153, 102, 255, 0.8)",
                        "rgba(255, 159, 64, 0.8)",
                    ];

                    return {
                        label: res.algorithm,
                        backgroundColor: colors[index % colors.length],
                        borderColor: colors[index % colors.length],
                        fill: false,
                        borderWidth: 15,
                        pointRadius: 0,
                        data: res.result.map((p) => ({
                            x: p.startTime,
                            y: p.id,
                            x2: p.finishTime,
                        })),
                    };
                });

                // Create the chart
                chartInstance.current = new Chart(ctx, {
                    type: "scatter",
                    data: {
                        datasets: datasets,
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
                            meta.data.forEach((point: any, index: number) => {
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
    }, [results]);

    return <canvas ref={chartRef} />;
};

export default GanttChart;