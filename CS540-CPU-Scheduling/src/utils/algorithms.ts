
// Concept: The process that arrives first is executed first, without preemption.
// Use Case: Simple but may lead to the convoy effect where short jobs get stuck behind long ones.
export function fifo(processes: { id: number; arrival: number; burst: number }[]) {
    processes.sort((a, b) => a.arrival - b.arrival); // Sort by arrival time
    let currentTime = 0;
    let result: any[] = [];

    processes.forEach((p) => {
        let startTime = Math.max(currentTime, p.arrival);
        let finishTime = startTime + p.burst;
        result.push({ ...p, startTime, finishTime, waiting: startTime - p.arrival });
        currentTime = finishTime;
    });

    return result;
}

// Concept: The shortest job (smallest burst time) is executed first.
// Use Case: Minimizes average waiting time, but can lead to starvation if long processes keep getting postponed.
export function sjf(processes: { id: number; arrival: number; burst: number }[]) {
    processes.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
    let currentTime = 0;
    let result: any[] = [];

    processes.forEach((p) => {
        let startTime = Math.max(currentTime, p.arrival);
        let finishTime = startTime + p.burst;
        result.push({ ...p, startTime, finishTime, waiting: startTime - p.arrival });
        currentTime = finishTime;
    });

    return result;
}

// Concept: Preemptive version of SJF, always runs the process with the least remaining time.
// Use Case: Provides lower waiting time but requires frequent context switching.
export function stcf(processes: { id: number; arrival: number; burst: number }[]) {
    let time = 0;
    let completed = 0;
    let remaining = processes.map(p => ({ ...p, remaining: p.burst }));
    let result: any[] = [];

    while (completed < processes.length) {
        let available = remaining.filter(p => p.arrival <= time && p.remaining > 0);
        if (available.length > 0) {
            available.sort((a, b) => a.remaining - b.remaining);
            let current = available[0];
            current.remaining -= 1;
            if (current.remaining === 0) {
                completed++;
                result.push({ ...current, finishTime: time + 1, waiting: time + 1 - current.arrival - current.burst });
            }
        }
        time++;
    }
    
    return result;
}

// Concept: Each process gets a fixed time slice (quantum) before switching to the next.
// Use Case: Ensures fairness but may increase context switching.
export function rr(processes: { id: number; arrival: number; burst: number }[], quantum: number) {
    let queue = [...processes];
    let time = 0;
    let result: any[] = [];

    while (queue.length > 0) {
        let p = queue.shift()!;
        let executionTime = Math.min(p.burst, quantum);
        let finishTime = time + executionTime;
        result.push({ ...p, startTime: time, finishTime, remaining: p.burst - executionTime });
        
        if (p.burst > quantum) {
            queue.push({ ...p, burst: p.burst - quantum, arrival: finishTime });
        }

        time = finishTime;
    }

    return result;
}

// Concept: Multiple queues with different priority levels. A process moves between queues based on execution behavior.
// Use Case: Balances between fairness and responsiveness, widely used in real operating systems.
export function mlfq(processes: { id: number; arrival: number; burst: number }[]) {
    let queues = [[], [], []]; // Multiple queues for different priorities
    processes.forEach(p => queues[0].push({ ...p, remaining: p.burst }));

    let time = 0;
    let result: any[] = [];

    while (queues.flat().length > 0) {
        let p = queues[0].shift() || queues[1].shift() || queues[2].shift();
        let executionTime = Math.min(p.remaining, 4); // Example time slice
        let finishTime = time + executionTime;

        result.push({ ...p, startTime: time, finishTime, remaining: p.remaining - executionTime });
        
        if (p.remaining > executionTime) {
            queues[1].push({ ...p, remaining: p.remaining - executionTime });
        }

        time = finishTime;
    }

    return result;
}
