import { jsPDF } from 'jspdf'

/**
 * Generates a receipt PDF using jsPDF (no html2canvas).
 * Avoids text clipping and unwanted DOM elements (icons, Reply/Forward, etc.)
 * that occur when capturing the DOM.
 */
export function generateReceiptPDF(order) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentW = pageWidth - 2 * margin
  let y = margin

  const items = order?.items ?? []
  const subtotal = items.reduce((sum, i) => sum + (i.total || 0), 0)
  const orderTotal = order?.total ?? subtotal
  const shipping = Math.max(0, orderTotal - subtotal)
  const total = orderTotal
  const currency = order?.currency || 'USD'
  const currencySymbol = currency === 'EUR' ? '€' : '$'

  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F')

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(60, 64, 67)
  doc.text('Your Gearovo order confirmation', margin, y)
  y += 8
  doc.setFontSize(12)
  doc.text('Gearovo', margin, y)
  const gw = doc.getTextWidth('Gearovo ')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(95, 99, 104)
  doc.text('<hello@gearovo.store>', margin + gw, y)
  y += 6
  doc.setFontSize(9)
  doc.text('to me', margin, y)
  y += 12

  // Body - Gearovo + teal banner
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(55, 65, 81)
  doc.text('Gearovo', pageWidth / 2, y + 6, { align: 'center' })
  y += 14
  doc.setFillColor(38, 166, 154)
  doc.rect(margin, y, contentW, 10, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Smart, Stylish, and built for your lifestyle.', margin + contentW / 2, y + 7, { align: 'center' })
  y += 14
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(55, 65, 81)
  doc.text('Thanks for your order!', margin + contentW / 2, y, { align: 'center' })
  y += 8
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  const greeting = `Hi ${order?.customer?.name || 'Customer'}, we've received your order and are preparing it with care.`
  doc.text(greeting, margin + contentW / 2, y, { align: 'center' })
  y += 12

  // Table
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(55, 65, 81)
  doc.text('ITEM', margin, y)
  doc.text('QTY', margin + contentW - 12, y, { align: 'right' })
  doc.text('TOTAL', margin + contentW, y, { align: 'right' })
  y += 6
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, margin + contentW, y)
  y += 6

  items.forEach((item) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(55, 65, 81)
    doc.text(item.product, margin, y)
    doc.text(String(item.qty), margin + contentW - 12, y, { align: 'right' })
    doc.text(`${currencySymbol}${Number(item.total).toFixed(2)}`, margin + contentW, y, { align: 'right' })
    y += 6
  })
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Subtotal', margin + contentW - 40, y)
  doc.text(`${currencySymbol}${subtotal.toFixed(2)}`, margin + contentW, y, { align: 'right' })
  y += 5
  doc.text('Shipping', margin + contentW - 40, y)
  doc.text(`${currencySymbol}${shipping.toFixed(2)}`, margin + contentW, y, { align: 'right' })
  y += 5
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, margin + contentW, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  doc.text('Total', margin + contentW - 40, y)
  doc.text(`${currencySymbol}${total.toFixed(2)}`, margin + contentW, y, { align: 'right' })
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Gearovo · hello@gearovo.store', pageWidth / 2, y, { align: 'center' })

  doc.save(`order-${order?.id || 'receipt'}-receipt.pdf`)
}
