import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'

const statusOptions = ['pending', 'processing', 'delivered', 'failed']
const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery']

const emptyForm = () => ({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  userIp: '',
  currency: 'EUR',
  agreeMarketing: false,
  billingAddress: '',
  city: '',
  postalCode: '',
  country: '',
  shippingAddress: '',
  shippingCity: '',
  shippingPostalCode: '',
  shippingCountry: '',
  sameAsBilling: true,
  status: 'pending',
  paymentMethod: 'Credit Card',
  transactionId: '',
  carrier: '',
  trackingNumber: '',
  items: [{ product: '', price: '', qty: 1, total: '' }],
  shipping: 0,
})

export default function EditOrderPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { getOrder, updateOrder } = useOrders()
  const order = getOrder(orderId)

  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    if (!order) return
    const items = (order.items || []).map((i) => ({
      product: i.product || '',
      price: String(i.price ?? ''),
      qty: i.qty ?? 1,
      total: String(i.total ?? ''),
    }))
    if (items.length === 0) items.push({ product: '', price: '', qty: 1, total: '' })

    const subtotal = (order.items || []).reduce((s, i) => s + (i.total || 0), 0)
    const shipping = Math.max(0, (order.total ?? subtotal) - subtotal)

    setForm({
      customerName: order.customer?.name || '',
      customerEmail: order.customer?.email || '',
      customerPhone: order.customer?.phone || '',
      userIp: order.userIp || '',
      currency: order.currency || 'EUR',
      agreeMarketing: order.agreeMarketing ?? false,
      billingAddress: order.billingAddress || '',
      city: order.city || '',
      postalCode: order.postalCode || '',
      country: order.country || '',
      shippingAddress: order.shippingAddress || order.billingAddress || '',
      shippingCity: order.shippingCity || order.city || '',
      shippingPostalCode: order.shippingPostalCode || order.postalCode || '',
      shippingCountry: order.shippingCountry || order.country || '',
      sameAsBilling: !order.shippingAddress || order.shippingAddress === order.billingAddress,
      status: order.status || 'pending',
      paymentMethod: order.payment?.method || 'Credit Card',
      transactionId: order.payment?.transactionId || '',
      carrier: order.carrier || '',
      trackingNumber: order.trackingNumber || '',
      items,
      shipping,
    })
  }, [order])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateItem = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      if (field === 'price' || field === 'qty') {
        const price = parseFloat(items[index].price) || 0
        const qty = parseInt(items[index].qty, 10) || 0
        items[index].total = (price * qty).toFixed(2)
      }
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product: '', price: '', qty: 1, total: '' }],
    }))
  }

  const removeItem = (index) => {
    if (form.items.length <= 1) return
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const subtotal = form.items.reduce(
    (sum, i) => sum + (parseFloat(i.total) || 0),
    0
  )
  const shipping = parseFloat(form.shipping) || 0
  const total = subtotal + shipping

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullBilling = [form.billingAddress, form.city, form.postalCode, form.country]
      .filter(Boolean)
      .join(', ')
    const useBillingForShipping = form.sameAsBilling || !form.shippingAddress
    const orderData = {
      customer: {
        name: form.customerName,
        email: form.customerEmail,
        phone: form.customerPhone,
      },
      userIp: form.userIp,
      currency: form.currency,
      agreeMarketing: form.agreeMarketing,
      billingAddress: form.billingAddress,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
      shippingAddress: useBillingForShipping ? form.billingAddress : form.shippingAddress,
      shippingCity: useBillingForShipping ? form.city : form.shippingCity,
      shippingPostalCode: useBillingForShipping ? form.postalCode : form.shippingPostalCode,
      shippingCountry: useBillingForShipping ? form.country : form.shippingCountry,
      address: fullBilling,
      status: form.status,
      total,
      payment: {
        method: form.paymentMethod,
        transactionId: form.transactionId,
      },
      carrier: form.carrier,
      trackingNumber: form.trackingNumber,
      items: form.items
        .filter((i) => i.product?.trim())
        .map((i) => ({
          product: i.product,
          price: parseFloat(i.price) || 0,
          qty: parseInt(i.qty, 10) || 1,
          total: parseFloat(i.total) || 0,
        })),
    }
    updateOrder(orderId, orderData)
    navigate(`/orders/${orderId}`)
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Order not found.</p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-4 text-gearovo-teal hover:underline"
        >
          ← Back to orders
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
        <p className="mt-1 text-sm text-gray-500">
          Order ID: {order.id}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Order Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">User IP</label>
              <input
                type="text"
                value={form.userIp}
                onChange={(e) => updateField('userIp', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="e.g. 213.114.74.88"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Customer
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="Customer full name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                value={form.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) => updateField('customerPhone', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="e.g. +46700099706"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Marketing</label>
              <select
                value={form.agreeMarketing ? 'YES' : 'NO'}
                onChange={(e) => updateField('agreeMarketing', e.target.value === 'YES')}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status & Tracking */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Status & Tracking
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Carrier</label>
              <input
                type="text"
                value={form.carrier}
                onChange={(e) => updateField('carrier', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="e.g. USPS, FedEx"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Tracking number</label>
              <input
                type="text"
                value={form.trackingNumber}
                onChange={(e) => updateField('trackingNumber', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="Tracking number"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Payment
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Payment method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => updateField('paymentMethod', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
              >
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Transaction ID</label>
              <input
                type="text"
                value={form.transactionId}
                onChange={(e) => updateField('transactionId', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                placeholder="Transaction ID"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="rounded-lg bg-gearovo-teal px-4 py-2 text-sm font-medium text-white hover:bg-gearovo-teal-dark transition-colors"
            >
              + Add item
            </button>
          </div>
          <div className="space-y-4">
            {form.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
              >
                <div className="min-w-[200px] flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Product</label>
                  <input
                    type="text"
                    value={item.product}
                    onChange={(e) => updateItem(index, 'product', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                    placeholder="Product name"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-20">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Total</label>
                  <input
                    type="text"
                    readOnly
                    value={item.total}
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={form.items.length <= 1}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm">
            <div className="flex max-w-xs justify-between gap-4">
              <label className="text-gray-600">Shipping</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.shipping}
                onChange={(e) => updateField('shipping', e.target.value)}
                className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm"
              />
            </div>
            <p className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{form.currency} {total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Billing & Shipping */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Billing Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Street Address *</label>
                <input
                  type="text"
                  required
                  value={form.billingAddress}
                  onChange={(e) => updateField('billingAddress', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  placeholder="e.g. Vasavagen 100 lgh 1202"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Country *</label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Shipping Address
            </h2>
            <label className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.sameAsBilling}
                onChange={(e) => updateField('sameAsBilling', e.target.checked)}
                className="rounded border-gray-300 text-gearovo-teal focus:ring-gearovo-teal"
              />
              <span className="text-sm text-gray-700">Same as billing address</span>
            </label>
            {!form.sameAsBilling && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Street Address *</label>
                  <input
                    type="text"
                    value={form.shippingAddress}
                    onChange={(e) => updateField('shippingAddress', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={form.shippingCity}
                    onChange={(e) => updateField('shippingCity', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={form.shippingPostalCode}
                    onChange={(e) => updateField('shippingPostalCode', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={form.shippingCountry}
                    onChange={(e) => updateField('shippingCountry', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-gearovo-teal focus:outline-none focus:ring-1 focus:ring-gearovo-teal"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-gearovo-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-gearovo-teal-dark transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/orders/${orderId}`)}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
