/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Add,
  AddCircle,
  ArrowBack,
  FilePresentOutlined,
  PictureAsPdf,
  RemoveRedEye,
  SendOutlined,
  SkipNext
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  IconButton,
  Radio,
  Modal,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  TextareaAutosize,
  withStyles
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createEstimateHandler,
  uploadAndSendEstimateHandler
} from '../../../api/estimate/estimateHandler';
import {
  searchService,
  searchServiceAll,
  searchServicePck
} from '../../../api/service/service';
import {
  getAllServiceFromDbHandler,
  getAllServicesHandler,
  getServicePackedHandler
} from '../../../api/service/serviceHandler';
import { getWardsHandler } from '../../../api/ward/wardHandler';
import useServiceStore from '../../../store/serviceStore';
import useTicketStore from '../../../store/ticketStore';
import {
  iDoctor,
  iService,
  iServiceAll,
  iServicePackage,
  IWard,
  serviceAdded
} from '../../../types/store/service';
import { iEstimate } from '../../../types/store/ticket';
import {
  getTicketFilterHandler,
  getTicketHandler,
  getTicketHandlerSearch
} from '../../../api/ticket/ticketHandler';
import {
  NAVIGATE_TO_SWITCHVIEW_TICKET,
  NAVIGATE_TO_TICKET,
  UNDEFINED
} from '../../../constantUtils/constant';
import {
  updateTicketSubStage,
  validateTicket
} from '../../../api/ticket/ticket';
import axios from 'axios';
import { apiClient } from '../../../api/apiClient';
import { toast } from 'react-toastify';
import CloseModalIcon from '../../../assets/Group 48095853.svg';
import UploadEstimate from './UploadEstimate';
import useUserStore from '../../../store/userStore';
import {
  hasChanges,
  initialFiltersNew,
  oldInitialFilters
} from '../../../constants/commomFunctions';

type Props = { setTicketUpdateFlag: any };

const drawerWidth = 1100;

