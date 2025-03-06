import { useState } from "react";
import { generateProcesses } from "../utils/generator";
import Controls from "./Controls";
import ProcessTable from "./ProcessTable";
import AlgorithmSelector from "./AlgorithmSelector";
import { fifo, sjf, stcf, rr, mlfq } from "../utils/algorithms"; // Import all algorithms

const algorithmMap: any = { fifo, sjf, stcf, rr, mlfq };

export default function Scheduler({ setResults }: { setResults: Function }) {
    const [numProcesses, setNumProcesses] = useState(5);
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [processes, setProcesses] = useState(generateProcesses(5));

    const handleGenerate = () => {
        setProcesses(generateProcesses(numProcesses));
    };

    // Run selected algorithms and store results
    const runAlgorithms = (selectedAlgorithms: string[], timeQuantum: number) => {
        const results = selectedAlgorithms.map((alg) => ({
            algorithm: alg.toUpperCase(),
            result: algorithmMap[alg](processes, timeQuantum)
        }));
        setResults(results);
    };

    return (
        <div className="container">
            {/* Row 1 - Two Columns */}
            <div className="row mb-3">
                {/* Column 1: Controls */}
                <div className="col shadow-lg rounded mx-3 p-3">
                    <Controls
                        numProcesses={numProcesses}
                        setNumProcesses={setNumProcesses}
                        timeQuantum={timeQuantum}
                        setTimeQuantum={setTimeQuantum}
                        handleGenerate={handleGenerate}
                        runAlgorithm={runAlgorithms} // Modified function name
                        processes={processes}
                    />
                </div>

                {/* Column 2: Algorithm Selector (Checkboxes) */}
                <div className="col-md-6 shadow-lg rounded mx-3 p-3">
                    <AlgorithmSelector runAlgorithms={runAlgorithms} timeQuantum={timeQuantum} />
                </div>
            </div>

            {/* Row 2 - Process Table */}
            <div className="row">
                <div className="col shadow-lg rounded p-3 m-3">
                    <ProcessTable processes={processes} />
                </div>
            </div>
        </div>
    );
}
