import React, { useState } from "react";
import Scheduler from "./components/Scheduler";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [results, setResults] = useState<any[]>([]);

    return (
        <div className="container text-center shadow-lg p-3 rounded">
            <h1 className="text-center">CPU Scheduling Simulator</h1>

            {/* Scheduler Component */}
            <Scheduler setResults={setResults} />

            {/* Results Section */}
            <div className="row mt-4">
                <div className="col">
                    <h4>Results:</h4>
                    {results.map((res, index) => (
                        <div key={index} className="mt-3 p-2 border rounded bg-light">
                            <h5>{res.algorithm}</h5>
                            <pre>{JSON.stringify(res.result, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
