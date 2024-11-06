import * as React from 'react';
import {
  styled,
  Theme,
  CSSObject,
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import { Tooltip, Zoom, TooltipProps, tooltipClasses } from '@mui/material';
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
import Diagnostics from '../../assets/Diagnostics.svg';
import DiagnosticsActive from '../../assets/DiagnosticsActive.svg';
import Dashboard from '../../assets/Dashboard.svg';
import pharmacy from '../../assets/Pharmacy.svg';
import admission from '../../assets/admission.svg';
import admissionActive from '../../assets/admissionActive.svg';
import Followup from '../../assets/Followup.svg';
import FollowupActive from '../../assets/FollowupActive.svg';
import departmentIcon from '../../assets/departmentIcon.svg';
import departmentDeafultIcon from '../../assets/departmentIconDefault.svg';
import UploadFileIcon from '../../assets/UploadFileIcon.svg';
import scriptIcon from '../../assets/scriptIcon.svg';
import scriptIconDefault from '../../assets/scriptIconDefault.svg';
import stageIcon from '../../assets/stageIcon.svg';
import stageIconDefault from '../../assets/stageIconDefault.svg';
import whtsappFlowIcon from '../../assets/whtsappFlowIcon.svg';
import whtsappFlowIconDefault from '../../assets/whtsappFlowIconDefault.svg';
import addNodeIcon from '../../assets/addNodeIcon.svg';
import addNodeIconDefault from '../../assets/addNodeIconDefault.svg';
import addNodeListIcon from '../../assets/addNodeListIcon.svg';
import addNodeListIconDefault from '../../assets/addNodeListIconDefault.svg';
import nodeConnectorIcon from '../../assets/nodeConnectorIcon.svg';
import nodeConnectorIconDefault from '../../assets/nodeConnectorIconDefault.svg';
import tagIcon from '../../assets/tagIcon.svg';
import tagIconDefault from '../../assets/tagIconDefault.svg';
import Logo from '../../assets/Logo.svg';
import styles from './Navbar.module.css';
import Logout from '../login/Logout';
import ActiveDashBoard from '../../assets/DashBoardActive.svg';
import NonActiveTicket from '../../assets/NonActiveTickets.svg';
import ActivePharmacyIcon from '../../assets/ActivePharmacy.svg';
import SettingActive from '../../assets/ActiveSetting.svg';
import doctorIcon from '../../assets/doctorIcon.svg';
import doctorIconDefault from '../../assets/doctorIconDefault.svg';
import wardIcon from '../../assets/wardIcon.svg';
import wardIconDeault from '../../assets/wardIconDeault.svg';
import serviceIcon from '../../assets/serviceIcon.svg';
import serviceIconDefault from '../../assets/serviceIconDefault.svg';
import TaskActiveIcon from '../../assets/ActiveTask.svg';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import {
  AccountTreeOutlined,
  CloudSyncOutlined,
  DocumentScannerOutlined,
  FormatListNumberedOutlined,
  QuickreplyOutlined,
  SchemaOutlined
} from '@mui/icons-material';
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
    fontFamily: `"Outfit",sans-serif`
  }
}));

