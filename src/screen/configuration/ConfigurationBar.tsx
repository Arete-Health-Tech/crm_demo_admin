import { Box, Stack } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styles from "./ConfigurationBar.module.css";
import BorderLine from "../../assets/Border Line.svg"

const UserManagementMenu = [
    {
        title: "Agents",
        link: 'agents'
    },
    {
        title: "SPOCS",
        link: 'spocs'
    },
    {
        title: "Doctors",
        link: 'doctors'
    },
    {
        title: "Cordinators",
        link: 'cordinators'
    }
]
const DataMasterMenu = [
    {
        title: "Departments",
        link: 'departmentsmaster'
    },
    // {
    //     title: "Wards",
    //     link: 'wards'
    // },
    {
        title: "Services",
        link: 'services'
    },
    {
        title: "Unit(Branches)",
        link: 'units'
    }
]

// const ContentManagementMenu = [
//     {
//         title: "CMS",
//         link: 'cms'
//     },
//     {
//         title: "Flow Builder",
//         link: 'flowbuildermanager'
//     }
// ]

const ConfigurationBar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const goToPage = (path) => {
        navigate(path);
    };

    return (
        <Box className={Styles.config_bar_container}>
            <Box className={Styles.config_bar_menu}>

                <Box className={Styles.config_bar_title}>
                    Configuration
                </Box>
                <Box className={Styles.config_bar_menu_title}>

                    <Box className={Styles.config_bar_menu_options}>
                        <Stack className={Styles.menu_options_title}>User Management</Stack>
                        {UserManagementMenu.map((item) => (
                            <Stack key={item.title}
                                className={Styles.menu_title}
                                onClick={() => goToPage(item.link)}
                                sx={{ backgroundColor: location.pathname.includes(item.link) ? '#EBEDF0' : 'transparent', }}>
                                {item.title}
                            </Stack>
                        ))}
                    </Box>

                    <Stack className={Styles.menu_border}>
                        <img src={BorderLine} alt='border' />
                    </Stack>

                    <Box className={Styles.config_bar_menu_options}>
                        <Stack className={Styles.menu_options_title}>Data Master</Stack>
                        {DataMasterMenu.map((item) => (
                            <Stack key={item.title}
                                className={Styles.menu_title}
                                onClick={() => goToPage(item.link)}
                                sx={{ backgroundColor: location.pathname.includes(item.link) ? '#EBEDF0' : 'transparent', }}>
                                {item.title}
                            </Stack>
                        ))}
                    </Box>

                    {/* <Stack className={Styles.menu_border}>
                        <img src={BorderLine} alt='border' />
                    </Stack>

                    <Box className={Styles.config_bar_menu_options}>
                        <Stack className={Styles.menu_options_title}>Content Management</Stack>
                        {ContentManagementMenu.map((item) => (
                            <Stack key={item.title}
                                className={Styles.menu_title}
                                onClick={() => goToPage(item.link)}
                                sx={{ backgroundColor: location.pathname.includes(item.link) ? '#EBEDF0' : 'transparent', }}>
                                {item.title}
                            </Stack>
                        ))}
                    </Box> */}
                </Box>

            </Box>

            <Box component="main" className={Styles.config_bar_content}>
                {children}
            </Box>
        </Box>
    );
};

export default ConfigurationBar;