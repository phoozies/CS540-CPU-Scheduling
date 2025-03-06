// src/utils/generatePdf.ts

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePdf = async (
    results: { algorithm: string; result: any[] }[],
    ganttRef: React.RefObject<HTMLDivElement | null>,
    tableRef: React.RefObject<HTMLDivElement | null>,
    processTableRef: React.RefObject<HTMLDivElement | null>
) => {
    const doc = new jsPDF("p", "mm", "a4"); // Set page size to A4 (standard)
    let yOffset = 10; // Start position for adding content in the PDF

    const maxHeight = 270; // Height of the page before switching to a new one (A4 height - some margin)

    // Capture Gantt charts
    for (let i = 0; i < results.length; i++) {

        // Capture Gantt Chart for this result
        if (ganttRef.current) {
            const chartCanvas = ganttRef.current.querySelectorAll("canvas")[i];
            if (chartCanvas) {
                const canvasImage = chartCanvas.toDataURL("image/png");
                // Add image to the PDF
                doc.addImage(canvasImage, "PNG", 10, yOffset, 180, 100); // Adjust position and size
                yOffset += 110; // Update offset for the next content (Gantt chart)
            }
        }

        // If the yOffset exceeds maxHeight, add a new page
        if (yOffset > maxHeight) {
            doc.addPage(); // Start a new page for the next content
            yOffset = 10; // Reset Y offset for the new page
        }

        // Capture Results Table
        if (tableRef.current) {
            const tableElement = tableRef.current;
            const canvas = await html2canvas(tableElement);
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 10, yOffset, 180, 100); // Adjust position and size
            yOffset += 110; // Update offset for the next content (Results table)
        }

        // If the yOffset exceeds maxHeight, add a new page
        if (yOffset > maxHeight) {
            doc.addPage();
            yOffset = 10;
        }

        // Capture Processes Table
        if (processTableRef.current) {
            const processTableElement = processTableRef.current;
            const canvas = await html2canvas(processTableElement);
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 10, yOffset, 180, 100); // Adjust position and size
            yOffset += 110; // Update offset for the next content (Processes table)
        }

        // If the yOffset exceeds maxHeight, add a new page
        if (yOffset > maxHeight) {
            doc.addPage();
            yOffset = 10;
        }
    }

    // Save the PDF
    doc.save("cpu_scheduling_results.pdf");
};
