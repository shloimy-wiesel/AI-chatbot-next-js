import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import type { Message } from 'ai';

async function generateAndDownload(messages: Array<Message>, fileType: string) {
  if (fileType === 'pdf') {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let y = height - 50;

    page.drawText('Chat Messages', { x: 50, y, size: 20, color: rgb(0, 0, 0) });
    y -= 30;

    messages.forEach((msg) => {
      page.drawText(`${msg.role.toUpperCase()}: ${msg.content}`, {
        x: 50,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'messages.pdf');
  } else if (fileType === 'docx') {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph('Chat Messages'),
            ...messages.map(
              (msg) =>
                new Paragraph(`${msg.role.toUpperCase()}: ${msg.content}`),
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
