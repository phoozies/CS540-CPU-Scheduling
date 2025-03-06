import { useState, useRef } from "react";
import Scheduler from "./components/Scheduler";
import GanttChart from "./components/GanttChart";
import ResultsTable from "./components/ResultsTable";
import ProcessTable from "./components/ProcessTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { generatePdf } from "./utils/generatePDF.ts"; // Import the generatePDF function

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

    const ganttRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLDivElement | null>(null);
    const processTableRef = useRef<HTMLDivElement | null>(null); // Ref for Process Table

    return (
        <div className="container text-center shadow-lg p-3 rounded">
            <div className="text-center p-3 text-white rounded shadow-lg" style={{ backgroundColor: "#27251F" }}>
                <h1>
                    CPU Scheduling Simulator
                </h1>
                <h2 className="fst-italic">
                    CS540 Operating Systems Project: Thinh Vo
                </h2>
            </div>

            {/* Scheduler Component */}
            <Scheduler setResults={setResults} />

            {/* Gantt Chart Section */}
            <div ref={ganttRef} className="mt-4 container-fluid shadow-lg m-3 rounded">
                <h4 className="rounded bg-dark p-2 text-white">Execution Timeline (Gantt Chart)</h4>
                <div className="row">
                    {results.length > 0 &&
                        results.map((res, index) => (
                            <div
                                key={index}
                                className={`col-12 col-md-6 mb-4 ${
                                    results.length % 2 === 1 && index === results.length - 1 ? "mx-auto" : ""
                                }`}
                            >
                                <h5 className="shadow-lg text-white p-2 m-2 rounded">{res.algorithm}</h5>
                                <GanttChart
                                    algorithm={res.algorithm}
                                    result={res.result}
                                    color={colors[index % colors.length]} // Assign a color dynamically
                                    isExportingPDF={true} // Set flag to export with black colors for PDF
                                />
                            </div>
                        ))}
                </div>
            </div>

            {/* Results Table Section */}
            <div ref={tableRef} className="mt-4 container-fluid shadow-lg m-3 rounded">
                <h4 className="shadow-lg rounded bg-dark text-white p-3">Results Table:</h4>
                <div className="row">
                    {results.length > 0 &&
                        results.map((res, index) => (
                            <div
                                key={index}
                                className={`col-12 col-md-6 mb-4 ${
                                    results.length % 2 === 1 && index === results.length - 1 ? "mx-auto" : ""
                                }`}
                            >
                                <ResultsTable results={[res]} />
                            </div>
                        ))}
                </div>
            </div>

            {/* Process Table Section */}
            <div ref={processTableRef} className="mt-4 container-fluid shadow-lg m-3 rounded">
                <h4 className="shadow-lg rounded bg-dark text-white p-3">Processes Table:</h4>
                <div className="row">
                    {results.length > 0 &&
                        results.map((res, index) => (
                            <div
                                key={index}
                                className={`col-12 col-md-6 mb-4 ${
                                    results.length % 2 === 1 && index === results.length - 1 ? "mx-auto" : ""
                                }`}
                            >
                                <ProcessTable processes={res.result} />
                            </div>
                        ))}
                </div>
            </div>

            {/* Button to Generate PDF */}
            <div className="mt-4">
                <button onClick={() => generatePdf(results, ganttRef, tableRef, processTableRef)} className="btn btn-warning">
                    Save as PDF
                </button>
            </div>
        </div>
    );
}

export default App;
