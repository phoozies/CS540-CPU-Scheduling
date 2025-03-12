import { useState } from "react";

// Declare the algorithms
const algorithmOptions = [
    { value: "fifo", label: "FIFO" },
    { value: "sjf", label: "SJF" },
    { value: "stcf", label: "STCF" },
    { value: "rr", label: "Round Robin" },
    { value: "mlfq", label: "MLFQ" }
];

export default function AlgorithmSelector({ runAlgorithms, timeQuantum }: any) {
    // Keep track of selected algorithms with use state
    const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

    // Handle checkbox selection
    const handleCheckboxChange = (value: string) => {
        setSelectedAlgorithms((prev) =>
            prev.includes(value) ? prev.filter((alg) => alg !== value) : [...prev, value]
        );
    };

    // Return html element
    return (
        <div className="text-center">
            <h4 className="text-white rounded p-2 shadow">Select Algorithms</h4>
            
            {/* Algorithm Selection Checkboxes */}
            <div className="d-flex flex-column align-items-start mx-auto" style={{ width: "fit-content" }}>
                {algorithmOptions.map((alg) => (
                    <div key={alg.value} className="form-check d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            id={alg.value}
                            checked={selectedAlgorithms.includes(alg.value)}
                            onChange={() => handleCheckboxChange(alg.value)}
                        />
                        <label className="form-check-label text-white" htmlFor={alg.value}>{alg.label}</label>
                    </div>
                ))}
            </div>

            {/* Button to Run Selected Algorithms */}
            <button
                className="btn btn-warning mt-3"
                onClick={() => runAlgorithms(selectedAlgorithms, timeQuantum)}
                disabled={selectedAlgorithms.length === 0}
            >
                Run Selected Algorithms
            </button>
        </div>
    );
}
