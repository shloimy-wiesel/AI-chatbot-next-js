"use server"
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

async function generateAndDownload(messages: Array<{ role: string; content: string }>, fileType: string) {
  if (fileType !== 'pdf') return;

  const doc = new PDFDocument({ margin: 50, font: 'Courier' });
  const stream = doc.pipe(blobStream());

  doc.fontSize(14).text('Chat Export', { align: 'center' }).moveDown(1);

  messages.forEach(({ role, content }) => {
    if (role === 'user') {
      doc
        .font('Courier')
        .fillColor('#007BFF') // User color (blue)
        .text('User:', { continued: true })
        .fillColor('black')
        .font('Courier')
        .text(` ${content}`)
        .moveDown(1);
    } else {
      doc
        .font('Courier')
        .fillColor('#28A745') // Assistant color (green)
        .text('Assistant:', { continued: true })
        .fillColor('black')
        .font('Courier')
        .text(` ${content}`)
        .moveDown(1);
    }
  });

  doc.end();

  stream.on('finish', function () {
    const blob = stream.toBlob('application/pdf');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_export.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

export { generateAndDownload };
