import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { htmlContent } = await req.json(); // Get HTML from request

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=messages.pdf",
      },
    });
  } catch (error) {
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
