import { useState } from "react";
import Scheduler from "./components/Scheduler";
import GanttChart from "./components/GanttChart";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [results, setResults] = useState<{ algorithm: string; result: any[] }[]>([]);

    // Define a list of colors for the charts
    const colors = [
        "rgba(255, 99, 132, 0.8)", // Red
        "rgba(54, 162, 235, 0.8)", // Blue
        "rgba(75, 192, 192, 0.8)", // Green
        "rgba(153, 102, 255, 0.8)", // Purple
        "rgba(255, 159, 64, 0.8)", // Orange
    ];

    return (
        <div className="container text-center shadow-lg p-3 rounded">
            <h1 className="text-center">CPU Scheduling Simulator</h1>

            {/* Scheduler Component */}
            <Scheduler setResults={setResults} />

            {/* Gantt Chart Section */}
            <div className="mt-4">
                <h4>Execution Timeline (Gantt Chart)</h4>

                {results.length > 0 && (
                    <>
                        {results.reduce<{ algorithm: string; result: any[] }[][]>((rows, res, index) => {
                            if (index % 2 === 0) {
                                // Start a new row every 2 charts
                                rows.push([res]);
                            } else {
                                // Add to the current row
                                rows[rows.length - 1].push(res);
                            }
                            return rows;
                        }, []).map((row: { algorithm: string; result: any[] }[], rowIndex: number) => (
                            <div className="row justify-content-center mt-3" key={rowIndex}>
                                {row.map((res: { algorithm: string; result: any[] }, index: number) => (
                                    <div key={index} className="col-md-6 mb-4">
                                        <h5>{res.algorithm}</h5>
                                        <GanttChart
                                            algorithm={res.algorithm}
                                            result={res.result}
                                            color={colors[(rowIndex * 2 + index) % colors.length]} // Assign a unique color
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Results Section */}
            <div className="mt-4">
                <h4>Results:</h4>
                <div className="row justify-content-center">
                    {results.map((res: { algorithm: string; result: any[] }, index: number) => (
                        <div key={index} className="col-md-6 mt-3 p-2 border rounded bg-light">
                            <h5>{res.algorithm}</h5>
                            <pre>{JSON.stringify(res.result, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
