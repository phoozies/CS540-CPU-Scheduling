import React, { useState } from "react";
import Scheduler from "./components/Scheduler";
import { fifo } from "./utils/algorithms"; // Import an algorithm for testing

function App() {
    const [results, setResults] = useState<any>(null);

    const runAlgorithm = (processes: any[], timeQuantum: number) => {
        const result = fifo(processes); // Replace 'fifo' with any algorithm
        setResults(result);
    };

    return (
        <div>
            <h1>CPU Scheduling Simulator</h1>
            <Scheduler runAlgorithm={runAlgorithm} />
            <pre>{JSON.stringify(results, null, 2)}</pre> {/* Display results */}
        </div>
    );
}

export default App;
