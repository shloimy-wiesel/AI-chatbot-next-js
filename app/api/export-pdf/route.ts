import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { marked } from "marked";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("Chat Export", { align: "center", underline: true })
    .moveDown(2);

  for (const { role, content } of messages) {
    const parsedContent = (await marked.parse(content)).replace(/<\/?[^>]+(>|$)/g, "");
    const textWidth = 280; // Max width before wrapping
    const xPosition = role === "user" ? 250 : 50;
    const bgColor = role === "user" ? "#E3F2FD" : "#E8F5E9";
    const textColor = role === "user" ? "#007BFF" : "#28A745";

    // Add extra spacing before Assistant messages
    if (role === "assistant") {
      doc.moveDown(2); // Adjust for more space
    }

    // Capture the initial Y position
    const initialY = doc.y;

    // Measure text height before writing
    const textHeight = doc.heightOfString(parsedContent, { width: textWidth });

    // Background rectangle with rounded corners
    const padding = 30;
    const borderRadius = 10; // Roundness of the box
    doc
      .save()
      .fillColor(bgColor)
      .roundedRect(
        xPosition - 10,
        initialY - padding,
        textWidth + 20,
        textHeight + padding * 2,
        borderRadius
      )
      .fill()
      .restore();

    // Draw role label
    doc
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .text(`${role === "user" ? "User:" : "Assistant:"}`, xPosition, initialY);

    // Write actual message
    doc
      .fillColor("black")
      .font("Helvetica")
      .text(parsedContent, xPosition, doc.y, { width: textWidth });

    // Move cursor down to avoid overlap
    doc.moveDown(1);
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
