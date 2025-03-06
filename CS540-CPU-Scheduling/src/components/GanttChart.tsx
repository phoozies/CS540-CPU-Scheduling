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
    isExportingPDF?: boolean; // Flag to check if we are exporting to PDF
}

const GanttChart: React.FC<GanttChartProps> = ({ algorithm, result, color, isExportingPDF = false }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<"scatter"> | null>(null);
    const [currentTime, setCurrentTime] = useState(0); // Track current time
    const [, setActiveProcesses] = useState<Process[]>([]); // Track active processes
    const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]); // Track completed processes
    const [isFinished, setIsFinished] = useState(false); // Flag to check if the simulation is finished

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
                            duration: 500,
                            easing: "linear",
                        },
                        scales: {
                            x: {
                                type: "linear",
                                position: "bottom",
                                title: {
                                    display: true,
                                    text: "Timeline",
                                    color: isExportingPDF ? "black" : "white", // Change to black for PDF
                                },
                                ticks: {
                                    color: isExportingPDF ? "black" : "white", // Change to black for PDF
                                },
                                grid: {
                                    color: isExportingPDF ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)", // Light black grid lines for PDF
                                },
                                min: 0,
                                max: totalTime,
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Process ID",
                                    color: isExportingPDF ? "black" : "white", // Change to black for PDF
                                },
                                ticks: {
                                    color: isExportingPDF ? "black" : "white", // Change to black for PDF
                                },
                                grid: {
                                    color: isExportingPDF ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)", // Light black grid lines for PDF
                                },
                                min: 0,
                            },
                        },
                        plugins: {
                            tooltip: {
                                titleColor: isExportingPDF ? "black" : "white", // Tooltip title black for PDF
                                bodyColor: isExportingPDF ? "black" : "white", // Tooltip text black for PDF
                            },
                            legend: {
                                labels: {
                                    color: isExportingPDF ? "black" : "white", // Legend labels black for PDF
                                },
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
                            meta.data.forEach((_point: any, index: number) => {
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
    }, [algorithm, color, completedProcesses, totalTime, isExportingPDF]);

    // Simulate the passage of time and update active and completed processes
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isFinished) {
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

                    // Check if all processes are done
                    if (newTime >= totalTime) {
                        clearInterval(interval);
                        setIsFinished(true); // Set the simulation as finished
                    }

                    return newTime;
                });
            }
        }, 500); // Update every 500ms

        return () => clearInterval(interval); // Cleanup on unmount
    }, [result, completedProcesses, totalTime, isFinished]);

    return (
        <div className="rounded shadow-lg m-3 p-3">
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
