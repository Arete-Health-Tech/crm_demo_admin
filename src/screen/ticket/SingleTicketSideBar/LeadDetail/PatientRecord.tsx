import { Autocomplete, Box, Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom'
import '../../singleTicket.css';
import ShowPrescription from '../../widgets/ShowPrescriptionModal';
import { iTicket } from '../../../../types/store/ticket';
import useTicketStore from '../../../../store/ticketStore';
import useServiceStore from '../../../../store/serviceStore';
import { iDepartment, iDoctor, iService } from '../../../../types/store/service';
import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { updateConusmerData, updateService } from '../../../../api/ticket/ticket';
import { getTicketHandler } from '../../../../api/ticket/ticketHandler';
import { elements } from 'chart.js';
import { UNDEFINED } from '../../../../constantUtils/constant';
import { apiClient } from '../../../../api/apiClient';

const EditIcon = () => (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="vuesax/linear/edit-2">
            <g id="edit-2">
                <path id="Vector" d="M11.05 3.50002L4.20829 10.7417C3.94996 11.0167 3.69996 11.5584 3.64996 11.9334L3.34162 14.6333C3.23329 15.6083 3.93329 16.275 4.89996 16.1084L7.58329 15.65C7.95829 15.5834 8.48329 15.3084 8.74162 15.025L15.5833 7.78335C16.7666 6.53335 17.3 5.10835 15.4583 3.36668C13.625 1.64168 12.2333 2.25002 11.05 3.50002Z" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path id="Vector_2" d="M9.90833 4.7085C10.2667 7.0085 12.1333 8.76683 14.45 9.00016" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path id="Vector_3" d="M2.5 18.8335H17.5" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </g>
        </g>
    </svg>
);

interface MyComponentProps {
    isPatient: boolean;
}

type iPrescription = {
    department: string;
    // subDepartment: string;
    doctor: string;
    admission: null | string;
    symptoms: string | null;
    condition: string | null;
    medicines: string[];
    followUp: Date | number;
    image: string | null;
    isPharmacy: string | null;
    caregiver_name: string | null;
    caregiver_phone: string | null;
    service?: { _id: string; label: string };
};

const initialPrescription = {
    admission: 'none'
};

const menuItemStyles = {
    color: 'var(--Text-Black, #080F1A)',
    fontFamily: `"Outfit", sans-serif`,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%'
};

const PatientRecord = ({ isPatient }) => {
    const {
        filterTickets,
        searchByName,
        pageNumber,
        isAuditor
    } = useTicketStore();
    const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [diagonsticsTest, setDiagonsticsTest] = React.useState([""]);
    const [diagonstics, setDiagonstics] = React.useState([""]);
    const [isDiagonsticTestEditing, setIsDiagonsticTestEditing] = React.useState(false);
    const [admissionType, setAdmissionType] = useState<string>(
        currentTicket?.prescription[0]?.admission || ''
    );
    const {
        tickets,
    } = useTicketStore();
    const { allServices, services } = useServiceStore();
    const { ticketID } = useParams();
    // console.log(services, "servicee-------------------------------------");

    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);

            if (currentTicket?.prescription?.[0]?.diagnostics?.length > 0) {
                setDiagonsticsTest(currentTicket?.prescription?.[0]?.diagnostics?.length[0]);
            }
        };

        getTicketInfo(ticketID);

        // console.log(diagonsticsTest, 'ncdbfndbfndbfn');

    }, [ticketID, tickets, diagonsticsTest])

    const getServiceName = () => {
        const service = services?.filter((elements) => currentTicket?.prescription?.[0]?.service === elements._id)
        // console.log(service[0]?.name, "---xdfsd---------------------");
        return service[0]?.name
    }



    const handleAdmissionSubmit = async (event, item) => {
        event.preventDefault();
        // setAdmissionType(item);
        if (item == "Surgery") {
            const updatedData = {
                "consumer": {},
                "prescription": {
                    "admission": item
                }
            }
            await updateConusmerData(updatedData, ticketID)
        } else {
            const updatedData = {
                "consumer": {},
                "prescription": {
                    "admission": item,
                    "service": null
                }
            }
            await updateConusmerData(updatedData, ticketID)
        }

        await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
        );
        setIsEditing(false);
        setAdmissionType('');
    };

    const handleEditDiagonsticTest = async (event) => {
        event.preventDefault();
        const updatedData = {
            "consumer": {},
            "prescription": {
                "diagnostics": diagonstics
            }
        }
        await updateConusmerData(updatedData, ticketID)
        await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
        );
        setIsDiagonsticTestEditing(false);
    };

    const handleDiagnosticChange = (e: SelectChangeEvent<string>, index: number) => {
        if (currentTicket) {
            const newDiagnostics = [...currentTicket.prescription[0].diagnostics];
            newDiagnostics[index] = e.target.value as string;
            setDiagonstics(newDiagnostics)
            setCurrentTicket({
                ...currentTicket,
                prescription: [{
                    ...currentTicket.prescription[0],
                    diagnostics: newDiagnostics
                }]
            });

        }
    };

    // console.log(diagonstics)


    const addDiagnosticTest = () => {
        if (currentTicket) {
            const newDiagnostics = [...currentTicket.prescription[0].diagnostics, ""];
            setCurrentTicket({
                ...currentTicket,
                prescription: [{
                    ...currentTicket.prescription[0],
                    diagnostics: newDiagnostics
                }]
            });
        }
    };

    const removeDiagnosticTest = (index: number) => {
        if (currentTicket) {
            const newDiagnostics = currentTicket.prescription[0].diagnostics.filter((_, i) => i !== index);
            setCurrentTicket({
                ...currentTicket,
                prescription: [{
                    ...currentTicket.prescription[0],
                    diagnostics: newDiagnostics
                }]
            });
        }
    };

    const [admissionTypeClicked, setAmissionTypeClicked] = useState(true);
    const [prescription, setPrescription] = useState<iPrescription>(
        /* @ts-ignore */
        structuredClone(initialPrescription)
    );
    const [validations, setValidations] = useState({
        admission: { message: '', value: false },
        service: { message: '', value: false }
    });
    const [foundServices, setFoundServices] = useState<iService[]>([]);
    const [buttonVariant, setButtonVariant] = useState<string | null>(null);
    const [disableButton, setDisableButton] = useState(false);
    const defaultValidation = { message: '', value: false };
    const [selectedInternalRef, setSelectedInternalRef] = useState('');
    const [inputSearch, setInputSearch] = useState('');

    const handleInternalRefChange = (event) => {
        const value = event.target.value;
        setSelectedInternalRef(value);
        handleInternal(value);
        // console.log(value, 'Internal Ref Change ');
    };

    const changePrescriptionValue = (field: any, value: any) => {
        setPrescription((prev: any) => {
            prev[field] = value;
            return { ...prev };
        });
    };

    useEffect(() => {
        /* @ts-ignore */
        setPrescription(structuredClone(initialPrescription));
    }, []);

    const validation = () => {
        const admission = prescription.admission === '';
        setValidations((prev) => {
            prev.admission = admission
                ? { message: 'Invalid Value', value: true }
                : defaultValidation;
            return { ...prev };
        });

        return admission === false;
    };

    const handleInternal = (item: string) => {
        // console.log('this is response');
        setButtonVariant(item);
    };

    const findService = async (query: string) => {
        try {
            if (query.length <= 3) return;
            const { data } = await apiClient.get(`/service/search?search=${query}`);

            setFoundServices(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handelUploadType = async () => {
        setDisableButton(true);
        const validationCheck = validation();
        if (validationCheck === true) {
            const updatedData =
            // "consumer": {},
            // "prescription":
            {
                admission: prescription.admission,
                service: prescription?.service?._id
            }

            const ticketId = ticketID;
            const respose = await updateService(updatedData, ticketId);
            setDisableButton(false);
            setAmissionTypeClicked(true);
            setIsEditing(false);
            getTicketHandler(UNDEFINED, 1, 'false', filterTickets);

            // const url = ticketID !== undefined ? `/ticket/${ticketID}` : `/ticket`;
            // window.location.href = url;
            // window.location.reload();
            // const ticket: any = structuredClone(prescription);
            // delete ticket.department;
            // delete ticket.subDepartment;
            // ticket.departments = [prescription.department];

            // ticket.followup = ticket.followup ? ticket.followup : null;
            // // await createTicketHandler(ticket);
            // setPrescription(structuredClone(initialPrescription));
            // // setDiagnostics([]);
            // setDisableButton(false);

            // // navigate('/');
        } else {
            setDisableButton(false);
        }
    };

    return (
        <>

            {/* Admission Details */}
            {currentTicket?.prescription[0]?.admission ? (
                <Box className="Patient-records">
                    <Box className='Patient-records-Head'>
                        <Stack className='Patient-records-Heading'>Admission Details</Stack>
                        <Stack display="flex" flexDirection="row">
                            {isEditing ? (
                                <Stack display="flex" flexDirection="row">
                                    <button style={{
                                        color: "black",

                                    }}
                                        onClick={() => {
                                            // changePrescriptionValue('admission', 'none');
                                            setIsEditing(false);
                                            // setSelectedInternalRef('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className='save-btn'
                                        disabled={disableButton}
                                        // onClick={handelUploadType}
                                        onClick={(event) => handleAdmissionSubmit(event, admissionType)}
                                        style={{
                                            backgroundColor: disableButton ? '#F6F7F9' : '#0566FF',
                                            color: disableButton ? '#647491' : '#FFF',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        {disableButton ? 'Uploading ...' : 'Save'}
                                    </button>
                                </Stack>
                            ) : (
                                <>
                                    {!isAuditor && <Stack
                                        component='div'
                                        className='edit-icon'
                                        sx={{ marginLeft: isEditing ? "10px" : "0" }}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <EditIcon />
                                    </Stack>
                                    }
                                </>


                            )}
                        </Stack>
                    </Box>
                    {isEditing ? (
                        <Box className='Patient-records-Head'>
                            {/* <Stack className='Patient-records-data'>
                                <Select
                                    id="AdmissionType"
                                    value={admissionType}
                                    onChange={(e) => setAdmissionType(e.target.value as string)}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ style: { fontSize: '12px', fontFamily: "Outfit,sans-serif" } }}
                                >
                                    <MenuItem value="surgery" sx={{ fontSize: '12px', fontFamily: "Outfit,sans-serif" }}>Surgery</MenuItem>
                                    <MenuItem value="MM" sx={{ fontSize: '12px', fontFamily: "Outfit,sans-serif" }}>MM</MenuItem>
                                    <MenuItem value="Radiation" sx={{ fontSize: '12px', fontFamily: "Outfit,sans-serif" }}>Radiation</MenuItem>
                                </Select>
                            </Stack> */}
                            <Box display={"flex"} flexDirection="column">
                                <Box display={`${isEditing}` ? "block" : "none"}>
                                    <Stack flexWrap={'wrap'} flexDirection="row" gap={'14px'}>
                                        {['Surgery',
                                            // 'Radiation',
                                            'MM',
                                            'DC'].map((item) => (
                                                <button
                                                    key={item}
                                                    className="call-Button"
                                                    style={{
                                                        backgroundColor: admissionType == item ? '#DAE8FF' : '#F6F7F9',
                                                        fontSize: '12px',
                                                    }}
                                                    onClick={() => {
                                                        setAdmissionType(item);
                                                    }}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                    </Stack>
                                </Box>
                                {/* <Box display={`${isEditing}` ? "block" : "none"}>
                                    <Stack flexWrap={'wrap'} flexDirection="row" gap={'14px'}>
                                        {[
                                            'none',
                                            'Surgery',
                                            'Radiation',
                                            'MM',
                                            'DC',
                                            // 'Internal Reference'
                                        ].map((item) => (
                                            <button
                                                className="call-Button"
                                                style={{
                                                    backgroundColor:
                                                        prescription.admission === item ? '#DAE8FF' : '#F6F7F9',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => changePrescriptionValue('admission', item)}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </Stack>

                                    <FormHelperText error={validations.admission.value}>
                                        {validations.admission.message}
                                    </FormHelperText>

                                    {prescription.admission === 'Internal Reference' ? (
                                        <Stack my={1.5}>
                                            <FormControl
                                                size="small"
                                                fullWidth
                                                sx={{ minWidth: 120, m: 0.4 }}
                                            >
                                                <InputLabel
                                                    id="internal-reference-label"
                                                    sx={{
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit,sans-serif'
                                                    }}
                                                >
                                                    Internal Reference
                                                </InputLabel>
                                                <Select
                                                    labelId="internal-reference-label"
                                                    value={selectedInternalRef}
                                                    onChange={handleInternalRefChange}
                                                    label="Internal Reference"
                                                    sx={{
                                                        '.MuiSelect-select': {
                                                            textTransform: 'capitalize',
                                                            fontSize: '14px',
                                                            fontFamily: 'Outfit,sans-serif'
                                                        }
                                                    }}
                                                >
                                                    {['Med', 'Surg', 'Chemo'].map((item) => (
                                                        <MenuItem key={item} value={item} sx={menuItemStyles}>
                                                            {item}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    ) : (
                                        prescription.admission === 'Surgery' ? (
                                            <Box my={1.5}>
                                                <Autocomplete
                                                    size="small"
                                                    fullWidth
                                                    onChange={(_, newValue) =>
                                                        changePrescriptionValue('service', newValue)
                                                    }
                                                    options={foundServices}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            onChange={(e) => findService(e.target.value)}
                                                            {...params}
                                                            label="Service"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                style: {
                                                                    textTransform: 'capitalize',
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Outfit,sans-serif'
                                                                }
                                                            }}
                                                            InputLabelProps={{
                                                                style: {
                                                                    textTransform: 'capitalize',
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Outfit,sans-serif'
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                                <FormHelperText
                                                    error={validations.service.value}
                                                    sx={{
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit,sans-serif'
                                                    }}
                                                >
                                                    {validations.service.message}
                                                </FormHelperText>
                                            </Box>
                                        ) : (<></>)
                                    )}
                                </Box> */}
                            </Box>
                        </Box>
                    ) : (
                        <>
                            {getServiceName() && <>
                                <Stack display={'flex'} flexDirection={'row'}>
                                    <Stack className='dot-list'  >
                                        <span>&#8226;</span>
                                    </Stack>
                                    <Stack className='Patient-records-data'>{getServiceName()}</Stack>
                                </Stack>
                            </>}
                            {currentTicket?.prescription[0].remarks && currentTicket?.prescription[0].remarks !== " " &&
                                <Stack display={'flex'} flexDirection={'row'}>
                                    <Stack className='dot-list'  >
                                        <span>&#8226;</span>
                                    </Stack>
                                    <Stack className='Patient-records-data'>{currentTicket?.prescription[0].remarks}</Stack>
                                </Stack>
                            }
                            <Box className="record-tag pharmacy-tag">{currentTicket?.prescription[0]?.admission}</Box>
                        </>
                    )}
                </Box>
            ) : null}


            {currentTicket?.prescription?.[0]?.diagnostics?.length > 0 && currentTicket?.prescription?.[0]?.diagnostics[0] !== null ?
                <Stack className="gray-border">
                    {/* Borders */}
                </Stack> : (<></>)}

            {/* Diagnostics Test */}
            {currentTicket?.prescription?.[0]?.diagnostics?.length > 0 && currentTicket?.prescription?.[0]?.diagnostics[0] !== null ? (
                <Box className="Patient-records">
                    <Box className='Patient-records-Head'>
                        <Stack className='Patient-records-Heading'>Diagnostics Test</Stack>
                        {true ? ( // Assuming isPatient is always true for the example
                            <Stack display="flex" flexDirection="row">
                                {isDiagonsticTestEditing ? (
                                    <Stack display="flex" flexDirection="row" gap={"5px"} >
                                        <button className='cancel-btn'
                                            onClick={() => setIsDiagonsticTestEditing(false)}>
                                            cancel
                                        </button>
                                        <Box className='Patient-records-Head'>
                                            <button className='save-btn' onClick={addDiagnosticTest}>
                                                <AddIcon />
                                            </button>
                                        </Box>

                                        <button className='save-btn' onClick={handleEditDiagonsticTest}>
                                            Save
                                        </button>
                                    </Stack>
                                ) : (
                                    <>
                                        {!isAuditor && <Stack
                                            component='div'
                                            className='edit-icon'
                                            sx={{ marginLeft: isDiagonsticTestEditing ? "10px" : "0" }}
                                            onClick={() => setIsDiagonsticTestEditing(true)}
                                        >
                                            <EditIcon />
                                        </Stack>}
                                    </>

                                )}
                            </Stack>
                        ) : null}
                    </Box>
                    {currentTicket?.prescription?.[0]?.diagnostics.map((diagnostic, index) => (
                        <React.Fragment key={index}>
                            <Box className='Patient-records-Head'>
                                {isDiagonsticTestEditing ? (
                                    <Stack className='Patient-records-data' direction="row" alignItems="center">
                                        <Select
                                            labelId="Diagnostics Test"
                                            id="Diagnostics Test"
                                            value={diagnostic}
                                            onChange={(e) => handleDiagnosticChange(e, index)}
                                            variant="outlined"
                                            size="small"
                                            style={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}
                                        >
                                            <MenuItem value="MRI" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>MRI</MenuItem>
                                            <MenuItem value="PET-CT" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>PET-CT</MenuItem>
                                            <MenuItem value="CT-SCAN" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>CT SCAN</MenuItem>
                                            <MenuItem value="Lab" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>Lab</MenuItem>
                                            <MenuItem value="USG" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>USG</MenuItem>
                                            <MenuItem value="X-RAY" sx={{ fontFamily: "Outfit,sans-serif", fontSize: "12px" }}>X-RAY</MenuItem>
                                        </Select>
                                        <IconButton onClick={() => removeDiagnosticTest(index)}>
                                            <DeleteIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                    </Stack>
                                ) : (
                                    <>

                                        <Stack className='dot-list'>
                                            <span>&#8226;</span>
                                        </Stack>
                                        <Stack className='Patient-records-data'>{diagnostic}</Stack>
                                    </>
                                )}
                            </Box>
                        </React.Fragment>
                    ))}
                </Box>
            ) : null}

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>
            {/* Pharmacy */}
            <Box className="Patient-records Pharmacy">
                <Box className='Patient-records-Head'>
                    <Stack className='Patient-records-Heading'>Pharmacy</Stack>
                </Box>
                <Box className='Patient-records-Head' display={'flex'} flexDirection={'column'}>
                    {(currentTicket?.prescription?.[0]?.medicines?.length ?? 0) > 0 ? (
                        <>
                            {currentTicket?.prescription[0]?.medicines.map((med, index) => (
                                <React.Fragment key={index} >
                                    <Stack display={'flex'} flexDirection={'row'}>
                                        <Stack className='dot-list'  >
                                            <span>&#8226;</span>
                                        </Stack>
                                        <Stack className='Patient-records-data'>{med}</Stack>
                                    </Stack>

                                </React.Fragment>
                            ))}
                            < Box className="record-tag pharmacy-tag" marginTop={"5px"}>{currentTicket?.prescription[0]?.isPharmacy}</Box>
                        </>
                    ) : (<>
                        <Box className="record-tag pharmacy-tag" sx={{ width: currentTicket?.prescription[0]?.isPharmacy == "Not Advised" ? "102px;" : "width: 132px;" }}>{currentTicket?.prescription[0]?.isPharmacy}</Box>
                    </>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default PatientRecord