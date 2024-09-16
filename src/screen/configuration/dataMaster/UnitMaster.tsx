import React, { useEffect, useRef, useState } from 'react'
import styles from './UnitMaster.module.css'

import { Box, createTheme, FormControl, InputLabel, MenuItem, Modal, outlinedInputClasses, Select, Stack, TextField, Theme, ThemeProvider, useTheme } from '@mui/material'
import DefaultScreen from './../../../../src/assets/NotFoundTask.svg';
import CloseModalIcon from "../../../assets/Group 48095853.svg"
import NotifyToggle from '../../../assets/NotifyToggle.svg';
import NotNotifyToggle from '../../../assets/NotNotifyToggle.svg';
import SearchIcon from '@mui/icons-material/Search';
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

const UnitMaster = () => {
    const outerTheme = useTheme();
    const [isNewUnit, setIsNewUnit] = useState(false);
    const [isNotify, setIsNotify] = useState(false);
    const [isUnitAddModalOpen, setIsUnitAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const MenuRef = useRef<HTMLDivElement | null>(null);

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
            <Box className={styles.UnitConfig_container}>
                <Box className={styles.UnitConfig_container_head}>
                    <Stack className={styles.UnitConfig_container_head_title}>Units</Stack>
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
                        <Stack className={styles.UnitConfig_container_head_Btn} onClick={() => { setIsUnitAddModalOpen(true) }}>
                            <Stack>+</Stack>
                            <Stack sx={{ whiteSpace: "nowrap" }}>New Unit</Stack>
                        </Stack>
                    </Stack>


                </Box>

                <Box className={styles.UnitConfig_container_table}>
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
                                            Unit Name
                                            <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                <img src={SortArrowIcon} alt="sortArrow" />
                                            </Stack>
                                        </th>
                                        <th className={`${styles.table_head_item} ${styles.item2}`}>Created On</th>
                                        <th className={`${styles.table_head_item} ${styles.item3}`}></th>

                                    </tr>
                                </thead>
                            </Box>
                            {false ? (
                                <Box sx={{
                                    height: "100%", overflowY: 'auto',
                                    '&::-webkit-scrollbar': { width: '4px', marginTop: "100px" },
                                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#DAE8FF', borderRadius: '4px' },
                                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
                                }}>

                                    <tbody>
                                        <tr className={styles.table_body}>
                                            {/* CheckBox */}
                                            <td className={`${styles.table_body_item}`}>
                                                <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                    <img src={EmptyCheckBox} alt="sortArrow" />
                                                </Stack>
                                            </td>

                                            {/* Unit  Name */}
                                            <td className={`${styles.table_body_item} ${styles.body_item1}`}>
                                                Hoshiarpur
                                            </td>

                                            {/* Created On  */}
                                            <td className={`${styles.table_body_item} ${styles.body_item2}`}>
                                                23 April 2024
                                            </td>

                                            {/* menu bar */}
                                            <td className={`${styles.table_body_item} ${styles.body_item3}`}>
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
                                                                <Stack className={`${styles.menu_options} ${styles.delete_option}`}
                                                                    onClick={() => {
                                                                        setDeleteModal(true);
                                                                        setIsMenuOpen(false);
                                                                    }}>
                                                                    Delete
                                                                </Stack>
                                                            </Stack>
                                                        </>) : (<></>)
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </Box>
                            ) : (
                                <>
                                    <Box className={styles.default_screen}>
                                        <Stack className={styles.default_screen_content}>
                                            <Stack className={styles.default_image}>
                                                <img src={DefaultScreen} />
                                            </Stack>
                                            <Stack className={styles.default_head1}>
                                                No Unit Yet
                                            </Stack>
                                            <Stack className={styles.default_head2}>
                                                It looks like you haven't added any Unit yet. Tap on "Add Unit" to get started!
                                            </Stack>
                                        </Stack>

                                    </Box>
                                </>
                            )}
                        </table>
                    </Box>
                </Box>

                <Box className={styles.UnitConfig_container_pagination}>
                    Pagination
                </Box>
            </Box>

            {/* Add Modal */}
            <Modal
                open={isUnitAddModalOpen}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.add_modal}>
                    <Stack className={styles.add_modal_head}>
                        <Stack className={styles.add_modal_head_title}>Add Unit</Stack>
                        <Stack
                            className={styles.modal_close}
                            onClick={() => { setIsUnitAddModalOpen(false) }}
                        >
                            <img src={CloseModalIcon} />
                        </Stack>
                    </Stack>
                    <Stack className={styles.add_modal_field}>


                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField className='inputField-placeholder'
                                id="outlined-required"
                                required
                                // value={}
                                // onChange={(e) => { }}
                                label="Name"
                                fullWidth
                                size="medium"
                                InputLabelProps={fieldCss}
                                InputProps={fieldInputCss}
                            />
                        </ThemeProvider>

                    </Stack>
                    <Stack className={styles.add_modal_btn}>

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

export default UnitMaster
