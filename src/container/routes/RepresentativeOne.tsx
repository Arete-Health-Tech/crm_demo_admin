import React, { useEffect } from 'react';
import Logout from '../../screen/login/Logout';
import paras from '../../assets/paras.png';
import {
  AppBar,
  Box,
  CssBaseline,
  Link,
  List,
  Toolbar,
  Typography
} from '@mui/material';
import useUserStore from '../../store/userStore';

const drawerWidth = 0;
function RepresentativeOne() {
  const { user } = useUserStore();

  const drawer = (
    <div>
      <Box padding={3}>
        <img
          src="https://arete-octa.vercel.app/static/media/LOGO.caee52a55be9f79eaffe.png"
          alt="logo"
          width="70%"
        />
      </Box>
    </div>
  );

  return (
    <div>
      {/* <button onClick={handleLogout}>Logout</button> */}
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: '1500px'
        }}
      >
        <img src={paras} style={{ marginLeft: '-1450px' }} />
        <Logout />
      </Toolbar>
      <iframe
        title="Panchkula MAR1_Paras"
        style={{ width: '100%', height: '780px' }}
        src="https://app.powerbi.com/view?r=eyJrIjoiMjEyMzBmNTQtOWIzZC00MDNlLTlhNzQtNGVkYzliMDcwYzA4IiwidCI6IjgxOGNhNjk1LWFkZWItNGU2NC1iMzVhLTZmZjJkNzdiMWY1NSJ9"
      ></iframe>
    </div>
  );
}

export default RepresentativeOne;
