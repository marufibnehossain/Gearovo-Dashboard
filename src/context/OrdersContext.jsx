import { createContext, useContext, useState, useCallback } from 'react'

const OrdersContext = createContext(null)

const STORAGE_KEY = 'gearovo-orders-v2'

const loadOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : getDefaultOrders()
  } catch {
    return getDefaultOrders()
  }
}

const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function getDefaultOrders() {
  return [
    {
      id: '409924753',
      date: '2026-01-13',
      userIp: '213.114.74.88',
      currency: 'EUR',
      total: 32.0,
      status: 'processing',
      customer: { name: 'Zakaria Nekach', email: 'zakarianekach@hotmail.com', phone: '+46700099706' },
      agreeMarketing: false,
      billingAddress: 'Vasavagen 100 lgh 1202',
      city: 'Järfälla',
      postalCode: '17752',
      country: 'SE',
      address: 'Vasavagen 100 lgh 1202, Järfälla 17752, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 32.0, qty: 1, total: 32.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '410238503',
      date: '2026-01-15',
      userIp: '94.191.152.127',
      currency: 'EUR',
      total: 20.0,
      status: 'processing',
      customer: { name: 'Raba Salihi', email: 'xhafer_94@hotmail.com', phone: '+46728721377' },
      agreeMarketing: false,
      billingAddress: 'Karl-Johansgatan 28 C Lgh 1103',
      city: 'Gislaved',
      postalCode: '332 38',
      country: 'SE',
      address: 'Karl-Johansgatan 28 C Lgh 1103, Gislaved 332 38, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 20.0, qty: 1, total: 20.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '410432868',
      date: '2026-01-16',
      userIp: '81.224.250.145',
      currency: 'EUR',
      total: 400.0,
      status: 'processing',
      customer: { name: 'Ulf Jonathan Torsson', email: 'Jonathantorsson88@hotmail.com', phone: '+46701709108' },
      agreeMarketing: false,
      billingAddress: 'Norra Kyrkvagen 9',
      city: 'Kållered',
      postalCode: '42830',
      country: 'SE',
      address: 'Norra Kyrkvagen 9, Kållered 42830, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 400.0, qty: 1, total: 400.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '410646937',
      date: '2026-01-17',
      userIp: '83.253.107.55',
      currency: 'EUR',
      total: 20.0,
      status: 'processing',
      customer: { name: 'Petra Birgitta Svensson', email: 'fimpen71@hotmail.com', phone: '+46761259319' },
      agreeMarketing: false,
      billingAddress: 'Snickaregatan 15 F lgh 1001',
      city: 'Kinna',
      postalCode: '51155',
      country: 'SE',
      address: 'Snickaregatan 15 F lgh 1001, Kinna 51155, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 20.0, qty: 1, total: 20.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '411146635',
      date: '2026-01-20',
      userIp: '80.220.64.80',
      currency: 'EUR',
      total: 10.0,
      status: 'processing',
      customer: { name: 'Anna-Kaisa Mattero', email: 'kaisa.mattero@gmail.com', phone: '+358417269966' },
      agreeMarketing: false,
      billingAddress: 'Hiekkalaiturintie 10 C 25',
      city: 'Helsinki',
      postalCode: '00980',
      country: 'FI',
      address: 'Hiekkalaiturintie 10 C 25, Helsinki 00980, FI',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 10.0, qty: 1, total: 10.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '411497541',
      date: '2026-01-22',
      userIp: '78.70.62.75',
      currency: 'EUR',
      total: 50.0,
      status: 'processing',
      customer: { name: 'calle swahn', email: 'calle.swahn4@gmail.com', phone: '+46734343322' },
      agreeMarketing: false,
      billingAddress: 'sikvagen 29',
      city: 'eskilstuna',
      postalCode: '63531',
      country: 'SE',
      address: 'sikvagen 29, eskilstuna 63531, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 50.0, qty: 1, total: 50.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '412280624',
      date: '2026-01-26',
      userIp: '78.72.97.240',
      currency: 'EUR',
      total: 30.0,
      status: 'processing',
      customer: { name: 'Oscar Hammar Fredriksson', email: 'ofredriksson21@gmail.com', phone: '+46735048146' },
      agreeMarketing: false,
      billingAddress: 'Storegarden 5',
      city: 'Mariestad',
      postalCode: '54292',
      country: 'SE',
      address: 'Storegarden 5, Mariestad 54292, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 30.0, qty: 1, total: 30.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '412596744',
      date: '2026-01-28',
      userIp: '194.237.107.226',
      currency: 'EUR',
      total: 46.6,
      status: 'processing',
      customer: { name: 'Thomas Alexander Sikström', email: 'alexsikstrom@hotmail.com', phone: '+46704464475' },
      agreeMarketing: false,
      billingAddress: 'Hagkarrsvagen 40',
      city: 'Södertälje',
      postalCode: '15139',
      country: 'SE',
      address: 'Hagkarrsvagen 40, Södertälje 15139, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 46.6, qty: 1, total: 46.6 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '413668028',
      date: '2026-02-03',
      userIp: '2a02:aa1:1166:e8c3:d42:9a0a:6e79:7e5a',
      currency: 'EUR',
      total: 15.0,
      status: 'processing',
      customer: { name: 'Robin Andersson', email: 'robinsnys@hotmail.com', phone: '+46730746535' },
      agreeMarketing: false,
      billingAddress: 'Westerbergsgatan',
      city: 'Falköping',
      postalCode: '52135',
      country: 'SE',
      address: 'Westerbergsgatan, Falköping 52135, SE',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 15.0, qty: 1, total: 15.0 }],
      carrier: '',
      trackingNumber: '',
    },
    {
      id: '414989855',
      date: '2026-02-10',
      userIp: '2a01:cb22:147:5a00:274e:3e34:404e:fa43',
      currency: 'EUR',
      total: 20.0,
      status: 'processing',
      customer: { name: 'Meghane Delnard', email: 'meghane.delnard13@gmail.com', phone: '+33692549834' },
      agreeMarketing: false,
      billingAddress: '167 Chemin combavas, Apt42 balcon Mon Repos',
      city: 'Saint Paul',
      postalCode: '97411',
      country: 'FR',
      address: '167 Chemin combavas, Apt42 balcon Mon Repos, Saint Paul 97411, FR',
      payment: { method: 'Credit Card', transactionId: '' },
      items: [{ product: 'Product', price: 20.0, qty: 1, total: 20.0 }],
      carrier: '',
      trackingNumber: '',
    },
  ]
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  const addOrder = useCallback((orderData) => {
    const id = orderData.id || `ord_${String(Date.now()).slice(-6)}`
    const order = {
      id,
      date: orderData.date || new Date().toISOString().slice(0, 10),
      userIp: orderData.userIp || '',
      currency: orderData.currency || 'USD',
      agreeMarketing: orderData.agreeMarketing ?? false,
      ...orderData,
    }
    setOrders((prev) => {
      const next = [order, ...prev]
      saveOrders(next)
      return next
    })
    return id
  }, [])

  const updateOrder = useCallback((orderId, updates) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId ? { ...o, ...updates } : o
      )
      saveOrders(next)
      return next
    })
  }, [])

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== orderId)
      saveOrders(next)
      return next
    })
  }, [])

  const getOrder = useCallback(
    (orderId) => orders.find((o) => o.id === orderId),
    [orders]
  )

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
