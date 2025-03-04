import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create PDF document
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  // Collect PDF output into a buffer
  doc.on("data", (chunk) => buffers.push(chunk));

  // Wait for PDF to finish generating
  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  doc.fontSize(14).text("Chat Export", { align: "center" }).moveDown(1);

  messages.forEach(({ role, content }: { role: string; content: string }) => {
    doc
      .fillColor(role === "user" ? "#007BFF" : "#28A745")
      .text(`${role === "user" ? "User:" : "Assistant:"}`, { continued: true })
      .fillColor("black")
      .text(` ${content}`)
      .moveDown(1);
  });

  doc.end();

  // Wait for the buffer to be fully ready
  const pdfBuffer = await pdfPromise;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=chat_export.pdf",
    },
  });
}
