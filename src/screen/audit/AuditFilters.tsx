import { MenuItem, Stack, Zoom } from '@mui/material';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { DatePicker } from 'antd';
import styles from "./audit.module.css";
import ArrowDownIcon from '../../assets/ArrowDown.svg';
import { ClearAll, Difference, FilterList } from '@mui/icons-material';
import {
    Badge,
    BadgeProps,
    Button,
    Checkbox,
    Drawer,
    FormControlLabel,
    FormGroup,
    IconButton,
    Select,
    styled,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { iTicketFilter } from '../../types/store/ticket';
import { getAllAuditTicketHandler } from '../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../constantUtils/constant';
import { filterActions } from '../ticket/ticketStateReducers/actions/filterAction';
import { validateTicket } from '../../api/ticket/ticket';
import { getStagesHandler } from '../../api/stages/stagesHandler';
import { getRepresntativesHandler } from '../../api/representive/representativeHandler';
import { selectedFiltersReducer, ticketFilterTypes } from '../ticket/ticketStateReducers/filter';
import useTicketStore from '../../store/ticketStore';
import ClearIcon from '@mui/icons-material/Clear';
import { set } from 'date-fns';

const drawerWidth = 450;
export const ticketFilterCount = (
    selectedFilters: iTicketFilter,
    admissionType: string[],
    diagnosticsType: string[],
    dateRange: string[],
    statusType: string[],
    auditStage: string,
    auditStatus: string,
    auditResult: string,
    auditDateRange: string[]

) => {
    // const stageListCount = selectedFilters['stageList'].length;
    const stageListCount = auditStage.length > 0 ? 1 : 0;   //Audit Filter

    const representativeCount = selectedFilters['representative'] ? 1 : 0;
    const admissionCount = admissionType ? admissionType.length : 0;
    const diagnosticsCount = diagnosticsType ? diagnosticsType.length : 0;

    const DateCount = auditDateRange[0] && auditDateRange[1] ? 1 : 0;
    // const DateCount = dateRange[0] && dateRange[1] ? 1 : 0;

    const resultCount = auditResult.length > 0 ? 1 : 0; //Audit Filter
    // const resultCount = selectedFilters['results'] ? 1 : 0;

    const statusCount = auditStatus.length > 0 ? 1 : 0;  //Audit Filter
    // const statusCount = statusType ? statusType.length : 0;

    const total = stageListCount + representativeCount + resultCount + admissionCount + diagnosticsCount + DateCount + statusCount;
    return total;
};

const datePickerStyle = {
    backgroundColor: '#E1E6EE',
    color: "#000",
    fontFamily: "Outfit,sans-serif",
    borderRadius: '16px',
    minHeight: "35px",
    padding: "4px 20px",
    border: "none",
    width: "250px"
};
const menuItemStyles = {
    color: "var(--Text-Black, #080F1A)",
    fontFamily: `"Outfit", sans-serif`,
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
};


const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#0566FF',
        color: '#ffffff',
        fontSize: 10,
        fontFamily: `"Outfit",sans-serif`
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#0566FF',
    }
}));

