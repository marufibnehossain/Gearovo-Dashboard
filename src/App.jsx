import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import EditOrderPage from './pages/EditOrderPage'
import AddOrderPage from './pages/AddOrderPage'
import PlaceholderPage from './pages/PlaceholderPage'
import ReceiptPreviewPage from './pages/ReceiptPreviewPage'
import ReceiptPage from './pages/ReceiptPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/receipt/:orderId" element={<ReceiptPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<PlaceholderPage title="Leaderboard" />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<AddOrderPage />} />
        <Route path="/orders/:orderId/edit" element={<EditOrderPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="/products" element={<PlaceholderPage title="Products" />} />
        <Route path="/sales-report" element={<PlaceholderPage title="Sales Report" />} />
        <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/receipt-preview" element={<ReceiptPreviewPage />} />
      </Route>
    </Routes>
  )
}

export default App
