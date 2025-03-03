import React, { useState } from "react";
import Scheduler from "./components/Scheduler";
import { fifo } from "./utils/algorithms"; // Import an algorithm for testing
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const [results, setResults] = useState<any>(null);
    const [algorithm, setAlgorithm] = useState<string>("fifo");

    const runAlgorithm = (processes: any[], timeQuantum: number) => {
        const result = fifo(processes); // Replace 'fifo' with any algorithm
        setResults(result);
    };

    return (
        <div className="container">
            <h1 className="text-center">CPU Scheduling Simulator</h1>
            {/* Dropdown for Algorithm Selection */}
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                <option value="fifo">FIFO</option>
                <option value="sjf">SJF</option>
                <option value="stcf">STCF</option>
                <option value="rr">Round Robin</option>
                <option value="mlfq">MLFQ</option>
            </select>
            <Scheduler runAlgorithm={runAlgorithm} />
            <pre>{JSON.stringify(results, null, 2)}</pre> {/* Display results */}
        </div>
    );
}

export default App;
