import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OrderList from '../../screen/orders/OrderList'

const Orders = () => {
    return (
        <Routes>
            <Route path="/" element={<OrderList />} />
        </Routes>
    )
}

export default Orders
