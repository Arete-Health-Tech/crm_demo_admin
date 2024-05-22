import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Collapse, Stack } from '@mui/material';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import {
  AccountTreeOutlined,
  CloudSyncOutlined,
  ConfirmationNumberOutlined,
  DocumentScannerOutlined,
  ExpandLess,
  ExpandMore,
  FormatListNumberedOutlined,
  QuickreplyOutlined,
  SchemaOutlined
} from '@mui/icons-material';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import Logout from '../../screen/login/Logout';
import useUserStore from '../../store/userStore';
import useReprentativeStore from '../../store/representative';

interface Props {
  window?: () => Window;
}

interface SideBarItem {
  title: string;
  icon: any;
  link: string;
  submenu?: {
    title: string;
    icon: any;
    link: string;
  }[];
}

const drawerWidth = 240;

export default function ResponsiveDrawer(props: Props) {
  const sidebarMenu: SideBarItem[] = [
    {
      title: 'Department',
      icon: <DomainAddIcon />,
      link: '/department',
      submenu: [
        {
          title: 'Doctors',
          icon: <GroupsIcon />,
          link: '/department/doctors'
        },
        {
          title: 'Wards',
          icon: <LocalHospitalIcon />,
          link: '/department/wards'
        }
      ]
    },
    {
      title: 'Services',
      icon: <BackupTableIcon />,
      link: '/services',
      submenu: [
        {
          title: 'Tags',
          icon: <DataObjectOutlinedIcon />,
          link: '/tags'
        },
        {
          title: 'Scripts',
          icon: <DocumentScannerOutlined />,
          link: '/scripts'
        }
      ]
    },
    {
      title: 'Stages',
      icon: <AccountTreeOutlined />,
      link: '/stages'
    },
    {
      title: 'Tickets',
      icon: <ConfirmationNumberOutlined />,
      link: '/tickets'
    },

    {
      title: 'WhatsappFlow',
      icon: <SchemaOutlined />,
      link: '/flow',
      submenu: [
        {
          title: 'Add Node Replies',
          icon: <QuickreplyOutlined />,
          link: '/flow/node-replies'
        },
        {
          title: 'Add Node Lists',
          icon: <FormatListNumberedOutlined />,
          link: '/flow/node-lists'
        },
        {
          title: 'Node Connector',
          icon: <CloudSyncOutlined />,
          link: '/flow/connector'
        }
      ]
    },
    //  {
    //   title: 'Manage Teams',
    //   icon: <ConfirmationNumberOutlined />,
    //   link: '/ticket'
    // }
  ];
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      <Divider />
      <List>
        {sidebarMenu.map((item, index: number) => (
          <SideBarItem key={index} item={item} />
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', height: "100%", background: "#F6F7F9" }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          background: 'white',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
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
      </AppBar> */}
      {/* <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        The implementation can be swapped with js to avoid SEO duplication of links.
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          width: '100%',
          background: '#F6F7F9'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );

  function SideBarItem({ item }: { item: SideBarItem }): JSX.Element {
    const { icon, title, submenu, link } = item;
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();



    return (
      <Stack>
        <ListItemButton>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText onClick={() => navigate(link)} primary={title} />

          {submenu !== undefined && (
            <>
              {isOpen ? (
                <ExpandLess
                  sx={{ display: submenu.length > 0 ? '' : 'none' }}
                  onClick={() => setIsOpen(!isOpen)}
                />
              ) : (
                <ExpandMore
                  sx={{ display: submenu.length > 0 ? '' : 'none' }}
                  onClick={() => setIsOpen(!isOpen)}
                />
              )}
            </>
          )}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {submenu &&
              submenu.map((menuItem, index: number) => {
                return (
                  <Link key={index} to={menuItem.link}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>{menuItem.icon}</ListItemIcon>
                      <ListItemText primary={menuItem.title} />
                    </ListItemButton>
                  </Link>
                );
              })}
          </List>
        </Collapse>
      </Stack>
    );
  }
}
