import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'
import React from 'react'
import Logout from '../login/Logout'
import useUserStore from '../../store/userStore';
import OrderListBody from './OrderListBody';
import { Routes, Route } from 'react-router-dom';
import OrderDetailContainer from './orderDetailPage/OrderDetailContainer';
import Orders from '../../container/routes/Orders';

const drawerWidth = 240;

const OrderList = () => {
    const { user } = useUserStore();
    return (
        <>

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        background: 'white',
                        // width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` }
                    }}
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                            color="black"
                            textTransform="capitalize"
                            variant="h6"
                            noWrap
                            component="div"
                        >
                            Welcome
                            {' ' + user?.firstName + ' ' + user?.lastName}
                        </Typography>
                        <Logout />
                    </Toolbar>
                </AppBar>
            </Box>
            <Box>
                <Orders />
            </Box>
        </>
    )
}

export default OrderList
