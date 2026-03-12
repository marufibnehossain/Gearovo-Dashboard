import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'
import ReceiptContent from '../components/ReceiptContent'
import { captureReceiptPDF } from '../utils/captureReceiptPDF'

export default function ReceiptPreviewPage() {
  const { orders } = useOrders()
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? '')
  const receiptRef = useRef(null)
  const order = orders.find((o) => o.id === selectedOrderId) ?? orders[0]

  const downloadPDF = async () => {
    if (!receiptRef.current) return
    await captureReceiptPDF(receiptRef.current, `order-${order?.id || 'receipt'}-receipt.pdf`)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipt template preview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Live preview of the PDF receipt design. Changes here reflect the downloaded PDF.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 rounded-lg bg-gearovo-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-gearovo-teal-dark transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          <label className="text-sm font-medium text-gray-700">Order:</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} — {o.customer?.name || 'Customer'}
              </option>
            ))}
          </select>
          <Link
            to={order ? `/orders/${order.id}` : '/orders'}
            className="text-sm font-medium text-gearovo-teal hover:underline"
          >
            View order →
          </Link>
        </div>
      </div>

      {/* A4-style preview - fixed width 794px matches capture layout */}
      <div className="flex justify-center bg-gray-100 p-6">
        <div ref={receiptRef} className="w-[794px] shrink-0">
          <ReceiptContent order={order} />
        </div>
      </div>
    </div>
  )
}
