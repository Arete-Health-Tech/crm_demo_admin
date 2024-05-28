import * as React from 'react';
import {
    styled,
    Theme,
    CSSObject,
    createTheme,
    ThemeProvider
} from '@mui/material/styles';
import {
    Tooltip,
    Zoom,
    TooltipProps,
    tooltipClasses,

} from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
// import { Tooltip, TooltipProps, Zoom, tooltipClasses } from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { Button, Stack } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Taskscopy from '../../assets/Tasks copy.svg';
import Tasks from '../../assets/Tasks.svg';
import ticketIcon from '../../assets/ticket_icon.svg';
import Dashboard from '../../assets/Dashboard.svg';
import pharmacy from '../../assets/Pharmacy.svg';
import Logo from '../../assets/Logo.svg';
import styles from './Navbar.module.css';
import Logout from '../login/Logout';
import ActiveDashBoard from '../../assets/DashBoardActive.svg';
import NonActiveTicket from '../../assets/NonActiveTickets.svg';
import ActivePharmacyIcon from '../../assets/ActivePharmacy.svg';
import SettingActive from '../../assets/ActiveSetting.svg';
import TaskActiveIcon from '../../assets/ActiveTask.svg';
import { StackedBarChartSharp } from '@mui/icons-material';
import useTicketStore from '../../store/ticketStore';


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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#0566FF',
        color: '#ffffff',
        fontSize: 12,
        fontFamily: `"Outfit",sans-serif`,
    },
}));



const Navbar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const {
        isSwitchView,
        setIsSwitchView,
    } = useTicketStore();

    const goToPage = (path) => {
        navigate(path);
    };

    const handleGoToTicket = () => {
        if (isSwitchView) {
            goToPage('/switchView');
        } else {
            goToPage('/ticket');
        }
    }




    return (
        <>
            <Box sx={{ display: 'flex', height: '100vh', }}>
                {/* <Drawer variant="permanent"
                    open={open}
                    sx={{
                        width: "15vw",

                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: "3%",
                            backgroundColor: '#F6F7F9'
                        },
                    }}> */}
                <Box sx={{

                    boxSizing: 'border-box',
                    width: "4.4%",
                    backgroundColor: '#F6F7F9',
                    borderRight: '1px solid #D4DBE5'

                }}>
                    <Box
                        // bgcolor={'#F6F7F9'}
                        sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", height: "100%" }}>

                        <Box display={'flex'} flexDirection={'column'} gap={"10px"} justifyContent={"center"} sx={{ alignItems: "center" }} >
                            <Stack sx={{
                                display: "flex",
                                height: "54px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "24px",

                            }}>
                                <img src={Logo} alt="Logo" />
                            </Stack>
                            <Stack >
                                <Stack
                                    onClick={() => goToPage('/')}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "24px",
                                        width: "3.5vw",
                                        height: "7vh",
                                        borderRadius: "8px",
                                        backgroundColor: location.pathname === '/' ? '#DAE8FF' : 'transparent',
                                        '&:hover': {
                                            background: '#E1E6EE'
                                        }
                                    }}>
                                    <LightTooltip title="Dashboard"
                                        disableInteractive
                                        placement="right"
                                        TransitionComponent={Zoom}
                                    >
                                        {location.pathname === '/' ? (<img src={ActiveDashBoard} alt="Dashboard" />) : (<img src={Dashboard} alt="Dashboard" />)}

                                    </LightTooltip>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack
                                    // onClick={() => goToPage('/ticket')}
                                    onClick={() => { handleGoToTicket() }}


                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "24px",
                                        width: "3.5vw",
                                        height: "7vh",
                                        borderRadius: "8px",
                                        backgroundColor: location.pathname.includes('/ticket') || location.pathname.includes('/switchView') ? '#DAE8FF' : 'transparent',
                                        '&:hover': {
                                            background: '#E1E6EE'
                                        }
                                    }}>
                                    <LightTooltip title="Ticket"
                                        disableInteractive
                                        placement="right"
                                        TransitionComponent={Zoom}
                                    >

                                        {location.pathname.includes('/ticket') || location.pathname.includes('/switchView') ? (<img src={ticketIcon} alt="Ticket" />) : (<img src={NonActiveTicket} alt="Ticket" />)}

                                    </LightTooltip>
                                </Stack>
                            </Stack>
                            <Stack >
                                <Stack onClick={() => goToPage('/OrderList')}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "24px",
                                        width: "3.5vw",
                                        height: "7vh",
                                        borderRadius: "8px",
                                        backgroundColor: location.pathname.includes('/OrderList') ? '#DAE8FF' : 'transparent',
                                        '&:hover': {
                                            background: '#E1E6EE'
                                        }
                                    }}>
                                    <LightTooltip title="Pharmacy"
                                        disableInteractive
                                        placement="right"
                                        TransitionComponent={Zoom}
                                    >

                                        {location.pathname.includes('/OrderList') ? (<img src={ActivePharmacyIcon} alt="Pharmacy" />) : (<img src={pharmacy} alt="Pharmacy" />)}

                                    </LightTooltip>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack onClick={() => goToPage('/Tasks')}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "24px",
                                        width: "3.5vw",
                                        height: "7vh",
                                        borderRadius: "8px",
                                        backgroundColor: location.pathname.includes('/Tasks') ? '#DAE8FF' : 'transparent',
                                        '&:hover': {
                                            background: '#E1E6EE'
                                        }
                                    }}>
                                    <LightTooltip title="Tasks"
                                        disableInteractive
                                        placement="right"
                                        TransitionComponent={Zoom}
                                    >
                                        {location.pathname.includes('/Tasks') ? (<img src={TaskActiveIcon} alt="Tasks" />) : (<img src={Tasks} alt="Tasks" />)}
                                    </LightTooltip>
                                </Stack>
                            </Stack>
                        </Box>


                        {/* <Box sx={{ flexGrow: 1 }} /> */}
                        <Box display={'flex'} flexDirection={'column'} justifyContent={"center"} sx={{ alignItems: "center" }}>
                            <Stack>
                                <Stack

                                    onClick={() => goToPage('/Configurations')}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "24px",
                                        width: "3.5vw",
                                        height: "7vh",
                                        borderRadius: "8px",
                                        backgroundColor: location.pathname === '/Configurations' ? '#DAE8FF' : 'transparent',
                                        '&:hover': {
                                            background: '#E1E6EE'
                                        }
                                    }}
                                >
                                    <LightTooltip title="Configurations"
                                        disableInteractive
                                        placement="right"
                                        TransitionComponent={Zoom}
                                    >
                                        {location.pathname === '/Configurations' ? (<img src={SettingActive} alt="Configurations" />) : (<img src={Taskscopy} alt="Configurations" />)}

                                    </LightTooltip>
                                </Stack>
                            </Stack>
                            <Stack
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pb: 2
                                }}
                            >
                                <LightTooltip title="Logout"
                                    disableInteractive
                                    placement="right"
                                    TransitionComponent={Zoom}
                                >
                                    <Logout />
                                </LightTooltip>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
                {/* </Drawer> */}
                <Box component="main" className={styles.main}
                // sx={{ flexGrow: 1 }}
                >
                    {children}
                </Box>
            </Box>
        </>
    );
};

export default Navbar;
