import { useState, useRef } from "react";
import Scheduler from "./components/Scheduler";
import GanttChart from "./components/GanttChart";
import ResultsTable from "./components/ResultsTable";
import ProcessTable from "./components/ProcessTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

    const generatePDF = async () => {
        const doc = new jsPDF("p", "mm", "a4"); // Set page size to A4 (standard)
        let yOffset = 10; // Start position for adding content in the PDF

        const maxHeight = 270; // Height of the page before switching to a new one (A4 height - some margin)
        let isNewPage = false;

        // Capture Gantt charts
        for (let i = 0; i < results.length; i++) {
            const res = results[i];

            // Capture Gantt Chart for this result
            if (ganttRef.current) {
                const chartCanvas = ganttRef.current.querySelectorAll("canvas")[i];
                if (chartCanvas) {
                    const canvasImage = chartCanvas.toDataURL("image/png");
                    // Add image to the PDF
                    doc.addImage(canvasImage, "PNG", 10, yOffset, 180, 100); // Adjust position and size
                    yOffset += 110; // Update offset for the next content (Gantt chart)
                }
            }

            // If the yOffset exceeds maxHeight, add a new page
            if (yOffset > maxHeight) {
                doc.addPage(); // Start a new page for the next content
                yOffset = 10; // Reset Y offset for the new page
            }

            // Capture Results Table
            if (tableRef.current) {
                const tableElement = tableRef.current;
                const canvas = await html2canvas(tableElement);
                const imgData = canvas.toDataURL("image/png");
                doc.addImage(imgData, "PNG", 10, yOffset, 180, 100); // Adjust position and size
                yOffset += 110; // Update offset for the next content (Results table)
            }

            // If the yOffset exceeds maxHeight, add a new page
            if (yOffset > maxHeight) {
                doc.addPage();
                yOffset = 10;
            }

            // Capture Processes Table
            if (processTableRef.current) {
                const processTableElement = processTableRef.current;
                const canvas = await html2canvas(processTableElement);
                const imgData = canvas.toDataURL("image/png");
                doc.addImage(imgData, "PNG", 10, yOffset, 180, 100); // Adjust position and size
                yOffset += 110; // Update offset for the next content (Processes table)
            }

            // If the yOffset exceeds maxHeight, add a new page
            if (yOffset > maxHeight) {
                doc.addPage();
                yOffset = 10;
            }
        }

        // Save the PDF
        doc.save("cpu_scheduling_results.pdf");
    };

    return (
        <div className="container text-center shadow-lg p-3 rounded">
            <h1 className="text-center p-3 text-white rounded shadow-lg" style={{ backgroundColor: "#27251F" }}>
                CPU Scheduling Simulator
            </h1>

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
                <button onClick={generatePDF} className="btn btn-warning">
                    Save as PDF
                </button>
            </div>
        </div>
    );
}

export default App;
