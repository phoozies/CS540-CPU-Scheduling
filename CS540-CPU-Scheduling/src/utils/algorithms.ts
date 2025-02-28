export function fifo(processes: { id: number; arrival: number; burst: number }[]) {
    return processes.sort((a, b) => a.arrival - b.arrival);
}
