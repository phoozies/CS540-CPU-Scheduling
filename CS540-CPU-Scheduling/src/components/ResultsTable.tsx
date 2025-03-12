import React from "react";

interface Process {
    id: number;
    arrival: number;
    burst: number;
    startTime: number;
    finishTime: number;
    waiting: number;
}

interface ResultsTableProps {
    results: { algorithm: string; result: Process[] }[];
}

// Return the algorithm results as a table
const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
    return (
        <div className="shadow-lg m-3 p-3 rounded">
            <div className="table-responsive">
                {results.map((res, index) => (
                    <div key={index} className="mb-4">
                        <h5 className="rounded shadow text-white p-2">{res.algorithm}</h5>
                        <table className="table table-bordered table-striped table-secondary">
                            <thead className="table table-secondary">
                                <tr>
                                    <th>Process ID</th>
                                    <th>Arrival Time</th>
                                    <th>Burst Time</th>
                                    <th>Start Time</th>
                                    <th>Finish Time</th>
                                    <th>Waiting Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {res.result.map((process) => (
                                    <tr key={process.id}>
                                        <td>{process.id}</td>
                                        <td>{process.arrival}</td>
                                        <td>{process.burst}</td>
                                        <td>{process.startTime}</td>
                                        <td>{process.finishTime}</td>
                                        <td>{process.waiting}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsTable;
