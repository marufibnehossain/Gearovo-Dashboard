import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { OrdersProvider } from './context/OrdersContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrdersProvider>
        <App />
      </OrdersProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
