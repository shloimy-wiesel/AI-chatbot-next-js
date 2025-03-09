import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { marked } from "marked";
import he from "he"; // Import HTML entity decoder

export async function POST(req: Request) {
  const { messages, theme = "light" } = await req.json();
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const buffers: Uint8Array[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  // Theme colors
  const isDarkMode = theme === "dark";
  const backgroundColor = isDarkMode ? "#000000" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const userColor = isDarkMode ? "#4DB6AC" : "#007BFF";
  const assistantColor = isDarkMode ? "#81C784" : "#28A745";

  // Function to fill the entire page background
  const fillBackground = () => {
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgroundColor);
  };

  // Fill background on the first page and on every new page
  fillBackground();
  doc.on("pageAdded", fillBackground);

  // Header
  doc
    .fillColor(textColor)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Chat Export", { align: "center" })
    .moveDown();

  const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Render each message and check if it fits on the current page
  for (const { role, content } of messages) {
    const roleLabel = role === "user" ? "User:" : "Assistant:";
    const roleLabelColor = role === "user" ? userColor : assistantColor;

    // Convert markdown to plain text and decode HTML entities
    const rawText = await marked(content);
    const plainText = he.decode(rawText.replace(/<\/?[^>]+(>|$)/g, "").trim());

    // Estimate the height required for the role label and message text
    const roleHeight = doc.heightOfString(roleLabel, { width: availableWidth });
    const contentHeight = doc.heightOfString(plainText, { width: availableWidth });

    // If adding this message would exceed the page height, add a new page
    if (doc.y + roleHeight + contentHeight + 20 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }

    // Write the role label
    doc
      .fillColor(roleLabelColor)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(roleLabel);

    // Write the message content
    doc
      .fillColor(textColor)
      .font("Helvetica")
      .fontSize(12)
      .text(plainText, { width: availableWidth })
      .moveDown();
  }

  doc.end();
  const pdfBuffer = await pdfPromise;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=chat_export.pdf",
    },
  });
}
