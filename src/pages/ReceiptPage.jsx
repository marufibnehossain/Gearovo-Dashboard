import { useParams } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'
import ReceiptContent from '../components/ReceiptContent'

/**
 * Standalone receipt page - opens in new tab when clicking Download Receipt.
 * Shows just the receipt layout, no sidebar or dashboard chrome.
 */
export default function ReceiptPage() {
  const { orderId } = useParams()
  const { getOrder } = useOrders()
  const order = getOrder(orderId)

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Order not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="flex justify-center">
        <ReceiptContent order={order} />
      </div>
    </div>
  )
}