const sidebarMenu = [
  {
    title: 'Department',
    icon: departmentDeafultIcon,
    icon1: departmentIcon,
    link: '/department',
    submenu: [
      {
        title: 'Doctors',
        icon: doctorIconDefault,
        icon1: doctorIcon,
        link: '/doctors'
      },
      {
        title: 'Wards',
        icon: wardIconDeault,
        icon1: wardIcon,
        link: '/wards'
      }
    ]
  },
  {
    title: 'Services',
    icon: serviceIconDefault,
    icon1: serviceIcon,
    link: '/services',
    submenu: [
      {
        title: 'Tags',
        icon: tagIconDefault,
        icon1: tagIcon,
        link: '/tags'
      },
      {
        title: 'Scripts',
        icon: scriptIconDefault,
        icon1: scriptIcon,

        link: '/scripts'
      }
    ]
  },
  // {
  //     title: 'Stages',
  //     icon: stageIconDefault,
  //     icon1: stageIcon,
  //     link: '/stages'
  // },
  {
    title: 'WhatsappFlow',
    icon: whtsappFlowIconDefault,
    icon1: whtsappFlowIcon,
    link: '/flow',
    submenu: [
      {
        title: 'Add Node Replies',
        icon: addNodeIconDefault,
        icon1: addNodeIcon,
        link: '/node-replies'
      },
      {
        title: 'Add Node Lists',
        icon: addNodeListIconDefault,
        icon1: addNodeListIcon,
        link: '/node-lists'
      },
      {
        title: 'Node Connector',
        icon: nodeConnectorIconDefault,
        icon1: nodeConnectorIcon,
        link: '/connector'
      }
    ]
  }
];

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const { setTicketType } = useTicketStore();
  const [expandedMenu, setExpandedMenu] = React.useState(null);
  const { isSwitchView, setIsSwitchView, setPageNumber } = useTicketStore();
  const goToPage = (path) => {
    navigate(path);
  };

  const handleGoToTicket = (e) => {
    if (isSwitchView) {
      goToPage('/switchView');
    } else {
      goToPage(
        e === 'Diagnostics'
          ? '/diagnostics'
          : e === 'Admission'
          ? '/admission'
          : e === 'Follow-Up'
          ? '/follow-up'
          : ''
      );
    }
  };

  const handleMenuClick = (title) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh' }}>
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
        <Box
          sx={{
            boxSizing: 'border-box',
            width: '4.4%',
            backgroundColor: '#F6F7F9',
            borderRight: '1px solid #D4DBE5'
          }}
        >
          <Box
            // bgcolor={'#F6F7F9'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={'10px !important'}
              justifyContent={'center'}
              sx={{ alignItems: 'center' }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  height: '54px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '24px'
                }}
              >
                <img src={Logo} alt="Logo" />
              </Stack>
              <Box className={styles.navbarItem}>
                <Stack className={styles.nav_Icon}>
                  <Stack
                    onClick={() => {
                      localStorage.setItem('ticketType', '');
                      goToPage('/');
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '24px',
                      width: '3.3vw',
                      height: '6.8vh',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        location.pathname === '/' ? '#DAE8FF' : 'transparent',
                      '&:hover': {
                        background: '#E1E6EE'
                      }
                    }}
                  >
                    <LightTooltip
                      title="Dashboard"
                      disableInteractive
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      {location.pathname === '/' ? (
                        <img src={ActiveDashBoard} alt="Dashboard" />
                      ) : (
                        <img src={Dashboard} alt="Dashboard" />
                      )}
                    </LightTooltip>
                  </Stack>
                </Stack>
                <Stack className={styles.nav_Icon}>
                  <Stack
                    // onClick={() => goToPage('/ticket')}
                    onClick={() => {
                      localStorage.setItem('ticketType', 'Admission');
                      handleGoToTicket('Admission');
                      setPageNumber(2)
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '24px',
                      width: '3.3vw',
                      height: '6.8vh',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        location.pathname.includes('admission') ||
                        localStorage.getItem('ticketType') === 'Admission'
                          ? '#DAE8FF'
                          : 'transparent',
                      '&:hover': {
                        background: '#E1E6EE'
                      }
                    }}
                  >
                    <LightTooltip
                      title="Admission"
                      disableInteractive
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      {location.pathname.includes('admission') ||
                      localStorage.getItem('ticketType') === 'Admission' ? (
                        <img src={admissionActive} alt="Ticket" />
                      ) : (
                        <img src={admission} alt="Ticket" />
                      )}
                    </LightTooltip>
                  </Stack>
                </Stack>
                <Stack className={styles.nav_Icon}>
                  <Stack
                    // onClick={() => goToPage('/ticket')}
                    onClick={() => {
                      localStorage.setItem('ticketType', 'Diagnostics');
                      handleGoToTicket('Diagnostics');
                      setPageNumber(2)
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '24px',
                      width: '3.3vw',
                      height: '6.8vh',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        location.pathname.includes('diagnostics') ||
                        localStorage.getItem('ticketType') === 'Diagnostics'
                          ? '#DAE8FF'
                          : 'transparent',
                      '&:hover': {
                        background: '#E1E6EE'
                      }
                    }}
                  >
                    <LightTooltip
                      title="Diagnostics"
                      disableInteractive
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      {location.pathname.includes('diagnostics') ||
                      localStorage.getItem('ticketType') === 'Diagnostics' ? (
                        <img src={DiagnosticsActive} alt="Ticket" />
                      ) : (
                        <img src={Diagnostics} alt="Ticket" />
                      )}
                    </LightTooltip>
                  </Stack>
                </Stack>
                <Stack className={styles.nav_Icon}>
                  <Stack
                    // onClick={() => goToPage('/ticket')}
                    onClick={() => {
                      localStorage.setItem('ticketType', 'Follow-Up');
                      handleGoToTicket('Follow-Up');
                      setPageNumber(2)
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '24px',
                      width: '3.3vw',
                      height: '6.8vh',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        location.pathname.includes('follow-up') ||
                        localStorage.getItem('ticketType') === 'Follow-Up'
                          ? '#DAE8FF'
                          : 'transparent',
                      '&:hover': {
                        background: '#E1E6EE'
                      }
                    }}
                  >
                    <LightTooltip
                      title="Follow-Up"
                      disableInteractive
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      {location.pathname.includes('follow-up') ||
                      localStorage.getItem('ticketType') === 'Follow-Up' ? (
                        <img src={FollowupActive} alt="Ticket" />
                      ) : (
                        <img src={Followup} alt="Ticket" />
                      )}
                    </LightTooltip>
                  </Stack>
                </Stack>
                {/* this stack is for doctors,department,WhatsappFlow starts */}

                {/* <Stack className={styles.nav_Icon}>
                                    {sidebarMenu.map((item) => (
                                        <Stack key={item.title} >
                                            <Stack
                                                onClick={() => handleMenuClick(item.title)}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "24px",
                                                    width: "3.3vw",
                                                    height: "6.8vh",
                                                    borderRadius: "8px",
                                                    cursor: 'pointer',
                                                    backgroundColor: location.pathname.includes(item.link) ? '#DAE8FF' : 'transparent',
                                                    // color: location.pathname.includes(item.link) ? '#080F1A' : '#647491',
                                                    '&:hover': {
                                                        background: '#E1E6EE',
                                                        // color: '#080F1A'
                                                    }
                                                }}
                                            >
                                                <LightTooltip
                                                    title={item.title}
                                                    disableInteractive
                                                    placement="right"
                                                    TransitionComponent={Zoom}

                                                >
                                                    {location.pathname.includes(item.link) ? (
                                                        <img className={styles.imgClass} src={item.icon1} alt="departmentIcon" />
                                                    ) : (
                                                        <img className={styles.imgClass} src={item.icon} alt="departmentIcon" />
                                                    )}
                                                </LightTooltip>
                                            </Stack>
                                            {expandedMenu === item.title && item.submenu && item.submenu.map((subItem) => (
                                                <Stack className={styles.navSub_Icon}>
                                                    <Stack
                                                        key={subItem.title}
                                                        onClick={() => goToPage(subItem.link)}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            gap: "24px",
                                                            width: "3vw",
                                                            height: "6.5vh",
                                                            borderRadius: "8px",
                                                            cursor: 'pointer',
                                                            backgroundColor: location.pathname.includes(subItem.link) ? '#DAE8FF' : 'transparent',
                                                            // color: location.pathname.includes(subItem.link) ? '#080F1A' : '#647491',
                                                            '&:hover': {
                                                                background: '#E1E6EE',
                                                                // color: "#080F1A"
                                                            }
                                                        }}
                                                    >
                                                        <LightTooltip
                                                            title={subItem.title}
                                                            disableInteractive
                                                            placement="right"
                                                            TransitionComponent={Zoom}
                                                        >
                                                            {location.pathname.includes(subItem.link) ? (
                                                                <img className={styles.imgClass} src={subItem.icon1} alt="departmentIcon" />
                                                            ) : (
                                                                <img className={styles.imgClass} src={subItem.icon} alt="departmentIcon" />
                                                            )}
                                                        </LightTooltip>
                                                    </Stack>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    ))}
                                </Stack> */}

                {/* this stack is for doctors,department,WhatsappFlow end */}

                {/* <Stack className={styles.nav_Icon}>
                                    <Stack onClick={() => goToPage('/OrderList')}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "24px",
                                             width: "3.3vw",
                                            height: "6.8vh",
                                            borderRadius: "8px",
                                            cursor: 'pointer',
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
                                </Stack> */}
                {/* <Stack className={styles.nav_Icon}>
                                    <Stack onClick={() => goToPage('/Tasks')}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "24px",
                                              width: "3.3vw",
                                            height: "6.8vh",
                                            borderRadius: "8px",
                                            cursor: 'pointer',
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
                                */}

                {/* <Stack className={styles.nav_Icon}>
                                    <Stack
                                        onClick={() => goToPage('/upload-file')}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "24px",
                                            width: "3.3vw",
                                            height: "6.8vh",
                                            borderRadius: "8px",
                                            cursor: 'pointer',
                                            backgroundColor: location.pathname.includes('/upload-file') ? '#DAE8FF' : 'transparent',
                                            '&:hover': {
                                                background: '#E1E6EE'
                                            }
                                        }}>
                                        <LightTooltip title="upload-file"
                                            disableInteractive
                                            placement="right"
                                            TransitionComponent={Zoom}
                                        >
                                            {location.pathname.includes('/upload-file') ? (<img src={UploadFileIcon} alt="upload-file" />) : (<img src={UploadFileIcon} alt="upload-file" />)}
                                        </LightTooltip>
                                    </Stack>
                                </Stack> */}
              </Box>
            </Box>

            {/* <Box sx={{ flexGrow: 1 }} /> */}
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              sx={{ alignItems: 'center' }}
            >
              <Stack>
                <Stack
                  // onClick={() => goToPage('/configuration/agents')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.3vw',
                    height: '6.8vh',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: location.pathname.includes(
                      '/configuration'
                    )
                      ? '#DAE8FF'
                      : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Configuration"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname.includes('/configuration') ? (
                      <img src={SettingActive} alt="Configuration" />
                    ) : (
                      <img src={Taskscopy} alt="Configuration" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack>
              <Stack
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pb: 2,
                  cursor: 'pointer'
                }}
              >
                <LightTooltip
                  title="Logout"
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
        <Box
          component="main"
          className={styles.main}
          // sx={{ flexGrow: 1 }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
