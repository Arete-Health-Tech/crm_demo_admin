import {
  Search,
  PersonAddOutlined,
  HomeOutlined,
  QuestionAnswerOutlined
} from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper
} from '@mui/material';
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Styles from './SupportTabs.module.css';
type Props = {};

const SupportTabs = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Outlet />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5
        }}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          style={{
            position: 'absolute',
            bottom: 0,
            borderTop: 1,
            borderColor: 'gray',
            width: '100vw',
            background: 'lightgray'
          }}
          showLabels
        >
          <Box className={Styles.tabs_layout}>
            <BottomNavigationAction
              onClick={() => navigate('/')}
              // label="Home"
              value="home"
              icon={
                location.pathname === '/' ? (
                  <HomeOutlined sx={{ color: '#3949AB' }} />
                ) : (
                  <HomeOutlined />
                )
              }
            />
            <Box
              sx={{
                color: location.pathname === '/' ? '#3949AB' : '#647491',
                fontSize: location.pathname === '/' ? '16px' : '12px'
              }}
            >
              Home
            </Box>
          </Box>
          <Box className={Styles.tabs_layout}>
            <BottomNavigationAction
              onClick={() => navigate('/register')}
              // label="Capture Rx"
              value="register"
              icon={
                location.pathname.includes('register') ? (
                  <PersonAddOutlined sx={{ color: '#3949AB' }} />
                ) : (
                  <PersonAddOutlined />
                )
              }
            />
            <Box
              sx={{
                color:
                  location.pathname === '/register' ? '#3949AB' : '#647491',
                fontSize: location.pathname === '/register' ? '16px' : '12px'
              }}
            >
              Create Rx
            </Box>
          </Box>
          <Box className={Styles.tabs_layout}>
            <BottomNavigationAction
              onClick={() => navigate('/search')}
              // label="Search"
              value="search"
              icon={
                location.pathname.includes('/search') ? (
                  <Search sx={{ color: '#3949AB' }} />
                ) : (
                  <Search />
                )
              }
            />
            <Box
              sx={{
                color: location.pathname === '/search' ? '#3949AB' : '#647491',
                fontSize: location.pathname === '/search' ? '16px' : '12px'
              }}
            >
              Search
            </Box>
          </Box>
          {/* <BottomNavigationAction
            onClick={() => navigate('/query')}
            label="Query"
            value="query"
            icon={<QuestionAnswerOutlined />}
          /> */}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default SupportTabs;
