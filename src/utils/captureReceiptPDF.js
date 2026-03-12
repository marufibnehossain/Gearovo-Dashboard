import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Captures a receipt element and saves as PDF.
 * Waits for fonts + layout to stabilize to minimize shift.
 */
export async function captureReceiptPDF(element, filename) {
  // Wait for fonts to load so layout is stable
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
  await new Promise((r) => setTimeout(r, 350))

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let imgWidth = pageWidth
  let imgHeight = (canvas.height * imgWidth) / canvas.width
  if (imgHeight > pageHeight) {
    imgHeight = pageHeight
    imgWidth = (canvas.width * imgHeight) / canvas.height
  }
  doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  doc.save(filename)
}
