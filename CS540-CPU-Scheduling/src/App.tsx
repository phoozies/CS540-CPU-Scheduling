import { useState } from "react";
import Scheduler from "./components/Scheduler";
import GanttChart from "./components/GanttChart";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [results, setResults] = useState<any[]>([]);

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
            <div className="row mt-4">
                <div className="col">
                    <h4>Execution Timeline (Gantt Chart)</h4>
                    {results.map((res, index) => (
                        <div key={index} className="mb-4">
                            <h5>{res.algorithm}</h5>
                            <GanttChart
                                algorithm={res.algorithm}
                                result={res.result}
                                color={colors[index % colors.length]} // Assign a unique color
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Section */}
            <div className="row mt-4">
                <div className="col">
                    <h4>Results:</h4>
                    {results.map((res, index) => (
                        <div key={index} className="mt-3 p-2 border rounded bg-light">
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