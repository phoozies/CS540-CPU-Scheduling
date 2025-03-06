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
    const maxHeight = 270; // Maximum height of content on a page before a new page is needed
    const contentMargin = 10; // Margin for the content

    // Helper function to check if adding new content will overflow the page
    const checkPageOverflow = (contentHeight: number) => {
        if (yOffset + contentHeight > maxHeight) {
            doc.addPage();
            yOffset = contentMargin; // Reset Y offset for new page
        }
    };

    // Capture Gantt charts
    for (let i = 0; i < results.length; i++) {
        const res = results[i];

        // Capture Gantt Chart for this result
        if (ganttRef.current) {
            const chartCanvas = ganttRef.current.querySelectorAll("canvas")[i];
            if (chartCanvas) {
                const canvasImage = chartCanvas.toDataURL("image/png");

                // Check if Gantt chart will overflow, if yes, add a new page
                const chartHeight = 110; // Fixed height of the Gantt chart
                checkPageOverflow(chartHeight);

                // Add image to the PDF
                doc.addImage(canvasImage, "PNG", contentMargin, yOffset, 180, 100);
                yOffset += chartHeight; // Update offset for the next content (Gantt chart)
            }
        }

        // Capture Results Table
        if (tableRef.current) {
            const tableElement = tableRef.current;
            const canvas = await html2canvas(tableElement);
            const imgData = canvas.toDataURL("image/png");

            // Check if results table will overflow, if yes, add a new page
            const tableHeight = 110; // Fixed height of the results table
            checkPageOverflow(tableHeight);

            // Add image to the PDF
            doc.addImage(imgData, "PNG", contentMargin, yOffset, 180, 100);
            yOffset += tableHeight; // Update offset for the next content (Results table)
        }

        // Capture Processes Table
        if (processTableRef.current) {
            const processTableElement = processTableRef.current;
            const canvas = await html2canvas(processTableElement);
            const imgData = canvas.toDataURL("image/png");

            // Check if processes table will overflow, if yes, add a new page
            const processTableHeight = 110; // Fixed height of the process table
            checkPageOverflow(processTableHeight);

            // Add image to the PDF
            doc.addImage(imgData, "PNG", contentMargin, yOffset, 180, 100);
            yOffset += processTableHeight; // Update offset for the next content (Processes table)
        }
    }

    // Save the PDF
    doc.save("cpu_scheduling_results.pdf");
};
