import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, AlignmentType, TextRun } from 'docx';
import type { Message } from 'ai';

async function generateAndDownload(messages: Array<Message>, fileType: string) {
  if (fileType === 'pdf') {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;
    const leftMargin = 50;
    const rightMargin = width - 250;

    page.drawText('Chat Messages', {
      x: leftMargin,
      y,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 30;

    messages.forEach((msg) => {
      const xPosition = msg.role === 'user' ? rightMargin : leftMargin;
      page.drawText(`${msg.content}`, {
        x: xPosition,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;

      // Check if we need a new page
      if (y < 50) {
        page = pdfDoc.addPage();
        y = height - 50;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'messages.pdf');
  } else if (fileType === 'docx') {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Chat Messages', bold: true, size: 24 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            ...messages.map(
              (msg) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: msg.content,
                      size: 14,
                    }),
                  ],
                  alignment:
                    msg.role === 'user'
                      ? AlignmentType.RIGHT
                      : AlignmentType.LEFT,
                }),
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, 'messages.docx');
  }
}

export { generateAndDownload };
