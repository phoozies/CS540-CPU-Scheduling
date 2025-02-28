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
        <div>
            <input type="number" value={numProcesses} onChange={(e) => setNumProcesses(Number(e.target.value))} />
            <input type="number" value={timeQuantum} onChange={(e) => setTimeQuantum(Number(e.target.value))} />
            <button onClick={handleGenerate}>Generate Processes</button>
            <button onClick={() => runAlgorithm(processes, timeQuantum)}>Run Algorithm</button>
        </div>
    );
}
