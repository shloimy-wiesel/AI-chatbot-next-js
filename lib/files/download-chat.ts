import { saveAs } from "file-saver";
import { marked } from "marked"; // Convert Markdown to HTML
import type { Message } from "ai";

// 🟢 Generate and Download Function
async function generateAndDownload(messages: Array<Message>, fileType: string) {
  // Convert messages to HTML
  let htmlContent = `<h1>Chat Messages</h1>`;
  messages.forEach((msg: any) => {
    const alignment = msg.role === "user" ? "right" : "left";
    const formattedText = marked.parse(msg.content); // Convert Markdown to HTML
    htmlContent += `<p style="text-align: ${alignment};">${formattedText}</p>`;
  });

  if (fileType === "pdf") {
    const pdfBlob = await fetchPDF(htmlContent);
    saveAs(pdfBlob, "messages.pdf");
  } else if (fileType === "docx") {
    const docxBlob = generateDOCX(htmlContent);
    saveAs(docxBlob, "messages.docx");
  }
}

// 🔹 Call API Route for PDF
async function fetchPDF(htmlContent: string) {
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ htmlContent }),
  });

  if (!response.ok) throw new Error("Failed to generate PDF");

  return await response.blob();
}

// 🔵 Convert HTML to DOCX using `mammoth`
function generateDOCX(htmlContent: string) {
  const htmlToDocx = `
    <html>
      <head><meta charset="utf-8"></head>
      <body>${htmlContent}</body>
    </html>
  `;

  const blob = new Blob([htmlToDocx], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  return blob;
}

export { generateAndDownload };
