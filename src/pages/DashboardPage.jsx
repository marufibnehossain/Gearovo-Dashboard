import { Link } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'

export default function DashboardPage() {
  const { orders } = useOrders()
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your store</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{orders.length}</p>
          <Link to="/orders" className="mt-2 text-sm text-gearovo-teal hover:underline">
            View orders →
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
