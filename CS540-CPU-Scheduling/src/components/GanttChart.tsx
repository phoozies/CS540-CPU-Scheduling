import React, { useEffect, useRef, useState } from "react";
import { Chart, ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
Chart.register(ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Process {
    id: number;
    startTime: number;
    finishTime: number;
}

interface GanttChartProps {
    algorithm: string;
    result: Process[]; // List of processes
    color: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ algorithm, result, color }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<"scatter"> | null>(null);
    const [currentTime, setCurrentTime] = useState(0); // Track current time
    const [activeProcesses, setActiveProcesses] = useState<Process[]>([]); // Track active processes
    const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]); // Track completed processes

    // Calculate the total duration (max finish time) of all processes
    const totalTime = Math.max(...result.map(p => p.finishTime));

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                // Destroy existing chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Create the chart
                chartInstance.current = new Chart(ctx, {
                    type: "scatter",
                    data: {
                        datasets: [
                            {
                                label: algorithm,
                                backgroundColor: color,
                                borderColor: color,
                                fill: false,
                                borderWidth: 15,
                                pointRadius: 0,
                                data: completedProcesses.map((p) => ({
                                    x: p.startTime,
                                    y: p.id,
                                    x2: p.finishTime,
                                })),
                            },
                        ],
                    },
                    options: {
                        animation: {
                            duration: 500, // Animation duration in milliseconds
                            easing: "linear", // Smooth linear animation
                        },
                        scales: {
                            x: {
                                type: "linear",
                                position: "bottom",
                                title: {
                                    display: true,
                                    text: "Timeline",
                                },
                                min: 0, // Start the x-axis from 0
                                max: totalTime, // Set the max to total time (finish time of last process)
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
    }, [algorithm, color, completedProcesses, totalTime]);

    // Simulate the passage of time and update active and completed processes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime((prevTime) => {
                const newTime = prevTime + 1;

                // Find processes that have started but not yet finished
                const newActiveProcesses = result
                    .filter((p) => p.startTime <= newTime && p.finishTime >= newTime)
                    .map((p) => ({
                        ...p,
                        finishTime: newTime, // Update the finish time to the current time
                    }));

                // Append active processes to completed processes if finished
                const completed = newActiveProcesses.filter(p => p.finishTime >= p.startTime);
                const newCompletedProcesses = [...completedProcesses, ...completed];

                setActiveProcesses(newActiveProcesses);
                setCompletedProcesses(newCompletedProcesses);

                // Stop the animation when all processes are done
                if (newTime >= totalTime) {
                    clearInterval(interval);
                }

                return newTime;
            });
        }, 500); // Update every 500ms

        return () => clearInterval(interval); // Cleanup on unmount
    }, [result, completedProcesses, totalTime]);

    return (
        <div>
            <canvas ref={chartRef} />
            <div className="mt-3">
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${(currentTime / totalTime) * 100}%`,
                            backgroundColor: color,
                        }}
                        aria-valuenow={currentTime}
                        aria-valuemin={0}
                        aria-valuemax={totalTime}
                    >
                        {currentTime}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
