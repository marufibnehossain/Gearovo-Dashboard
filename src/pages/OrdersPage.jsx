import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'

const statusOptions = ['All', 'processing', 'delivered', 'failed', 'pending']

const currencySymbol = (c) => (c === 'EUR' ? '€' : c === 'GBP' ? '£' : '$')

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

export default function OrdersPage() {
  const { orders, deleteOrder } = useOrders()
  const [filter, setFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = (orderId) => {
    if (deleteConfirm === orderId) {
      deleteOrder(orderId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(orderId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const filteredOrders =
    filter === 'All'
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === filter.toLowerCase())

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all customer orders
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Link
          to="/orders/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gearovo-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-gearovo-teal-dark transition-colors shrink-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Order
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-gearovo-teal font-medium hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(order.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {order.customer?.name}
                  </span>
                  <span className="text-gray-500"> — {order.customer?.email}</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {currencySymbol(order.currency || 'USD')}{Number(order.total).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'processing' || order.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : order.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gearovo-teal transition-colors"
                      aria-label="View order"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/orders/${order.id}/edit`}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gearovo-teal transition-colors"
                      aria-label="Edit order"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(order.id)}
                      className={`rounded p-2 transition-colors ${
                        deleteConfirm === order.id
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                      }`}
                      aria-label={deleteConfirm === order.id ? 'Click again to confirm delete' : 'Delete order'}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No orders found. Try adjusting the filter or add a new order.
          </div>
        )}
      </div>
    </div>
  )
}
