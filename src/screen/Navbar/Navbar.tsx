import * as React from 'react';
import {
    styled,
    Theme,
    CSSObject,
    createTheme,
    ThemeProvider
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Taskscopy from '../../assets/Tasks copy.svg';
import Tasks from '../../assets/Tasks.svg';
import ticketIcon from '../../assets/ticket_icon.svg';
import Dashboard from '../../assets/Dashboard.svg';
import pharmacy from '../../assets/Pharmacy.svg';
import Logo from '../../assets/Logo.svg';
import styles from './Navbar.module.css';
import Logout from '../login/Logout';

const drawerWidth = 72;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    // width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(7)} + 1px)`
    }
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
    })
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""'
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0
        }
    }
}));

const Navbar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(false);

    const goToPage = (path) => {
        navigate(path);
    };

    const theme = createTheme({
        components: {
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: '#0066CC',
                        color: 'white',
                        fontSize: '0.5rem'
                    }
                }
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <img src={Logo} alt="Logo" />
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <Button variant="text" onClick={() => goToPage('/')}>
                            <Tooltip title="Dashboard" placement="right">
                                <IconButton
                                    sx={{
                                        justifyContent: 'center',
                                        backgroundColor:
                                            location.pathname === '/' ? '#e6e6ff' : 'transparent',
                                        '&:hover': {
                                            background: '#e6e6ff'
                                        }
                                    }}
                                >
                                    <img src={Dashboard} alt="Dashboard" />
                                </IconButton>
                            </Tooltip>
                        </Button>
                    </List>
                    <List>
                        <Button variant="text" onClick={() => goToPage('/ticket')}>
                            <Tooltip title="Ticket" placement="right">
                                <IconButton
                                    sx={{
                                        justifyContent: 'center',
                                        backgroundColor: location.pathname.includes('/ticket') ? '#e6e6ff' : 'transparent',
                                        '&:hover': {
                                            background: '#e6e6ff'
                                        }
                                    }}
                                >
                                    <img src={ticketIcon} alt="Ticket" />
                                </IconButton>
                            </Tooltip>
                        </Button>
                    </List>
                    <List>
                        <Button variant="text" onClick={() => goToPage('/orderDetails')}>
                            <Tooltip title="Pharmacy" placement="right">
                                <IconButton
                                    sx={{
                                        justifyContent: 'center',

                                        backgroundColor:
                                            location.pathname === '/orderDetails'
                                                ? '#e6e6ff'
                                                : 'transparent',
                                        '&:hover': {
                                            background: '#e6e6ff'
                                        }
                                    }}
                                >
                                    <img src={pharmacy} alt="Pharmacy" />
                                </IconButton>
                            </Tooltip>
                        </Button>
                    </List>
                    <List>
                        <Button variant="text" onClick={() => goToPage('/Tasks')}>
                            <Tooltip title="Tasks" placement="right">
                                <IconButton
                                    sx={{
                                        justifyContent: 'center',

                                        backgroundColor:
                                            location.pathname === '/Tasks'
                                                ? '#e6e6ff'
                                                : 'transparent',
                                        '&:hover': {
                                            background: '#e6e6ff'
                                        }
                                    }}
                                >
                                    <img src={Tasks} alt="Tasks" />
                                </IconButton>
                            </Tooltip>
                        </Button>
                    </List>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <List>
                            <Button
                                variant="text"
                                onClick={() => goToPage('/Configurations')}
                            >
                                <Tooltip title="Configurations" placement="right">
                                    <IconButton
                                        sx={{
                                            justifyContent: 'center',

                                            backgroundColor:
                                                location.pathname === '/Configurations'
                                                    ? '#e6e6ff'
                                                    : 'transparent',
                                            '&:hover': {
                                                background: '#e6e6ff'
                                            }
                                        }}
                                    >
                                        <img src={Taskscopy} alt="Configurations" />
                                    </IconButton>
                                </Tooltip>
                            </Button>
                        </List>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pb: 2
                            }}
                        >
                            {/* <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </StyledBadge> */}
                            <Logout />
                        </Box>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1 }}>
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Navbar;
