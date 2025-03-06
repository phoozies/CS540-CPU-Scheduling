
// Concept: The process that arrives first is executed first, without preemption.
// Use Case: Simple but may lead to the convoy effect where short jobs get stuck behind long ones.
export function fifo(processes: { id: number; arrival: number; burst: number }[]) {
    processes.sort((a, b) => a.arrival - b.arrival); // Sort by arrival time
    let currentTime = 0;
    let result: any[] = [];

    processes.forEach((p) => {
        let startTime = Math.max(currentTime, p.arrival);
        let finishTime = startTime + p.burst;
        let waitingTime = startTime - p.arrival; // Correct waiting time calculation
        result.push({ ...p, startTime, finishTime, waiting: waitingTime });
        currentTime = finishTime;
    });

    return result;
}

// Concept: The shortest job (smallest burst time) is executed first.
// Use Case: Minimizes average waiting time, but can lead to starvation if long processes keep getting postponed.
export function stcf(processes: { id: number; arrival: number; burst: number }[]) {
    let time = 0;
    let completed = 0;
    let remaining = processes.map(p => ({ ...p, remaining: p.burst })); // Properly typed
    let result: any[] = [];
    let waitingTimes = new Array(processes.length).fill(0); // Track waiting times

    while (completed < processes.length) {
        let available = remaining.filter(p => p.arrival <= time && p.remaining > 0);
        if (available.length > 0) {
            available.sort((a, b) => a.remaining - b.remaining); // Sort by remaining time
            let current = available[0];
            current.remaining -= 1;

            // Update waiting times for other processes
            remaining.forEach(p => {
                if (p.id !== current.id && p.arrival <= time && p.remaining > 0) {
                    waitingTimes[p.id - 1] += 1; // Increment waiting time
                }
            });

            if (current.remaining === 0) {
                completed++;
                result.push({ 
                    ...current, 
                    finishTime: time + 1, 
                    waiting: waitingTimes[current.id - 1] // Use tracked waiting time
                });
            }
        }
        time++;
    }

    return result;
}

// Concept: Each process gets a fixed time slice (quantum) before switching to the next.
// Use Case: Ensures fairness but may increase context switching.
export function rr(processes: { id: number; arrival: number; burst: number }[], quantum: number) {
    let queue = [...processes]; // Properly typed
    let time = 0;
    let result: any[] = [];
    let waitingTimes = new Array(processes.length).fill(0); // Track waiting times

    while (queue.length > 0) {
        let p = queue.shift()!;
        let executionTime = Math.min(p.burst, quantum);
        let finishTime = time + executionTime;

        // Update waiting times for other processes
        queue.forEach(proc => {
            if (proc.arrival <= time && proc.id !== p.id) {
                waitingTimes[proc.id - 1] += executionTime;
            }
        });

        result.push({ 
            ...p, 
            startTime: time, 
            finishTime, 
            remaining: p.burst - executionTime,
            waiting: waitingTimes[p.id - 1] // Use tracked waiting time
        });

        if (p.burst > quantum) {
            queue.push({ ...p, burst: p.burst - quantum, arrival: finishTime });
        }

        time = finishTime;
    }

    return result;
}

// Concept: Multiple queues with different priority levels. A process moves between queues based on execution behavior.
// Use Case: Balances between fairness and responsiveness, widely used in real operating systems.
interface Process {
    id: number;
    arrival: number;
    burst: number;
    remaining?: number; // Optional for tracking remaining time
}

interface Queue {
    priority: number;
    timeSlice: number;
    processes: Process[];
}

export function mlfq(processes: Process[]) {
    let queues: Queue[] = [
        { priority: 0, timeSlice: 4, processes: [] }, // Highest priority, smallest time slice
        { priority: 1, timeSlice: 8, processes: [] }, // Medium priority
        { priority: 2, timeSlice: Infinity, processes: [] } // Lowest priority, no time slice
    ];

    // Initialize all processes in the highest priority queue
    processes.forEach(p => queues[0].processes.push({ ...p, remaining: p.burst }));

    let time = 0;
    let result: any[] = [];
    let waitingTimes = new Array(processes.length).fill(0); // Track waiting times

    while (queues.some(q => q.processes.length > 0)) {
        for (let queue of queues) {
            if (queue.processes.length > 0) {
                let p = queue.processes.shift()!;
                let executionTime = Math.min(p.remaining!, queue.timeSlice);
                let finishTime = time + executionTime;

                // Update waiting times for other processes
                queues.forEach(q => {
                    q.processes.forEach(proc => {
                        if (proc.id !== p.id && proc.arrival <= time) {
                            waitingTimes[proc.id - 1] += executionTime;
                        }
                    });
                });

                result.push({ 
                    ...p, 
                    startTime: time, 
                    finishTime, 
                    remaining: p.remaining! - executionTime,
                    waiting: waitingTimes[p.id - 1] // Use tracked waiting time
                });

                if (p.remaining! > executionTime) {
                    // Move to the next lower priority queue
                    let nextQueue = queues[queue.priority + 1] || queues[queues.length - 1];
                    nextQueue.processes.push({ ...p, remaining: p.remaining! - executionTime });
                }

                time = finishTime;
                break; // Move to the next time unit
            }
        }
    }

    return result;
}