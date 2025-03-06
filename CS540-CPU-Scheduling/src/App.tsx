import { useState } from "react";
import Scheduler from "./components/Scheduler";
import GanttChart from "./components/GanttChart";
import ResultsTable from "./components/ResultsTable";
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
                <div className="row">
                    {results.length > 0 &&
                        results.map((res, index) => (
                            <div
                                key={index}
                                className={`col-12 col-md-6 mb-4 shadow-lg ${
                                    results.length % 2 === 1 && index === results.length - 1 ? "mx-auto" : ""
                                }`}
                            >
                                <h5>{res.algorithm}</h5>
                                <GanttChart
                                    algorithm={res.algorithm}
                                    result={res.result}
                                    color={colors[index % colors.length]} // Assign a color dynamically
                                />
                            </div>
                        ))}
                </div>
            </div>

            {/* Results Table Section */}
            <div className="mt-4">
                <h4>Results:</h4>
                <div className="row">
                    {results.length > 0 &&
                        results.map((res, index) => (
                            <div
                                key={index}
                                className={`col-12 col-md-6 mb-4 shadow-lg ${
                                    results.length % 2 === 1 && index === results.length - 1 ? "mx-auto" : ""
                                }`}
                            >
                                <ResultsTable results={[res]} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default App;
