interface OrderItem {
  product: string
  price: number
  qty: number
  total: number
}

interface Order {
  id?: string
  customer?: { name?: string }
  currency?: string
  total?: number
  status?: string
  items?: OrderItem[]
}

interface OrderConfirmationEmailBodyProps {
  order: Order | null
}

const currencySymbol = (c: string) => (c === 'EUR' ? '€' : '$')

export default function OrderConfirmationEmailBody({ order }: OrderConfirmationEmailBodyProps) {
  const items = order?.items ?? []
  const subtotal = items.reduce((sum, i) => sum + (i.total || 0), 0)
  const orderTotal = order?.total ?? subtotal
  const shipping = Math.max(0, orderTotal - subtotal)
  const total = orderTotal
  const currency = order?.currency || 'USD'
  const symbol = currencySymbol(currency)
  const customerName = order?.customer?.name || 'Customer'

  return (
    <div className="min-h-0 bg-[#E0F2F1] py-12">
      {/* Centered top logo */}
      <div className="mb-8 flex justify-center">
        <img
          src="/images/Gearovo.png"
          alt="Gearovo"
          className="h-8 object-contain"
        />
      </div>

      {/* Centered bordered email card */}
      <div className="mx-auto max-w-[600px] border border-gray-300 bg-white">
        {/* Burgundy banner */}
        <div
          className="px-6 py-4 text-center"
          style={{ backgroundColor: '#26A69A' }}
        >
          <span className="text-base font-semibold text-white">
            Smart, Stylish, and built for your lifestyle.
          </span>
        </div>

        {/* Main content */}
        <div className="px-8 py-10">
          <h2 className="text-center font-serif text-2xl font-normal text-gray-800">
            Thank you for your order
          </h2>
          <p className="mt-4 text-center text-sm font-normal text-gray-500">
            Hi {customerName}, your order has been successfully delivered. Thank you for shopping with us!
          </p>

          {/* Order table */}
          <div className="mt-10">
            <div className="flex border-b border-gray-200 pb-2 text-xs font-medium uppercase tracking-wide text-gray-700">
              <div className="flex-1">ITEM</div>
              <div className="w-16 text-right">QTY</div>
              <div className="w-20 text-right">TOTAL</div>
            </div>
            {items.map((item) => (
              <div
                key={item.product}
                className="flex border-b border-gray-200 py-3 text-sm text-gray-800"
              >
                <div className="flex-1">{item.product}</div>
                <div className="w-16 text-right">{item.qty}</div>
                <div className="w-20 text-right">{symbol}{Number(item.total).toFixed(2)}</div>
              </div>
            ))}

            {/* Summary box */}
            <div className="mt-6 flex justify-end">
              <div className="w-48 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{symbol}{Math.max(0, shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-800">
                  <span>Total</span>
                  <span>{symbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <p className="mt-12 text-center text-xs text-gray-500">
        Gearovo · support@gearovo.com
      </p>
    </div>
  )
}

