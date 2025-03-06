"use client"; // Ensure this runs on the client
import { saveAs } from "file-saver";
import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun, AlignmentType, TextDirection } from "docx";
import he from "he"; // Library to decode HTML entities

async function generateAndDownload(
  messages: Array<{ role: string; content: string }>,
  type = "docx"
) {
  if (type === "pdf") {
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      console.error("Failed to generate PDF");
      return;
    }

    const blob = await response.blob();
    saveAs(blob, "chat_export.pdf");
    return;
  }

  if (type === "docx") {
    const chatDate = new Date().toLocaleDateString(); // Get today's date

    const doc = new Document({
      sections: [
        {
          children: [
            // Page Header
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Chat Export",
                  bold: true,
                  size: 32, // 16pt font size
                }),
              ],
            }),

            // Subheader (Chat Date)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: `Date: ${chatDate}`,
                  italics: true,
                  size: 24, // 12pt font size
                }),
              ],
            }),

            // Messages
            ...(await Promise.all(
              messages.map(async (msg) => {
                const isUser = msg.role === "user";
                const rawText = await marked.parse(msg.content);
                const textContent = he.decode(rawText.replace(/<\/?[^>]+(>|$)/g, "")).trim(); // Decode HTML entities

                return new Paragraph({
                  alignment: AlignmentType.LEFT,
                  bidirectional: false,
                  spacing: { after: 150 },
                  children: [
                    new TextRun({
                      text: isUser ? "User: " : "Assistant: ",
                      bold: true,
                      color: isUser ? "007acc" : "228B22", // Blue for user, green for assistant
                      size: 24, // 12pt font
                    }),
                    new TextRun({
                      text: ` ${textContent}`,
                      size: 24, // 12pt font
                    }),
                  ],
                });
              })
            )),
          ],
        },
      ],
    });

    // Generate DOCX
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "chat_history.docx");
  }
}

export { generateAndDownload };
