// Return the processes data as a table
export default function ProcessTable({ processes }: { processes: any[] }) {
    return (
        <div className="mt-4">
            <h4 className="rounded shadow-lg bg-dark text-white p-2">Generated Processes:</h4>
            <table className="table table-bordered table-striped table-secondary">
                <thead className="table-secondary">
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
    );
}
