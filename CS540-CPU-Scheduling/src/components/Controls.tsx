export default function Controls({ numProcesses, setNumProcesses, timeQuantum, setTimeQuantum, handleGenerate }: any) {
    return (
        <div>
            {/* Number of Processes Input */}
            <div className="input-group mb-3">
                <span className="input-group-text">Number of Processes</span>
                <input type="number" className="form-control" value={numProcesses} onChange={(e) => setNumProcesses(Number(e.target.value))} />
            </div>

            {/* Time Quantum Input (for RR) */}
            <div className="input-group mb-3">
                <span className="input-group-text">Time Quantum (RR ONLY)</span>
                <input type="number" className="form-control" value={timeQuantum} onChange={(e) => setTimeQuantum(Number(e.target.value))} />
            </div>

            {/* Buttons for Generating & Running */}
            <div className="text-center">
                <button className="btn btn-warning" onClick={handleGenerate}>Generate Processes</button>
            </div>
        </div>
    );
}