const Estimate = (props: Props) => {
  const { tickets, isSwitchView } = useTicketStore();

  const { ticketID } = useParams();
  const ticket = tickets.find((element) => element._id === ticketID);
  const { user } = useUserStore();
  useEffect(() => {
    (async function () {
      await getWardsHandler();
    })();
  }, []);

  const [estimateFileds, setEstimateFields] = useState<iEstimate>({
    type: 1,
    isEmergency: false,
    wardDays: 0,
    icuDays: 0,
    ward: '',
    paymentType: 0,
    insuranceCompany: null,
    insurancePolicyNumber: 0,
    insurancePolicyAmount: 0,
    service: [],
    // investigation: [],
    // procedure: [],
    mrd: 0,
    pharmacy: 0,
    pathology: 0,
    equipmentAmount: 0,
    diet: 0,
    admission: 0,
    prescription: ticket?.prescription[0]._id!,
    ticket: ticketID!
  });

  type AlertType = {
    services: string;
    procedure: string;
    investigation: string;
  };

  const [serviceObject, setServiceObject] = useState<serviceAdded>({
    id: '',
    isSameSite: false
  });
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);
  const [isUploadEstimateOpen, setIsUploadEstimateOpen] = useState(false);
  const [procedure, setProcedure] = useState<string>();
  const [investigation, setInvestigation] = useState('');
  const [clickedIndex, setClickedIndex] = useState<number | undefined>();
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [services, setServices] = useState<iService[]>();
  const [servicesAll, setServicesAll] = useState<iServiceAll[]>();

  const [servicesPack, setServicesPack] = useState<iServicePackage[]>();

  const [searchServiceValue, setSearchServiceValue] = useState('');
  const { wards, doctors, allServices } = useServiceStore();
  const {
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    searchByName,
    pageNumber,
    filteredLocation
  } = useTicketStore();
  const [ticketUpdateFlag, setTicketUpdateFlag] = useState({});

  const [textFieldValue, setTextFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // D STARTS HERE__________________________

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  const [alert, setAlert] = useState<AlertType>({
    investigation: '',
    procedure: '',
    services: ''
  });

  const wardICUSetter = (id: string) => {
    return wards.find((ward: IWard) => ward._id === id)?.name;
  };

  const doctorSetter = (id: string) => {
    return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleServiceType = (e: number) => {
    setClickedIndex(e);
    setEstimateFields({ ...estimateFileds, type: e });
  };

  // const addInvestigation = () => {
  //   if (investigation) {
  //     setAlert({ ...alert, investigation: '' });
  //     setEstimateFields({
  //       ...estimateFileds,
  //       investigation: [...estimateFileds.investigation, investigation]
  //     });
  //     setInvestigation('');
  //   } else {
  //     setAlert({
  //       ...alert,
  //       investigation: 'Please Select a Valid Investigation'
  //     });
  //   }
  // };

  // const addProcedure = () => {
  //   if (procedure) {
  //     setAlert({ ...alert, procedure: '' });
  //     setEstimateFields({
  //       ...estimateFileds,
  //       procedure: [...estimateFileds.procedure, procedure]
  //     });
  //     setProcedure('');
  //   } else {
  //     setAlert({
  //       ...alert,
  //       procedure: 'Please Select a Valid Procedure'
  //     });
  //   }
  // };

  const addServiceToArray = () => {
    if (serviceObject.id) {
      setAlert({
        ...alert,
        services: ''
      });
      setEstimateFields({
        ...estimateFileds,
        service: [...estimateFileds.service, serviceObject]
      });
      setServiceObject({
        id: '',
        isSameSite: false
      });
    } else {
      setAlert({
        ...alert,
        services: 'Please Select a Valid Services'
      });
    }
  };

  const deleteService = (index: number) => {
    estimateFileds.service.splice(index, 1);

    setEstimateFields({ ...estimateFileds, service: estimateFileds.service });
  };

  // const deleteProcedure = (index: number) => {
  //   estimateFileds.procedure.splice(index, 1);
  //   setEstimateFields({
  //     ...estimateFileds,
  //     procedure: estimateFileds.procedure
  //   });
  // };

  // const deleteInvestigation = (index: number) => {
  //   estimateFileds.investigation.splice(index, 1);
  //   setEstimateFields({
  //     ...estimateFileds,
  //     investigation: estimateFileds.investigation
  //   });
  // };

  useEffect(() => {
    (async function () {
      const services = await searchService(
        searchServiceValue,
        '63bbae206cf5f7cd69ef6ddc'
      );
      setServices(services);
    })();
  }, [searchServiceValue]);

  useEffect(() => {
    (async function () {
      const servicesAll = await searchServiceAll();
      setServicesAll(servicesAll);
    })();
    (async function () {
      const servicesPack = await searchServicePck();
      setServicesPack(servicesPack);
    })();
  }, []);
  // console.log(servicesAll," this is all services from db")
  // console.log(servicesPack," this is all packed services from db");

  const serviceGetter = (id: string | undefined) => {
    return (
      services && services.find((service: iService) => service._id === id)?.name
    );
  };

  const serviceGetterAll = (id: string | undefined) => {
    return (
      servicesAll &&
      servicesAll.find((service: iServiceAll) => service._id === id)?.name
    );
  };

  const serviceGetterAllPackage = (id: string | undefined) => {
    // console.log(id,'tjo ssdsdsd')
    return (
      servicesPack &&
      servicesPack.find((service: iServicePackage) => service._id === id)?.name
    );
  };

  const handleCreateEstimate = async () => {
    //  console.log(estimateFileds, ' this is results before ');
    const result = await createEstimateHandler({
      ...estimateFileds,
      ticket: ticketID
    });

    // console.log(estimateFileds," this is results");

    setIsEstimateOpen(false);
    setTimeout(() => {
      (async () => {
        // await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
        try {
           if (
             hasChanges(newFilter, initialFiltersNew) &&
             !filteredLocation &&
             (searchByName === '' || searchByName === UNDEFINED)
           ) {
             await getTicketHandler(
               searchByName,
               pageNumber,
               'false',
               oldInitialFilters
             );
           } else if (
             hasChanges(newFilter, initialFiltersNew) &&
             !filteredLocation &&
             (searchByName !== '' || searchByName !== UNDEFINED)
           ) {
             await getTicketHandlerSearch(
               searchByName,
               pageNumber,
               'false',
               newFilter
             );
           } else {
             await getTicketFilterHandler(
               searchByName,
               pageNumber,
               'false',
               newFilter
             );
           }
        } catch (error) {
          console.log(error);
          // setDownloadDisable(false);
        }
        props.setTicketUpdateFlag(result);
      })();
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (textFieldValue.trim() === '') {
      setErrorMessage('This field is required');
    } else {
      try {
        const { data } = await apiClient.post(
          '/ticket/skipEstimate',
          { ticketID },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const payload = {
          subStageCode: {
            active: true,
            code: 2
          },
          ticket: ticketID
        };

        const result = await updateTicketSubStage(payload);
        setTimeout(() => {
          (async () => {
            // await getTicketHandler(
            //   searchByName,
            //   pageNumber,
            //   'false',
            //   newFilter
            // );
            try {
               if (
                 hasChanges(newFilter, initialFiltersNew) &&
                 !filteredLocation &&
                 (searchByName === '' || searchByName === UNDEFINED)
               ) {
                 await getTicketHandler(
                   searchByName,
                   pageNumber,
                   'false',
                   oldInitialFilters
                 );
               } else if (
                 hasChanges(newFilter, initialFiltersNew) &&
                 !filteredLocation &&
                 (searchByName !== '' || searchByName !== UNDEFINED)
               ) {
                 await getTicketHandlerSearch(
                   searchByName,
                   pageNumber,
                   'false',
                   newFilter
                 );
               } else {
                 await getTicketFilterHandler(
                   searchByName,
                   pageNumber,
                   'false',
                   newFilter
                 );
               }
            } catch (error) {
              console.log(error);
              // setDownloadDisable(false);
            }
            setTicketUpdateFlag(result);
          })();
        }, 1000);

        handleClose();
        setTextFieldValue('');

        setLoading(false);
      } catch (error) {
        console.error('Error sending data to server:', error);
      }
    }
  };

  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
    setErrorMessage('');

    if (event.target.value.length > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 40,
    p: 4,
    width: '50%',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTextFieldValue('');
  };

  const handleOnClose = async () => {
    if (ticketID) {
      await validateTicket(ticketID);
      if (!isSwitchView) {
        navigate(
          `${
            localStorage.getItem('ticketType') === 'Admission'
              ? '/admission/'
              : localStorage.getItem('ticketType') === 'Diagnostics'
              ? '/diagnostics/'
              : localStorage.getItem('ticketType') === 'Follow-Up'
              ? '/follow-up'
              : '/ticket/'
          }`
        );
      } else {
        navigate(NAVIGATE_TO_SWITCHVIEW_TICKET);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
    toast.success('File selected successfully!'); // Clicking the file input when the button is clicked
  };

  const handleEstimateDrawer = () => {
    setIsEstimateOpen(false);
  };

  const menuItemStyles = {
    color: 'var(--Text-Black, #080F1A)',
    fontFamily: `"Outfit", sans-serif`,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%'
  };

  return (
    <>
      <>
        {/* <MenuItem sx={menuItemStyles} onClick={() => setIsEstimateOpen(true)} > <Stack >Create Estimation</Stack></MenuItem> */}
        {localStorage.getItem('ticketType') !== 'Diagnostics' && (
          <UploadEstimate />
        )}
        {localStorage.getItem('ticketType') !== 'Diagnostics' &&
          user?.role !== 'ADMIN' && (
            <MenuItem sx={menuItemStyles} onClick={handleOpen}>
              {' '}
              Skip Estimate
            </MenuItem>
          )}
        <MenuItem
          sx={{
            color: ' #F94839',
            fontFamily: `"Outfit", sans-serif`,
            fontSize: '14px'
          }}
          onClick={handleOnClose}
        >
          Close Lead
        </MenuItem>
      </>

      {/* <div>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => setIsEstimateOpen(true)}
          variant="contained"
          endIcon={<Add />}
        >
          Create Estimate
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={handleOpen}
          variant="contained"
          endIcon={<SkipNext />}
        >
          Skip Estimate
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          variant="contained"
          onClick={handleOnClose}
          endIcon={<CloseIcon />}
        >
          Close
        </Button>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => {
              // Check if files exist before accessing the first file
              if (event.target.files && event.target.files.length > 0) {
                console.log('Selected file:', event.target.files[0]);
                console.log(event.target.files[0]," this is selected File")
                // You can handle the file upload logic here
              }
            }}
          />
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={handleButtonClick}
           
          >
            Upload Estimate
          </Button>
        </div>
      </div> */}
      {/* Modal of Skip Estimation */}

      <Modal open={open} onClose={() => {}} aria-labelledby="modal-modal-title">
        <Box className="reminder-modal-container">
          <Stack
            className="reminder-modal-title"
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack
              className="reminder-modal-title"
              sx={{ fontSize: '18px !important' }}
            >
              Reason for skipping estimation
            </Stack>
            <Stack className="modal-close" onClick={handleClose}>
              <img src={CloseModalIcon} />
            </Stack>
          </Stack>
          <div>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextareaAutosize
                  required
                  className="textarea-autosize"
                  id="outlined-required"
                  aria-label="minimum height"
                  placeholder="Add Comment"
                  minRows={7}
                  maxRows={7}
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                />
              </Stack>
              {errorMessage && (
                <Typography color="alert">{errorMessage}</Typography>
              )}
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}
              >
                <button className="reminder-cancel-btn" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  className="reminder-btn"
                  type="submit"
                  disabled={disableButton}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: disableButton ? '#F6F7F9' : '#0566FF',
                    color: disableButton ? '#647491' : '#FFF'
                  }}
                >
                  Skip Estimation
                </button>
              </Box>
            </form>
          </div>
        </Box>
      </Modal>

      {/* -------------------- */}

      {/* Drawer Of Create Estimation */}
      <Drawer
        PaperProps={{ sx: { zIndex: 1000 } }}
        sx={{
          display: { xs: 'none', sm: 'block' },

          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderTopLeftRadius: '15px',
            borderBottomLeftRadius: '15px'
          }
        }}
        anchor="right"
        open={isEstimateOpen}
        onClose={handleEstimateDrawer}
        aria-labelledby="modal-modal-title"
      >
        <Box className="Create_estimate_Modal_Head">
          <Stack
            className="reminder-modal-title"
            sx={{ fontSize: '18px !important' }}
          >
            Create Estimation
          </Stack>

          {/* Preview Button */}

          {/* <button
            className='reminder-btn'
            onClick={handlePreview}
          >
            {!isPreview ?
              (<>
                <span style={{ marginRight: "5px" }}>Preview Estimate</span> <RemoveRedEye />
              </>
              )
              : (<>
                <span style={{ marginRight: "5px" }}>Back To Editor</span><ArrowBack />
              </>)
            }
          </button> */}

          {/* ------ End ------ */}
        </Box>
        <Stack direction="row" height={'100vh'} overflow="hidden">
          {/* <Box width="30%" position="static" sx={{ offsetDistance: '10vh' }}>
            <img
              src={ticket?.prescription[0].image}
              style={{ maxHeight: '95vh' }}
              alt="prescription"
            />
          </Box> */}

          <Box className="create-estimation-prescription">
            <Stack className="prescription-image">
              <img
                src={ticket?.prescription[0].image}
                alt="prescription"
                style={{
                  borderRadius: '10px'
                }}
              />
            </Stack>
          </Box>

          <Box
            className="create-estimation-detail"
            display={!isPreview ? 'block' : 'none'}
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                width: 0
              },
              paddingBottom: '50px'
            }}
          >
            <Box my={2} bgcolor="white" borderRadius={3} p={3}>
              <Stack className="Create-Estimate-title">
                Select Service Type
              </Stack>

              {/* <Typography fontWeight={500} my={1}>
                Select Service Type
              </Typography> */}

              <Stack direction="row" spacing={2}>
                {[
                  { name: 'Package', value: 0 },
                  { name: 'Non Package', value: 1 }
                ].map((item: any, index: number) => {
                  return (
                    <Chip
                      key={index}
                      label={item.name}
                      color="primary"
                      onClick={() => handleServiceType(item.value)}
                      style={{
                        backgroundColor:
                          clickedIndex === item.value ? '#0566FF' : '#F6F7F9',
                        color:
                          clickedIndex === item.value ? '#FFFFFF' : '#000000',
                        fontFamily: `"Outfit",sans-serif`,
                        borderColor: 'none',
                        fontSize: '14px'
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Box my={2} bgcolor="white" borderRadius={3} p={2}>
              <Stack className="Create-Estimate-title">Ward Details</Stack>

              <Stack display="flex" spacing={1}>
                <Box>
                  <FormControl fullWidth size="medium">
                    <InputLabel
                      id="demo-simple-select-label"
                      style={{
                        fontFamily: `"Outfit",san-serif`,
                        color: 'var(--Text- Light - Grey, #647491)',
                        fontSize: '14px'
                      }}
                    >
                      Ward
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Ward"
                      value={estimateFileds.ward}
                      onChange={(e) => {
                        setEstimateFields({
                          ...estimateFileds,
                          ward: e.target.value
                        });
                      }}
                    >
                      {wards
                        .filter((ward: IWard) => ward.type === 0)
                        .map((item: IWard, index: number) => {
                          return (
                            <MenuItem
                              value={item._id}
                              sx={{
                                fontSize: '14px',
                                color: '#080F1A',
                                fontFamily: `"Outfit",sans-serif`
                              }}
                            >
                              {item.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Box>

                {estimateFileds.type === 1 && (
                  <Box display="flex" justifyContent="space-between">
                    <Stack width="49%">
                      <TextField
                        fullWidth
                        label="Ward Days"
                        required
                        size="medium"
                        onChange={(e) => {
                          setEstimateFields({
                            ...estimateFileds,
                            wardDays: +e.target.value
                          });
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: `"Outfit",san-serif`,
                            color: 'var(--Text- Light - Grey, #647491)',
                            fontSize: '14px'
                          }
                        }}
                        InputProps={{
                          style: {
                            fontFamily: `"Outfit",san-serif`,
                            color: 'var(--Text- Light - Grey, #647491)',
                            fontSize: '14px'
                          }
                        }}
                        placeholder="5"
                        sx={{ borderRadius: 40 }}
                      />
                    </Stack>
                    <Stack width="49%">
                      <TextField
                        fullWidth
                        onChange={(e) => {
                          setEstimateFields({
                            ...estimateFileds,
                            icuDays: +e.target.value
                          });
                        }}
                        label="ICU Days"
                        required
                        size="medium"
                        placeholder="5"
                        InputLabelProps={{
                          style: {
                            fontFamily: `"Outfit",san-serif`,
                            color: 'var(--Text- Light - Grey, #647491)',
                            fontSize: '14px'
                          }
                        }}
                        InputProps={{
                          style: {
                            fontFamily: `"Outfit",san-serif`,
                            color: 'var(--Text- Light - Grey, #647491)',
                            fontSize: '14px'
                          }
                        }}
                        sx={{ borderRadius: 40 }}
                      />
                    </Stack>
                  </Box>
                )}
              </Stack>

              <Stack direction="row" spacing={2} my={1}>
                <FormControl required>
                  <FormLabel
                    id="demo-row-radio-buttons-group-label"
                    sx={{
                      color: '#000',
                      fontSize: '14px',
                      fontFamily: `"Outfit", sans-serif`,
                      marginTop: '12px'
                    }}
                  >
                    <span style={{ color: '#000' }}>
                      Is it a Emergency Admission?
                    </span>
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => {
                      setEstimateFields({
                        ...estimateFileds,
                        isEmergency: e.target.value === 'true' ? true : false
                      });
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#0566ff'
                            }
                          }}
                        />
                      }
                      label="Yes"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#0566ff'
                            }
                          }}
                        />
                      }
                      label="No"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Box>

            {/* <Box my={2} bgcolor="white" borderRadius={3} p={2}>
           
              <Stack className='Create-Estimate-title'>
                Emergency Details
              </Stack>             
            </Box> */}

            <Box my={1} bgcolor="white" borderRadius={3} p={2}>
              <Stack
                className="Create-Estimate-title"
                display="flex"
                flexDirection="row"
              >
                Payment Mode
                <span
                  style={{ textTransform: 'capitalize', marginLeft: '4px' }}
                >
                  {' '}
                  (optional)
                </span>
              </Stack>
              <Stack direction="row" spacing={2} my={1}>
                <FormControl required>
                  <FormLabel
                    id="payment-type"
                    sx={{
                      color: '#000',
                      fontSize: '14px',
                      fontFamily: `"Outfit", sans-serif`,
                      marginTop: '8px'
                    }}
                  >
                    Select a preferred payment mode
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="payment-type"
                    name="payment-type"
                    onChange={(e) => {
                      setEstimateFields({
                        ...estimateFileds,
                        paymentType: +e.target.value
                      });
                    }}
                  >
                    <FormControlLabel
                      value="0"
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#0566ff'
                            }
                          }}
                        />
                      }
                      label="Cash"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="1"
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#0566ff'
                            }
                          }}
                        />
                      }
                      label="Insurance"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }
                      }}
                    />
                    <FormControlLabel
                      value="2"
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#0566ff'
                            }
                          }}
                        />
                      }
                      label="CGHS/ECHS"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              {estimateFileds.paymentType === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Stack sx={{ marginBottom: '10px' }}>
                    <TextField
                      label="Insurance Company Name"
                      size="medium"
                      placeholder="eg: Birla Sun Life Insurance"
                      sx={{ borderRadius: 40 }}
                      onChange={(e) => {
                        setEstimateFields({
                          ...estimateFileds,
                          insuranceCompany: e.target.value
                        });
                      }}
                      InputLabelProps={{
                        style: {
                          fontFamily: `"Outfit",sans-serif`,
                          fontSize: '14px'
                        }
                      }}
                    />
                  </Stack>
                  <Stack
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Stack width="49%">
                      <TextField
                        label="Policy Number"
                        size="medium"
                        placeholder="eg: XXX-XXXXX-XXXX"
                        sx={{ borderRadius: 40 }}
                        onChange={(e) => {
                          setEstimateFields({
                            ...estimateFileds,
                            insurancePolicyNumber: Number(e.target.value)
                          });
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: `"Outfit",sans-serif`,
                            fontSize: '14px'
                          }
                        }}
                      />
                    </Stack>
                    <Stack width="49%">
                      <TextField
                        label="Policy Amount"
                        size="medium"
                        placeholder="eg: 500000"
                        sx={{ borderRadius: 40 }}
                        onChange={(e) => {
                          setEstimateFields({
                            ...estimateFileds,
                            insurancePolicyAmount: +e.target.value
                          });
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: `"Outfit",sans-serif`,
                            fontSize: '14px'
                          }
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Box>
            {estimateFileds.type === 1 ? (
              <Box my={1} bgcolor="white" borderRadius={3} p={2}>
                {/* <Typography fontWeight={500} my={1}>
                  Services Details
                </Typography> */}
                <Stack className="Create-Estimate-title">
                  Services Details
                </Stack>
                <Stack display="flex" direction="column" spacing={2}>
                  <Stack>
                    <Autocomplete
                      aria-required={true}
                      options={servicesAll ? servicesAll : []}
                      id="combo-box-demo"
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      noOptionsText="No Service Available With This Name"
                      getOptionLabel={(option: iServiceAll) => option.name}
                      onChange={(event, value) =>
                        setServiceObject({ ...serviceObject, id: value?._id! })
                      }
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            textTransform: 'capitalize',
                            fontSize: '14px',
                            color: '#080F1A',
                            fontFamily: `"Outfit",sans-serif`
                          }}
                        >
                          {option.name}
                        </li>
                      )}
                      sx={{ width: 400, textTransform: 'capitalize' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ textTransform: 'capitalize' }}
                          label="Select Surgery"
                          onChange={(e) => {
                            setSearchServiceValue((prev) => e.target.value);
                          }}
                          InputLabelProps={{
                            style: {
                              fontFamily: `"Outfit",san-serif`,
                              color: 'var(--Text- Light - Grey, #647491)',
                              fontSize: '14px'
                            }
                          }}
                        />
                      )}
                    />
                  </Stack>
                  <Stack display="flex" flexDirection="column">
                    <Stack>
                      <FormControl required>
                        <FormLabel
                          id="payment-type"
                          sx={{
                            color: '#000',
                            fontSize: '14px',
                            fontFamily: `"Outfit", sans-serif`,
                            marginTop: '8px'
                          }}
                        >
                          <span style={{ color: '#000' }}>Is On Same Site</span>
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="is-same-site"
                          name="isSameSite"
                          onChange={(e) => {
                            setServiceObject({
                              ...serviceObject,
                              isSameSite: e.target.value === '0' ? true : false
                            });
                          }}
                        >
                          <FormControlLabel
                            value="0"
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#0566ff'
                                  }
                                }}
                              />
                            }
                            label="Yes"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontFamily: '"Outfit", sans-serif',
                                fontSize: '14px',
                                color: '#000'
                              }
                            }}
                          />
                          <FormControlLabel
                            value="1"
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#0566ff'
                                  }
                                }}
                              />
                            }
                            label="No"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontFamily: '"Outfit", sans-serif',
                                fontSize: '14px',
                                color: '#000'
                              }
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>

                    <Stack width="20%">
                      <button
                        className="Add-Service-btn"
                        onClick={addServiceToArray}
                      >
                        Add Service
                      </button>
                    </Stack>
                  </Stack>
                </Stack>
                {estimateFileds.service.length > 0 && (
                  <Stack
                    my={1}
                    display="grid "
                    gridTemplateColumns="repeat(3,1fr)"
                    gap={1}
                  >
                    {estimateFileds.service.map((item, index: number) => (
                      <Chip
                        color="primary"
                        label={`${serviceGetterAll(item.id)}/ ${
                          item.isSameSite ? 'Same Site' : 'Different Site'
                        }`}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                        onDelete={() => deleteService(index)}
                      />
                    ))}
                  </Stack>
                )}
                {alert?.services.length > 0 && (
                  <Stack my={1} width="50%">
                    <Alert variant="outlined" severity="warning">
                      {alert?.services}
                    </Alert>
                  </Stack>
                )}
              </Box>
            ) : (
              <Box my={1} bgcolor="white" borderRadius={3} p={2}>
                {/* <Typography fontWeight={500} my={1}>
                  Services Details
                  </Typography> */}
                <Stack className="Create-Estimate-title">
                  Services Details
                </Stack>
                <Stack display="flex" direction="column" spacing={3}>
                  <Stack>
                    <Autocomplete
                      aria-required={true}
                      options={servicesPack ? servicesPack : []}
                      id="combo-box-demo"
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      noOptionsText="No Service Available With This Name"
                      getOptionLabel={(option: iServicePackage) => option.name}
                      onChange={(event, value) =>
                        setServiceObject({ ...serviceObject, id: value?._id! })
                      }
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            textTransform: 'capitalize',
                            fontSize: '14px',
                            color: '#080F1A',
                            fontFamily: `"Outfit",sans-serif`
                          }}
                        >
                          {option.name}
                        </li>
                      )}
                      sx={{ width: 400, textTransform: 'capitalize' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ textTransform: 'capitalize' }}
                          label="Select Surgery"
                          onChange={(e) => {
                            setSearchServiceValue((prev) => e.target.value);
                          }}
                          InputLabelProps={{
                            style: {
                              fontFamily: `"Outfit",sans-serif`,
                              fontSize: '14px'
                            }
                          }}
                        />
                      )}
                    />
                    <Stack display="flex" flexDirection="column" py={2}>
                      <Stack>
                        <FormControl required>
                          <FormLabel
                            id="payment-type"
                            sx={{
                              color: '#000',
                              fontSize: '14px',
                              fontFamily: `"Outfit", sans-serif`,
                              marginTop: '8px'
                            }}
                          >
                            <span style={{ color: '#000' }}>
                              {' '}
                              Is On Same Site
                            </span>
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="is-same-site"
                            name="isSameSite"
                            onChange={(e) => {
                              setServiceObject({
                                ...serviceObject,
                                isSameSite:
                                  e.target.value === '0' ? true : false
                              });
                            }}
                          >
                            <FormControlLabel
                              value="0"
                              control={
                                <Radio
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#0566ff'
                                    }
                                  }}
                                />
                              }
                              label="Yes"
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: '14px',
                                  color: '#000'
                                }
                              }}
                            />
                            <FormControlLabel
                              value="1"
                              control={
                                <Radio
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#0566ff'
                                    }
                                  }}
                                />
                              }
                              label="No"
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: '14px',
                                  color: '#000'
                                }
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                        {/* <Button endIcon={<AddCircle />} onClick={addServiceToArray}>
                    Add Service
                  </Button> */}
                      </Stack>
                      <Stack width="20%">
                        <button
                          className="Add-Service-btn"
                          onClick={addServiceToArray}
                        >
                          Add Service
                        </button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                {estimateFileds.service.length > 0 && (
                  <Stack
                    my={1}
                    display="grid "
                    gridTemplateColumns="repeat(3,1fr)"
                    gap={1}
                  >
                    {estimateFileds.service.map((item, index: number) => (
                      <Chip
                        color="primary"
                        label={`${serviceGetterAllPackage(item.id)}/ ${
                          item.isSameSite ? 'Same Site' : 'Different Site'
                        }`}
                        variant="outlined"
                        sx={{
                          textTransform: 'capitalize',
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }}
                        onDelete={() => deleteService(index)}
                      />
                    ))}
                  </Stack>
                )}
                {alert?.services.length > 0 && (
                  <Stack my={1} width="50%">
                    <Alert variant="outlined" severity="warning">
                      <span
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '14px',
                          color: '#000'
                        }}
                      >
                        {alert?.services}
                      </span>
                    </Alert>
                  </Stack>
                )}
              </Box>
            )}

            {/* <Box my={1} bgcolor="white" borderRadius={3} p={1}>
              <Typography fontWeight={500} my={1}>
                Mrd Charges
              </Typography> */}
            {/* <Stack direction="row" spacing={2}> */}
            {/* <Autocomplete
                  aria-required={true}
                  options={services ? services : []}
                  onChange={(event, value) => setInvestigation(value?._id!)}
                  id="combo-box-demo"
                  getOptionLabel={(option: iService) => option.name}
                  sx={{ width: 400, textTransform: 'capitalize' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ textTransform: 'capitalize' }}
                      label="Select Investigation"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.name}</li>
                  )}
                /> */}
            {/* <Button endIcon={<AddCircle />} onClick={addInvestigation}>
                  Add Investigation
                </Button> */}
            {/* </Stack>
              {alert?.investigation.length > 0 && (
                <Stack my={1} width="50%">
                  <Alert variant="outlined" severity="warning">
                    {alert?.investigation}
                  </Alert>
                </Stack>
              )}
              {estimateFileds.investigation?.length > 0 && (
                <Stack
                  my={1}
                  display="grid "
                  gridTemplateColumns="repeat(3,1fr)"
                  gap={1}
                >
                  {estimateFileds.investigation.map((item, index: number) => (
                    <Chip
                      color="primary"
                      label={`${serviceGetter(item)}`}
                      variant="outlined"
                      onDelete={() => deleteInvestigation(index)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Stack>
              )} */}
            {/* <Stack my={1} direction="row" spacing={2}>
                <TextField
                  label="Mrd Charges"
                  size="small"
                  placeholder="eg:5000"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      mrd: +e.target.value
                    });
                  }}
                />
              </Stack> */}
            {/* </Box> */}
            {/* <Box my={1} bgcolor="white" borderRadius={3} p={1}>
              <Typography fontWeight={500} my={1}>
                Procedure(optional)
              </Typography>
              <Stack direction="row" spacing={2}>
                <Autocomplete
                  aria-required={true}
                  options={services ? services : []}
                  onChange={(event, value) => setProcedure(value?._id!)}
                  id="combo-box-demo"
                  getOptionLabel={(option: iService) => option.name}
                  sx={{ width: 400, textTransform: 'capitalize' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ textTransform: 'capitalize' }}
                      label="Select Procedure"
                    />
                  )}
                />
                <Button onClick={addProcedure} endIcon={<AddCircle />}>
                  Add Procedure
                </Button>
              </Stack>
              {estimateFileds.procedure.length > 0 && (
                <Stack
                  my={1}
                  display="grid "
                  gridTemplateColumns="repeat(3,1fr)"
                  gap={1}
                >
                  {estimateFileds.procedure.map((item, index: number) => (
                    <Chip
                      color="primary"
                      label={`${serviceGetter(item)}`}
                      variant="outlined"
                      onDelete={() => deleteProcedure(index)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Stack>
              )}
              {alert.procedure.length > 0 && (
                <Stack my={1} width="50%">
                  <Alert variant="outlined" severity="warning">
                    {alert.procedure}
                  </Alert>
                </Stack>
              )}

              <Stack my={1} direction="row" spacing={2}>
                <TextField
                  label="Procedure Charges"
                  size="small"
                  placeholder="eg:5000"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      procedureAmount: +e.target.value
                    });
                  }}
                />
              </Stack>
            </Box> */}
            <Box my={1} bgcolor="white" borderRadius={3} p={2}>
              <Stack
                className="Create-Estimate-title"
                display="flex"
                flexDirection="row"
              >
                Other Charges{' '}
                <span
                  style={{ textTransform: 'capitalize', marginLeft: '4px' }}
                >
                  {' '}
                  (optional)
                </span>
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Mrd Amount"
                  size="medium"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      mrd: +e.target.value
                    });
                  }}
                  placeholder="eg: 500000"
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Pharmacy Amount"
                  size="medium"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      pharmacy: +e.target.value
                    });
                  }}
                  placeholder="eg: 500000"
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Pathology Amount"
                  size="medium"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      pathology: +e.target.value
                    });
                  }}
                  placeholder="eg: 500000"
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Equipment Amount"
                  size="medium"
                  placeholder="eg: 500000"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      equipmentAmount: +e.target.value
                    });
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
              </Stack>
              <Stack my={1} direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Blood Amount"
                  size="medium"
                  placeholder="eg: 500000"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      diet: +e.target.value
                    });
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Miscellenous Charges"
                  size="medium"
                  placeholder="eg: 500000"
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      admission: +e.target.value
                    });
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                  inputProps={{
                    style: {
                      fontFamily: `"Outfit",sans-serif`,
                      fontSize: '14px'
                    }
                  }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Preview Component  */}

          <Box
            bgcolor="#f1f5f7"
            width="70%"
            p={1}
            height="90vh"
            sx={{ overflowY: 'scroll' }}
            display={isPreview ? 'block' : 'none'}
          >
            <Stack my={1} bgcolor="white" p={1} borderRadius={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  <PictureAsPdf />
                  Preview Estimate
                </Typography>
                <Button onClick={handlePreview}>
                  {!isPreview ? 'Preview Estimate' : 'Edit Estimate'}
                </Button>

                <Button
                  onClick={handleCreateEstimate}
                  endIcon={<SendOutlined />}
                >
                  Send Estimate
                </Button>
              </Box>

              <Stack
                direction="row"
                spacing={4}
                my={1}
                p={1}
                borderRadius={2}
                bgcolor="#f1f1f1"
              >
                <Box>
                  <Typography
                    textTransform="capitalize"
                    variant="body1"
                    fontWeight={500}
                  >
                    {ticket?.consumer[0].firstName +
                      ' ' +
                      ticket?.consumer[0].lastName}
                  </Typography>
                  <Typography>#{ticket?.consumer[0].uid}</Typography>
                  <Typography textTransform="capitalize">
                    Dr. {doctorSetter(ticket?.prescription[0].doctor!)}
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    <FilePresentOutlined />
                    {ticket?.prescription[0].symptoms}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Stack my={1} bgcolor="white" p={1} borderRadius={2}>
              <Stack
                direction="row"
                spacing={4}
                my={1}
                p={1}
                borderRadius={2}
                bgcolor="#f1f1f1"
              >
                <Box>
                  <Typography variant="caption" fontWeight={500}>
                    Package Type{' '}
                    <Chip
                      size="small"
                      variant="outlined"
                      color="primary"
                      label={
                        estimateFileds.type === 0 ? 'Packaged' : 'Non Pacakage'
                      }
                    />
                  </Typography>
                  {estimateFileds.type === 1 && (
                    <Stack my={1}>
                      <Typography variant="caption" fontWeight={500}>
                        Ward Details
                      </Typography>
                      <Typography variant="caption">
                        ICU Type: {wardICUSetter(estimateFileds.ward)}
                      </Typography>
                      <Typography variant="caption">
                        ICU Days: {estimateFileds.icuDays}
                      </Typography>
                      <Typography variant="caption">
                        Ward Days: {estimateFileds.icuDays}
                      </Typography>
                    </Stack>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={500}>
                    Payment Type :{' '}
                    {estimateFileds.paymentType === 0
                      ? 'Cash'
                      : estimateFileds.paymentType === 1
                      ? 'Insurance'
                      : 'CGHS | ECHS'}
                  </Typography>

                  {estimateFileds.paymentType === 1 && (
                    <Stack my={1}>
                      <Typography variant="caption" fontWeight={500}>
                        Insurance Details
                      </Typography>
                      <Typography variant="caption">
                        Insurance Comapny: {estimateFileds.insuranceCompany}
                      </Typography>
                      <Typography variant="caption">
                        Policy Number: {estimateFileds.insurancePolicyNumber}
                      </Typography>
                      <Typography variant="caption">
                        Policy Amount: {estimateFileds.insurancePolicyAmount}
                      </Typography>
                    </Stack>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={500}>
                    Emergency Details{' '}
                    <Chip
                      color="primary"
                      size="small"
                      variant="outlined"
                      label={
                        estimateFileds.isEmergency === true
                          ? 'Emergency Case'
                          : 'Not Emergency'
                      }
                    />
                  </Typography>
                </Box>
              </Stack>
              {estimateFileds.type === 1 ? (
                <Stack my={1} p={1} borderRadius={2} bgcolor="#f1f1f1">
                  <Typography variant="body2" fontWeight={500}>
                    Services Details
                  </Typography>
                  <Box my={1}>
                    {estimateFileds.service.length > 0 ? (
                      estimateFileds.service.map((item, index: number) => (
                        <Chip
                          size="small"
                          color="primary"
                          label={`${serviceGetterAll(item.id)}/ ${
                            item.isSameSite ? 'Same Site' : 'Different Site'
                          }`}
                          variant="outlined"
                          sx={{ textTransform: 'capitalize', mx: 1 }}
                        />
                      ))
                    ) : (
                      <Alert severity="warning" sx={{ width: '50%' }}>
                        {' '}
                        Required Field Please Select a Service
                      </Alert>
                    )}
                  </Box>
                  {/* <Typography variant="body2" fontWeight={500}>
                  Investigation Details
                </Typography>
                <Box my={1}>
                  {estimateFileds.investigation.length > 0 ? (
                    estimateFileds.investigation.map((item, index: number) => (
                      <Chip
                        size="small"
                        color="primary"
                        label={`${serviceGetter(item)}`}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', mx: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption">
                      No Investigation Selected
                    </Typography>
                  )}
                  <Stack my-={1}>
                    <Typography fontWeight={500} variant="caption">
                      Investigation Amount :{' '}
                      {estimateFileds.investigationAmount}
                    </Typography>
                  </Stack>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  Procedure Details
                </Typography>
                <Box my={1}>
                  {estimateFileds.procedure.length > 0 ? (
                    estimateFileds.procedure.map((item, index: number) => (
                      <Chip
                        size="small"
                        color="primary"
                        label={`${serviceGetter(item)}`}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', mx: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption">
                      No Procedure Selected
                    </Typography>
                  )}
                  <Stack my-={1}>
                    <Typography fontWeight={500} variant="caption">
                      Procedure Amount : {estimateFileds.procedureAmount}
                    </Typography>
                  </Stack>
                </Box> */}
                </Stack>
              ) : (
                <Stack my={1} p={1} borderRadius={2} bgcolor="#f1f1f1">
                  <Typography variant="body2" fontWeight={500}>
                    Services Details
                  </Typography>
                  <Box my={1}>
                    {estimateFileds.service.length > 0 ? (
                      estimateFileds.service.map((item, index: number) => (
                        <Chip
                          size="small"
                          color="primary"
                          label={`${serviceGetterAllPackage(item.id)}/ ${
                            item.isSameSite ? 'Same Site' : 'Different Site'
                          }`}
                          variant="outlined"
                          sx={{ textTransform: 'capitalize', mx: 1 }}
                        />
                      ))
                    ) : (
                      <Alert severity="warning" sx={{ width: '50%' }}>
                        {' '}
                        Required Field Please Select a Service
                      </Alert>
                    )}
                  </Box>
                  {/* <Typography variant="body2" fontWeight={500}>
                  Investigation Details
                </Typography>
                <Box my={1}>
                  {estimateFileds.investigation.length > 0 ? (
                    estimateFileds.investigation.map((item, index: number) => (
                      <Chip
                        size="small"
                        color="primary"
                        label={`${serviceGetter(item)}`}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', mx: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption">
                      No Investigation Selected
                    </Typography>
                  )}
                  <Stack my-={1}>
                    <Typography fontWeight={500} variant="caption">
                      Investigation Amount :{' '}
                      {estimateFileds.investigationAmount}
                    </Typography>
                  </Stack>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  Procedure Details
                </Typography>
                <Box my={1}>
                  {estimateFileds.procedure.length > 0 ? (
                    estimateFileds.procedure.map((item, index: number) => (
                      <Chip
                        size="small"
                        color="primary"
                        label={`${serviceGetter(item)}`}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', mx: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption">
                      No Procedure Selected
                    </Typography>
                  )}
                  <Stack my-={1}>
                    <Typography fontWeight={500} variant="caption">
                      Procedure Amount : {estimateFileds.procedureAmount}
                    </Typography>
                  </Stack>
                </Box> */}
                </Stack>
              )}
              <Stack
                my={1}
                p={1}
                borderRadius={2}
                bgcolor="#f1f1f1"
                sx={{
                  marginBottom: '100px'
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Other Charges
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Typography variant="caption" fontWeight={500}>
                    Mrd Amount : {estimateFileds.mrd}
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    Pharmacy Amount : {estimateFileds.pharmacy}
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    Pathology Amount : {estimateFileds.pathology}
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    Equipment Amount : {estimateFileds.equipmentAmount}
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    Diet Amount : {estimateFileds.diet}
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    Admission Amount : {estimateFileds.admission}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Box className="Create-Estimate-Button">
          <button
            className="reminder-cancel-btn"
            onClick={handleEstimateDrawer}
          >
            Cancel
          </button>
          <button
            className="reminder-btn"
            onClick={handleCreateEstimate}
            style={{ margin: '0px 10px 0px 10px' }}
          >
            Send Estimate
          </button>
        </Box>
      </Drawer>
      {/* ------------------------------- */}
    </>
  );
};

export default Estimate;
