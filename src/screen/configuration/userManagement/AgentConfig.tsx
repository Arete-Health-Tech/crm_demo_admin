import React, { useEffect, useRef, useState } from 'react'
import styles from './AgentConfig.module.css'
import { Box, createTheme, Modal, outlinedInputClasses, Stack, TextField, Theme, ThemeProvider, useTheme } from '@mui/material'
import CloseModalIcon from "../../../assets/Group 48095853.svg"
import NotifyToggle from '../../../assets/NotifyToggle.svg';
import NotNotifyToggle from '../../../assets/NotNotifyToggle.svg';
import SearchIcon from '@mui/icons-material/Search';
import DefaultScreen from './../../../../src/assets/NotFoundTask.svg';
import SortArrowIcon from './../../../../src/assets/SortArrow.svg'
import FillCheckBox from './../../../../src/assets/squareCheckbox-final.svg'
import EmptyCheckBox from './../../../../src/assets/squareCheckBox-null.svg'
import DotMenu from './../../../../src/assets/more_horiz.svg'


const customTheme = (outerTheme: Theme) =>
    createTheme({
        palette: {
            mode: outerTheme.palette.mode,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '--TextField-brandBorderColor': '#E0E3E7',
                        '--TextField-brandBorderHoverColor': '#B2BAC2',
                        '--TextField-brandBorderFocusedColor': '#6F7E8C',
                        fontSize: "12px",
                        '& label.Mui-focused': {
                            color: 'var(--TextField-brandBorderFocusedColor)',

                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: 'var(--TextField-brandBorderColor)',
                        fontSize: "14px",
                    },
                    root: {
                        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: 'var(--TextField-brandBorderHoverColor)',

                        },
                        [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: 'var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
            MuiFilledInput: {
                styleOverrides: {
                    root: {
                        '&::before, &::after': {
                            borderBottom: '2px solid var(--TextField-brandBorderColor)',
                            fontSize: "14px",
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                        },
                        '&.Mui-focused:after': {
                            borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
            MuiInput: {
                styleOverrides: {
                    root: {
                        '&::before': {
                            borderBottom: '2px solid var(--TextField-brandBorderColor)',
                            fontSize: "14px",
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                        },
                        '&.Mui-focused:after': {
                            borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
        },
    });
const fieldCss = {
    style: {
        fontSize: '14px',
        color: "rgba(128, 128, 128, 0.744)",
        fontFamily: `"Outfit",sans-serif`,
    }
}
const fieldInputCss = {
    style: {
        fontSize: '14px',
        color: "#080F1A",
        fontFamily: `"Outfit",sans-serif`,
    }
}

const AgentConfig = () => {
    const outerTheme = useTheme();
    const [isNewAgent, setIsNewAgent] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    const [isNotify, setIsNotify] = useState(false);
    const [isAgentAddModalOpen, setIsAgentAddModalOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        const isClickOutsideMenu =
            MenuRef.current && !MenuRef.current.contains(event.target as Node);

        if (isClickOutsideMenu) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Box className={styles.AgentConfig_container}>
                <Box className={styles.AgentConfig_container_head}>
                    <Stack className={styles.AgentConfig_container_head_title}>Agents</Stack>
                    <Stack display={"flex"} flexDirection={"row"} gap={"5px"}>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            gap={'10px'}
                        >
                            <Stack width={'95%'} position={'relative'}>
                                <span className="search-icon">
                                    {' '}
                                    <SearchIcon />
                                </span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder=" Search..."
                                // onKeyDown={handleSearchKeyPress}
                                />
                            </Stack>
                        </Box>
                        <Stack className={styles.AgentConfig_container_head_Btn} onClick={() => { setIsAgentAddModalOpen(true) }}>
                            <Stack>+</Stack>
                            <Stack sx={{ whiteSpace: "nowrap" }}>New Agent</Stack>
                        </Stack>
                    </Stack>
                </Box>

                {/* Table */}
                <Box className={styles.AgentConfig_container_table}>
                    <Box height={'100%'}>
                        <table className={styles.table} style={{
                            height: '100%'
                        }}>
                            <Box sx={{ position: "sticky" }}>
                                <thead>
                                    <tr className={styles.table_head}>
                                        <th className={`${styles.table_head_item} `}>
                                            <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                <img src={EmptyCheckBox} alt="sortArrow" />
                                            </Stack>
                                        </th>
                                        <th className={`${styles.table_head_item} ${styles.item1}`}>
                                            Name
                                            <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                <img src={SortArrowIcon} alt="sortArrow" />
                                            </Stack>
                                        </th>
                                        <th className={`${styles.table_head_item} ${styles.item2}`}>Email</th>
                                        <th className={`${styles.table_head_item} ${styles.item3}`}>Phone Number</th>
                                        <th className={`${styles.table_head_item} ${styles.item4}`}>Created On</th>
                                        <th className={`${styles.table_head_item} ${styles.item5}`}></th>
                                        <th className={`${styles.table_head_item} ${styles.item6}`}></th>

                                    </tr>
                                </thead>
                            </Box>
                            <Box sx={{
                                height: "100%", overflowY: 'auto',
                                '&::-webkit-scrollbar': { width: '4px', marginTop: "100px" },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#DAE8FF', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
                            }}>

                                {true ?
                                    <tbody>
                                        <tr className={styles.table_body}>
                                            {/* CheckBox */}
                                            <td className={`${styles.table_body_item}`}>
                                                <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                    <img src={EmptyCheckBox} alt="sortArrow" />
                                                </Stack>
                                            </td>

                                            {/* Name */}
                                            <td className={`${styles.table_body_item} ${styles.body_item1}`}>
                                                Anoop Sharma
                                            </td>

                                            {/* Email */}
                                            <td className={`${styles.table_body_item} ${styles.body_item2}`}>
                                                anoopkumar@aretehealth.tech
                                            </td>

                                            {/* Phone Number */}
                                            <td className={`${styles.table_body_item} ${styles.body_item3}`}>
                                                6260168744
                                            </td>

                                            {/* Created on */}
                                            <td className={`${styles.table_body_item} ${styles.body_item4}`}>
                                                23 April 2024
                                            </td>

                                            {/* login checkBoc */}
                                            <td className={`${styles.table_body_item} ${styles.body_item5}`}>
                                                <Stack sx={{ marginTop: "2px" }}>
                                                    <img src={NotNotifyToggle} alt="sortArrow" />
                                                </Stack>
                                            </td>

                                            {/* menu bar */}
                                            <td className={`${styles.table_body_item} ${styles.body_item6}`}>
                                                <td className={`${styles.table_body_item} ${styles.body_item6}`}>
                                                    <Stack sx={{ marginTop: "2px" }} onClick={() => { setIsMenuOpen(!isMenuOpen) }}>
                                                        <img src={DotMenu} alt="sortArrow" />
                                                    </Stack>
                                                    {
                                                        isMenuOpen ?
                                                            (<>
                                                                <Stack
                                                                    ref={MenuRef}
                                                                    display={isMenuOpen ? 'block' : 'none'}
                                                                    className={styles.menu_item}
                                                                    bgcolor="white"
                                                                >
                                                                    <Stack className={styles.menu_options}>
                                                                        Edit
                                                                    </Stack>
                                                                    <Stack className={styles.menu_options}>
                                                                        Change Password
                                                                    </Stack>
                                                                    <Stack className={`${styles.menu_options} ${styles.delete_option}`}
                                                                        onClick={() => {
                                                                            setDeleteModal(true);
                                                                            setIsMenuOpen(false);
                                                                        }}
                                                                    >

                                                                        Delete
                                                                    </Stack>
                                                                </Stack>
                                                            </>) : (<></>)
                                                    }
                                                </td>
                                            </td>
                                        </tr>
                                    </tbody>
                                    :
                                    (<>
                                        {/* Default Screen */}
                                        <Box className={styles.default_screen}>
                                            <Stack className={styles.default_screen_content}>
                                                <Stack className={styles.default_image}>
                                                    <img src={DefaultScreen} />
                                                </Stack>
                                                <Stack className={styles.default_head1}>
                                                    No Agent Yet
                                                </Stack>
                                                <Stack className={styles.default_head2}>
                                                    It looks like you haven't added any Agents yet. Tap on "Add Agent" to get started!
                                                </Stack>
                                            </Stack>

                                        </Box>

                                    </>)
                                }

                            </Box>
                        </table>
                    </Box>

                </Box>


                <Box className={styles.AgentConfig_container_pagination}>
                    Pagination
                </Box>
            </Box>

            {/* Add Modal */}
            <Modal
                open={isAgentAddModalOpen}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.add_modal}>
                    <Stack className={styles.add_modal_head}>
                        <Stack className={styles.add_modal_head_title}>New Agent</Stack>
                        <Stack
                            className={styles.modal_close}
                            onClick={() => { setIsAgentAddModalOpen(false) }}
                        >
                            <img src={CloseModalIcon} />
                        </Stack>
                    </Stack>
                    <Stack className={styles.add_modal_field}>

                        <Stack display={'flex'} flexDirection={'row'} gap={'16px'}>
                            <ThemeProvider theme={customTheme(outerTheme)}>
                                <TextField className='inputField-placeholder'
                                    id="outlined-required"
                                    required
                                    // value={}
                                    // onChange={(e) => { }}
                                    label="First Name"
                                    fullWidth
                                    size="medium"
                                    InputLabelProps={fieldCss}
                                    InputProps={fieldInputCss}
                                />
                            </ThemeProvider>
                            <ThemeProvider theme={customTheme(outerTheme)}>
                                <TextField className='inputField-placeholder'
                                    id="outlined-required"
                                    // value={}
                                    // onChange={(e) => { }}
                                    label="Last Name"
                                    fullWidth
                                    size="medium"
                                    InputLabelProps={fieldCss}
                                    InputProps={fieldInputCss}
                                />
                            </ThemeProvider>
                        </Stack>
                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField className='inputField-placeholder'
                                id="outlined-required"
                                required
                                // value={}
                                // onChange={(e) => { }}
                                label="Phone Number"
                                fullWidth
                                size="medium"
                                InputLabelProps={fieldCss}
                                InputProps={fieldInputCss}
                            />
                        </ThemeProvider>
                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField className='inputField-placeholder'
                                id="outlined-required"
                                required
                                // value={}
                                // onChange={(e) => { }}
                                label="Email"
                                fullWidth
                                size="medium"
                                InputLabelProps={fieldCss}
                                InputProps={fieldInputCss}
                            />
                        </ThemeProvider>
                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField className='inputField-placeholder'
                                id="outlined-required"
                                required
                                // value={}
                                // onChange={(e) => { }}
                                label="Password"
                                fullWidth
                                size="medium"
                                InputLabelProps={fieldCss}
                                InputProps={fieldInputCss}
                            />
                        </ThemeProvider>
                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField className='inputField-placeholder'
                                id="outlined-required"
                                required
                                // value={}
                                // onChange={(e) => { }}
                                label="Confirm Password"
                                fullWidth
                                size="medium"
                                InputLabelProps={fieldCss}
                                InputProps={fieldInputCss}
                            />
                        </ThemeProvider>

                    </Stack>
                    <Stack className={styles.add_modal_btn}>
                        <Stack className={styles.active_actions}>
                            <Stack className={styles.active_toggle} onClick={() => { setIsNotify(!isNotify) }}>
                                {isNotify ?
                                    <img src={NotifyToggle} />
                                    : <img src={NotNotifyToggle}
                                    />}
                            </Stack>
                            <Stack className={styles.active}>Active this agent</Stack>
                        </Stack>
                        <Stack className={styles.buttons}>
                            <Stack className={styles.buttons_cancel}>Cancel</Stack>
                            <Stack className={styles.buttons_save}>Save</Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
            {/* End */}

            {/* MODAL for Delete the notes */}

            <Modal
                open={deleteModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box className={styles.delete_modal}>
                    <Stack
                        className={styles.delete_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>Delete Lead</Stack>
                        <Stack
                            className={styles.delete_modal_close}
                            onClick={() => setDeleteModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                    <Box className={styles.delete_Note_Text}>
                        Are you sure want to delete this permanently, this action is irreversible.
                    </Box>
                    <Box className={styles.delete_btn}>
                        <Box
                            className={styles.delete_Cancel}
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </Box>
                        <Box
                            className={styles.delete_button}
                        // onClick={}
                        >
                            Delete
                        </Box>
                    </Box>
                </Box>
            </Modal>
            {/* End */}
        </>
    )
}

export default AgentConfig
