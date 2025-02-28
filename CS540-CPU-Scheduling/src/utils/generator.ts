export function generateProcesses(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        arrival: Math.floor(Math.random() * 10),
        burst: Math.floor(Math.random() * 10) + 1,
    }));
}
