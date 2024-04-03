import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderDetailContainer from '../../screen/orders/orderDetailPage/OrderDetailContainer';
import OrderListBody from '../../screen/orders/OrderListBody';

type props = {}

const Orders = (props: props) => {
    return (
        <Routes>
            <Route path="/" element={<OrderListBody />} />
            <Route index path="orderDetails/:uid" element={<OrderDetailContainer />} />

        </Routes>
    );
};

export default Orders;
