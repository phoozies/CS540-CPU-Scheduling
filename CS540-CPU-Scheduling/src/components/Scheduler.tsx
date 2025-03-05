import { useState } from "react";
import { generateProcesses } from "../utils/generator";

export default function Scheduler({ runAlgorithm }: { runAlgorithm: Function }) {
    const [numProcesses, setNumProcesses] = useState(5);
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [processes, setProcesses] = useState(generateProcesses(5));

    const handleGenerate = () => {
        setProcesses(generateProcesses(numProcesses));
    };

    return (
        <div className="container">
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Number of Processes</span>
                <input type="number" className="form-control" value={numProcesses} onChange={(e) => setNumProcesses(Number(e.target.value))} />
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Set Time Quantum (RR ONLY)</span>
                <input type="number" className="form-control" value={timeQuantum} onChange={(e) => setTimeQuantum(Number(e.target.value))} />
            </div>


            <button className="btn btn-primary" onClick={handleGenerate}>Generate Processes</button>
            <button className="btn btn-secondary" onClick={() => runAlgorithm(processes, timeQuantum)}>Run Algorithm</button>

                        {/* Table to display generated processes */}
            <div className="mt-4">
                <h4>Generated Processes:</h4>
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Process ID</th>
                            <th>Arrival Time</th>
                            <th>Burst Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((process) => (
                            <tr key={process.id}>
                                <td>{process.id}</td>
                                <td>{process.arrival}</td>
                                <td>{process.burst}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