const AuditFilters = (props: {
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const {
        auditFilterCount,
        auditStage,
        setAuditStage,
        setAuditFilterCount,
        auditStatus,
        setAuditStatus,
        auditResult,
        setAuditResult,
        auditDateRange,
        setAuditDateRange
    } = useTicketStore();

    const { ticketID } = useParams();
    const navigate = useNavigate();
    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 7,
            padding: '0 4px',
            color: "#FFFFFF",
            backgroundColor: "#0566FF"
        }
    }));

    const initialFilters: ticketFilterTypes = {
        stageList: [],
        representative: null,
        results: null,
        admissionType: [],
        diagnosticsType: [],
        dateRange: [],
        status: [],
        followUp: null
    };

    const {
        setFilterTickets,
        setPageNumber,
    } = useTicketStore();

    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [admissionType, setAdmissionType] = React.useState<string[]>([]);
    const [statusType, setStatusType] = React.useState<string[]>([]);
    const [result, setResult] = React.useState('');
    const [diagnosticsType, setDiagnosticsType] = React.useState<string[]>(
        () => []
    );
    const [stagesLabel, setStagesLabels] = React.useState<any>([]);
    const [representativeLabel, setRepresentativeLabel] = React.useState<any>([]);

    const [selectedFilters, dispatchFilter] = useReducer(
        selectedFiltersReducer,
        initialFilters
    );

    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');
    const [dateRange, setDateRange] = React.useState<string[]>(['', '']);
    const [currentReperesentative, setCurrentRepresentative] = useState('');
    const [selectedReperesentativeName, setSelectedRepresentativeName] = useState('');
    const [filterCount, setFilterCount] = useState(0);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValueLost, setSelectedValueLost] = useState(null);
    const [openStageFilter, setOpenStageFilter] = useState(false);
    const [openAuditValueFilter, setOpenAuditValueFilter] = useState(false);
    const [openResultFilter, setOpenResultFilter] = useState(false);
    const [openAgentNameFilter, setOpenAgentNameFilter] = useState(false);
    const [selectedStage, setSelectedStage] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dates, setDates] = useState(["", ""]);



    const handleStatusChange = (status: any) => {
        setAuditStatus(status);
        setSelectedStatus(status);
        setStatusType([status]);
        dispatchFilter({
            type: filterActions.STATUS,
            payload: [status]
        });
        setOpenAuditValueFilter(false)
    }

    // const handleStageList = (id, label) => {

    //     if (selectedFilters.stageList.includes(id)) {
    //         const modifiedStageList = selectedFilters.stageList.filter(stage => stage !== id);

    //         dispatchFilter({
    //             type: filterActions.STAGES,
    //             payload: [...modifiedStageList]
    //         });
    //         return;
    //     }
    //     dispatchFilter({
    //         type: filterActions.STAGES,
    //         payload: [...selectedFilters.stageList, id]
    //     });
    //     setSelectedStage(label);
    //     setOpenStageFilter(false);
    // };

    const handleStageList = (id, label) => {

        dispatchFilter({
            type: filterActions.STAGES,
            payload: [id]
        });
        setAuditStage(label);
        setSelectedStage(label);
        setOpenStageFilter(false);
    };

    const handleRepresentativeClick = (id: any, name: any) => {
        setSelectedRepresentativeName(name);
        const value = id;
        if (value) {
            setCurrentRepresentative(value);
            dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: value });
        }
        setOpenAgentNameFilter(false);
    };

    React.useEffect(() => {
        (async () => {
            const fetchedStageData = await getStagesHandler();
            const fetchedRepresentative = await getRepresntativesHandler();

            const transformStages = fetchedStageData.map(({ _id, name }) => {
                return {
                    id: _id,
                    label: name
                };
            });
            const transformRepresentative = fetchedRepresentative.map(
                ({ _id, firstName, lastName }) => {
                    const labelName = `${firstName} ${lastName}`;
                    return {
                        id: _id,
                        label: labelName
                    };
                }
            );
            setRepresentativeLabel(transformRepresentative);
            setStagesLabels(transformStages);
        })();
    }, []);


    const handleApplyFilter = async () => {

        setIsFilterOpen(false);
        setPageNumber(1);
        await getAllAuditTicketHandler(UNDEFINED, 1, 'false', selectedFilters);
        // setFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange, statusType));
        setAuditFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange, statusType, auditStage, auditStatus, auditResult, auditDateRange));
        setFilterTickets(selectedFilters);

        props.setPage(1);
        if (ticketID) {
            await validateTicket(ticketID);
            // navigate(NAVIGATE_TO_TICKET);
            navigate('/auditDetails');
        }
        // console.log('filter dtata', selectedFilters);
    };

    const handleClearFilter = async () => {
        dispatchFilter({ type: filterActions.STAGES, payload: [] });
        dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: null });
        dispatchFilter({ type: filterActions.ADMISSIONTYPE, payload: [] });
        dispatchFilter({ type: filterActions.DIAGNOSTICSTYPE, payload: [] });
        dispatchFilter({ type: filterActions.DATERANGE, payload: [] });
        dispatchFilter({ type: filterActions.RESULTS, payload: null });
        dispatchFilter({ type: filterActions.STATUS, payload: [] });

        setCurrentRepresentative('');
        // setFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange, statusType));
        setAuditFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange, statusType, auditStage, auditStatus, auditResult, auditDateRange));
        setAuditStage("");
        setAuditStatus("");
        setAuditResult("");
        setAuditDateRange(["", ""]);
        setAuditFilterCount(0);

        setFilterCount(0);
        setPageNumber(1);
        setSelectedValue(null);
        setSelectedValueLost(null);
        setResult(" ")
        setAdmissionType((prev) => []);
        setStatusType((prev) => []);
        setDiagnosticsType((prev) => []);
        setDateRange(["", ""]);
        setSelectedStage("");
        setSelectedStatus("");
        setSelectedRepresentativeName("");


    };

    const stageRef = useRef<HTMLDivElement | null>(null);
    const AgentNameRef = useRef<HTMLDivElement | null>(null);
    const statusRef = useRef<HTMLDivElement | null>(null);
    const resultRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const isClickOutsideStage =
            stageRef.current && !stageRef.current.contains(event.target as Node);
        const isClickOutsideAgentName =
            AgentNameRef.current &&
            !AgentNameRef.current.contains(event.target as Node);
        const isClickOutsideStatusRef =
            statusRef.current && !statusRef.current.contains(event.target as Node);
        const isClickOutsideResultRef =
            resultRef.current && !resultRef.current.contains(event.target as Node);

        if (isClickOutsideStage) {
            setOpenStageFilter(false);
        }
        if (isClickOutsideAgentName) {
            setOpenAgentNameFilter(false);
        }
        if (isClickOutsideStatusRef) {
            setOpenAuditValueFilter(false);
        }
        if (isClickOutsideResultRef) {
            setOpenResultFilter(false);
        }


    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleResult = (value: string | null) => {
        if (value === 'Won') {
            // setResult(value);
            setAuditResult(value);
            dispatchFilter({
                type: filterActions.RESULTS,
                payload: '65991601a62baad220000001'
            });
        } else if (value === 'Lose') {
            // setResult(value);
            setAuditResult(value);
            dispatchFilter({
                type: filterActions.RESULTS,
                payload: '65991601a62baad220000002'
            });
        } else if (value === null) {
            // setResult('');
            setAuditResult("");
            dispatchFilter({
                type: filterActions.RESULTS,
                payload: null
            });
        }


        setOpenResultFilter(false);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = e.target.value;
        // setDateRange(prevState => [startDate, prevState[1]]);
        setAuditDateRange([startDate, dateRange[1]]);
        dispatchFilter({
            type: filterActions.DATERANGE,
            payload: JSON.stringify([startDate, dateRange[1]])
        });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const endDate = e.target.value;
        // setDateRange(prevState => [prevState[0], endDate]);
        setAuditDateRange([dateRange[0], endDate]);
        dispatchFilter({
            type: filterActions.DATERANGE,
            payload: JSON.stringify([dateRange[0], endDate])
        });
    };


    return (
        <>

            {/* Date Filters */}

            <Stack direction="row" className={styles.Audit_date_filters}>
                <TextField
                    fullWidth
                    onChange={handleStartDateChange}
                    value={auditDateRange[0]}
                    size='small'
                    type="date"
                    InputLabelProps={{ shrink: true, style: { fontFamily: "Outfit,san-serif", } }}
                    inputProps={{ max: new Date().toISOString().split('T')[0], style: { fontFamily: "Outfit,san-serif", fontSize: "14px" } }}
                    InputProps={{
                        style: {
                            border: 'none', // Removes the border
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "14px",
                        },
                        disableUnderline: true, // Removes the underline (if it's an outlined variant)
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none', // Removes the border of the outlined variant
                            },
                        },
                    }}
                />

                <TextField
                    fullWidth
                    onChange={handleEndDateChange}
                    value={auditDateRange[1]}
                    type="date"
                    size='small'
                    InputLabelProps={{ shrink: true, style: { fontFamily: "Outfit,san-serif" } }}
                    inputProps={{ max: new Date().toISOString().split('T')[0], min: new Date(dateRange[0]).toDateString().split('T')[0], style: { fontFamily: "Outfit,san-serif", fontSize: "14px" } }}
                    InputProps={{
                        style: {
                            border: 'none', // Removes the border
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "14px",
                        },
                        disableUnderline: true, // Removes the underline (if it's an outlined variant)
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none', // Removes the border of the outlined variant
                            },
                        },
                    }}
                />
            </Stack>

            {/* Stage Filter */}
            <Stack className={styles.Audit_stage_filter}>
                <Stack className={styles.Audit_filters} onClick={() => {
                    setOpenStageFilter(!openStageFilter);
                    setOpenAuditValueFilter(false);
                    setOpenAgentNameFilter(false);
                }}>
                    <span className={styles.Audit_filters_title} >
                        {/* {pharmacyOrderStatusFilter ? pharmacyOrderStatusFilter === "Pending" ? "Processing" : pharmacyOrderStatusFilter : "All Orders"} */}
                        {/* {selectedStage ? selectedStage : "Stages"} */}
                        {auditStage ? auditStage : "Stages"}
                        {/* All Orders */}
                    </span>
                    <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
                </Stack >
                <Stack
                    ref={stageRef}
                    display={openStageFilter ? "block" : "none"}
                    className={styles.Audit_filters_options}
                    bgcolor="white"
                >
                    {stagesLabel.map(({ id, label }) => (
                        <MenuItem
                            sx={menuItemStyles}
                            key={id}
                            onClick={() => handleStageList(id, label)}
                            selected={selectedFilters.stageList.includes(id)}
                        >
                            {label}
                        </MenuItem>
                    ))}

                </Stack>
            </Stack>

            {/* Status Filters */}
            <Stack className={styles.Audit_stage_filter}>
                <Stack className={styles.Audit_filters} onClick={() => {
                    setOpenAuditValueFilter(!openAuditValueFilter);
                    setOpenStageFilter(false);
                    setOpenAgentNameFilter(false);
                }}>
                    <span className={styles.Audit_filters_title} style={{ textTransform: "capitalize" }}>
                        {auditStatus ? auditStatus : "Status"}
                    </span>
                    <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
                </Stack>
                <Stack
                    ref={statusRef}
                    display={openAuditValueFilter ? "block" : "none"}
                    className={styles.Audit_filters_options}
                    bgcolor="white"
                >
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleStatusChange('dnd') }}
                    >
                        DND
                    </MenuItem>
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleStatusChange('dnp') }}
                    >
                        DNP
                    </MenuItem>
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleStatusChange('todayTask') }}
                    >
                        Today Task
                    </MenuItem>
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleStatusChange('pendingTask') }}
                    >
                        Pending
                    </MenuItem>
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleStatusChange('CallCompleted') }}
                    >
                        Call Completed
                    </MenuItem>

                </Stack>
            </Stack>

            {/* won and loss */}
            <Stack className={styles.Audit_stage_filter}>
                <Stack className={styles.Audit_filters} onClick={() => {
                    setOpenResultFilter(!openAuditValueFilter);
                }}>
                    <span className={styles.Audit_filters_title} style={{ textTransform: "capitalize" }}>
                        {auditResult == "Won" ? "WON" : auditResult == "Lose" ? "LOST" : "Result"}
                    </span>
                    <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
                </Stack>
                <Stack
                    ref={resultRef}
                    display={openResultFilter ? "block" : "none"}
                    className={styles.Audit_filters_options}
                    bgcolor="white"
                >
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleResult("Won") }}
                    >
                        WON
                    </MenuItem>
                    <MenuItem
                        sx={menuItemStyles}
                        onClick={() => { handleResult('Lose') }}
                    >
                        LOST
                    </MenuItem>

                </Stack>
            </Stack>

            {/* Agent Name Filters */}
            {/* <Stack className={styles.Audit_stage_filter}>
                <Stack className={styles.Audit_filters} onClick={() => {
                    setOpenAgentNameFilter(!openAgentNameFilter);
                    setOpenAuditValueFilter(false);
                    setOpenStageFilter(false);
                }}>
                    <span className={styles.Audit_filters_title} style={{ textTransform: "capitalize" }}>
                        {selectedReperesentativeName ? selectedReperesentativeName : "Agent Name"}
                    </span>
                    <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
                </Stack>
                <Stack
                    ref={AgentNameRef}
                    display={openAgentNameFilter ? "block" : "none"}
                    className={styles.AuditAgent_filters_options} bgcolor="white"

                >
                    {representativeLabel?.map(({ id, label }, index) => {
                        return <MenuItem sx={menuItemStyles} value={id}
                            onClick={() => { handleRepresentativeClick(id, label) }}
                        >{label}</MenuItem>;
                    })}

                </Stack>
            </Stack> */}

            <Stack display={'flex'} flexDirection={"column"}>
                <Stack display={'flex'} flexDirection={"row"}>
                    <Stack py={1} px={1} display={'flex'} flexDirection={"column"}>
                        <StyledBadge
                            // invisible={filterCount <= 0}
                            // badgeContent={filterCount}
                            invisible={auditFilterCount <= 0}
                            badgeContent={auditFilterCount}
                        >
                            <button
                                className={styles.apply_Filter}
                                onClick={handleApplyFilter}
                                style={{ fontSize: "14px", borderRadius: "5px", }}

                            >
                                Apply Filter
                            </button>
                        </StyledBadge>


                    </Stack>

                    <Stack py={1} px={1}>
                        <Stack className={styles.clear_Filter}>
                            {auditFilterCount > 0 && (
                                <LightTooltip
                                    title="Clear Filter"
                                    disableInteractive
                                    placement="top"
                                    TransitionComponent={Zoom}
                                >
                                    <button
                                        onClick={handleClearFilter}
                                        style={{ fontSize: "14px", borderRadius: "5px", }}>
                                        <ClearIcon />
                                    </button>
                                </LightTooltip>
                            )}
                        </Stack>


                    </Stack>
                </Stack>
                <Stack sx={{
                    fontFamily: `Outfit,sanserif`,
                    fontSize: '13px',
                    color: '#647491'
                }}>
                    Clear, then Apply Again.
                </Stack>
            </Stack>



        </>
    )
}

export default AuditFilters
