import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'

const statusOptions = ['pending', 'processing', 'delivered', 'failed']

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { getOrder, updateOrder, deleteOrder } = useOrders()
  const order = getOrder(orderId)

  const [status, setStatus] = useState(order?.status ?? 'processing')
  const [carrier, setCarrier] = useState(order?.carrier ?? '')
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber ?? '')
  const [actionsOpen, setActionsOpen] = useState(false)

  useEffect(() => {
    if (order) {
      setStatus(order.status ?? 'processing')
      setCarrier(order.carrier ?? '')
      setTrackingNumber(order.trackingNumber ?? '')
    }
  }, [order?.id, order?.status, order?.carrier, order?.trackingNumber])

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="mt-4 inline-block text-gearovo-teal hover:underline">
          ← Back to orders
        </Link>
      </div>
    )
  }

  const handleUpdate = () => {
    updateOrder(orderId, {
      status,
      carrier,
      trackingNumber,
    })
  }

  const subtotal = order.items?.reduce((sum, i) => sum + (i.total || 0), 0) ?? 0
  const orderTotal = order.total ?? subtotal
  const shipping = Math.max(0, orderTotal - subtotal)
  const total = orderTotal
  const currency = order.currency || 'USD'
  const currencySymbol = currency === 'EUR' ? '€' : '$'

  const downloadReceipt = () => {
    window.open(`/receipt/${order.id}`, '_blank', 'noopener,noreferrer')
  }

  const handleDelete = () => {
    if (window.confirm(`Delete order ${order.id}? This cannot be undone.`)) {
      deleteOrder(order.id)
      navigate('/orders')
    }
  }

  return (
    <div className="p-8">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gearovo-teal hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to orders
      </Link>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order details</h1>
          <p className="mt-1 text-sm text-gray-500">Order ID: {order.id}</p>
        </div>
        <div className="relative flex items-center gap-3">
          <button
            onClick={downloadReceipt}
            className="inline-flex items-center gap-2 rounded-lg bg-gearovo-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-gearovo-teal-dark transition-colors shrink-0"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Receipt
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setActionsOpen((o) => !o)}
              className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0"
              aria-expanded={actionsOpen}
              aria-haspopup="true"
              aria-label="More actions"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
            {actionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setActionsOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <Link
                    to={`/orders/${order.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setActionsOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Order
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setActionsOpen(false)
                      handleDelete()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Order Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Order ID</p>
              <p className="text-sm font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Order Date</p>
              <p className="text-sm text-gray-900">{order.date}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">User IP</p>
              <p className="text-sm text-gray-900">{order.userIp || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Amount</p>
              <p className="text-sm font-medium text-gray-900">
                {order.currency || 'USD'} {Number(order.total ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Status & Tracking - side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Customer
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gearovo-teal/10 text-gearovo-teal text-lg font-semibold">
                {(order.customer?.name || '?')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer?.name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Email</p>
                    <a
                      href={`mailto:${order.customer?.email}`}
                      className="text-sm font-medium text-gearovo-teal hover:underline truncate block"
                    >
                      {order.customer?.email || '—'}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Phone</p>
                    {order.customer?.phone ? (
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="text-sm font-medium text-gearovo-teal hover:underline"
                      >
                        {order.customer.phone}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">—</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Marketing</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.agreeMarketing ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          Not subscribed
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Status & Tracking
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Carrier
              </label>
              <input
                type="text"
                placeholder="e.g. USPS, FedEx"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tracking number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Update →
            </button>
          </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Payment
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-700">Method:</span>{' '}
              {order.payment?.method ?? 'N/A'}
            </p>
            <p>
              <span className="font-medium text-gray-700">Transaction ID:</span>{' '}
              {order.payment?.transactionId ?? 'N/A'}
            </p>
            <button className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Refund via Gateway →
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Items
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left font-semibold text-gray-700">Product</th>
                  <th className="pb-3 text-right font-semibold text-gray-700">Price</th>
                  <th className="pb-3 text-right font-semibold text-gray-700">Qty</th>
                  <th className="pb-3 text-right font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.product}</td>
                    <td className="py-3 text-right text-gray-600">
                      {currencySymbol}{Number(item.price).toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-gray-600">{item.qty}</td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      {currencySymbol}{Number(item.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{currencySymbol}{shipping.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Billing & Shipping Addresses */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Billing Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">{order.billingAddress || '—'}</p>
              <p className="text-gray-600">
                {[order.city, order.postalCode, order.country].filter(Boolean).join(', ') || '—'}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              {order.shippingAddress || order.billingAddress ? (
                <>
                  <p className="text-gray-900">
                    {order.shippingAddress || order.billingAddress}
                  </p>
                  <p className="text-gray-600">
                    {[order.shippingCity || order.city, order.shippingPostalCode || order.postalCode, order.shippingCountry || order.country]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Same as billing</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
