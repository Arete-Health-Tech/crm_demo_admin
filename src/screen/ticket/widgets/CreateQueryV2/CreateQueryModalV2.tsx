import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Stack,
    Switch,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import styles from './CreateQueryV2.module.css';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import notesAttachmentIcon from '../../../../assets/notesAttachmentIcon.svg';

const selectDropDown = {
    height: '3rem', // Set the height of the Select component
    border: '1px solid #D4DBE5', // Set a border for the Select component
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent', // You can make it transparent
        borderWidth: 0 // Or remove the border
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'D4DBE5' // Custom color on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'D4DBE5', // Custom color when focused
        borderWidth: 2 // Optionally increase border width when focused
    }
}

const CreateQueryModalV2 = () => {
    const [queryModal, setQueryModal] = useState(false);
    const [age, setAge] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const InputLabelCss = {
        backgroundColor: age ? 'white' : 'transparent', // Change background based on selection
        '&.Mui-focused': {
            backgroundColor: 'white' // Ensure background is white when focused
        },
        '&.Mui-formLabel-filled': {
            backgroundColor: 'white' // Ensure background remains white when filled
        }
    }
    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <>
            <Box
                height="15vh"
                bottom={2}
                borderTop={2.5}
                borderColor="#317AE2"
                bgcolor="white"
            >
                <Box
                    display={'flex'}
                    justifyContent={'end'}
                    marginTop={1}
                    paddingRight={2}
                >
                    <img src={expandIcon} alt="" />
                </Box>
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    color={'#647491'}
                    fontFamily={'Outfit, sans-serif'}
                    fontSize={'1rem'}
                    fontWeight={400}
                >
                    This a guided text will be added
                </Box>
                <Box
                    className={styles.createQueryButton}
                    onClick={() => setQueryModal(true)}
                >
                    <span>Create a Query</span>
                </Box>
            </Box>

            <Modal
                open={queryModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box className={styles.openedModal}>
                    <Stack
                        className={styles.reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>Create a Query</Stack>
                        <Stack
                            className={styles.modal_close}
                            onClick={() => setQueryModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                    <Box display="flex" justifyContent="space-around">
                        <FormControl sx={{ m: 1, width: 300 }} size="medium">
                            <InputLabel
                                id="demo-select-small-label"
                                sx={InputLabelCss}
                            >
                                Select Department
                            </InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={age}
                                label="Select Department"
                                onChange={handleChange}
                                sx={selectDropDown}
                            >
                                <MenuItem value="" sx={{
                                    fontStyle: 'Outfit,san-serif', // Style for placeholder item
                                    color: '#647491', // Custom color for placeholder text
                                    fontSize: '0.875rem',
                                    fontWeight: '400'
                                }}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 300 }} size="medium">
                            <InputLabel
                                id="demo-select-small-label"
                                sx={InputLabelCss}
                            >
                                Select SPOC
                            </InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={age}
                                label="Select SPOC"
                                onChange={handleChange}
                                sx={selectDropDown}
                            >
                                <MenuItem value="" sx={{
                                    fontStyle: 'Outfit,san-serif', // Style for placeholder item
                                    color: '#647491', // Custom color for placeholder text
                                    fontSize: '0.875rem',
                                    fontWeight: '400'
                                }}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <textarea className={styles.QueryTitle} placeholder="Query Title" />
                    </Box>
                    <Box>
                        <textarea
                            className={styles.Querycomment}
                            placeholder="Add Comment"
                        />
                    </Box>
                    <Box className={styles.AttachmentFooter}>
                        <Box>
                            <img src={notesAttachmentIcon} alt="" />
                        </Box>
                        <Box className={styles.AttachmentText}>Add Attachments</Box>
                    </Box>
                    <Box className={styles.queryFooter}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Switch
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                            />
                            <Typography
                                color={'#000'}
                                fontFamily={'Outfit,san-serif'}
                                fontSize={'0.875rem'}
                                fontWeight={'500'}
                            >
                                Notify on Whatsapp
                            </Typography>
                        </Box>
                        <Box display={'flex'}>
                            <Box
                                className={styles.Cancel}
                                onClick={() => setQueryModal(false)}
                            >
                                Cancel
                            </Box>
                            <Box className={styles.createQuery}>Create Query</Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CreateQueryModalV2;
