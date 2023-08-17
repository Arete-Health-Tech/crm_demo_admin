import {
  Add,
  Call,
  CoronavirusOutlined,
  Female,
  InfoOutlined,
  Male,
  MedicalServicesOutlined,
  PendingActionsOutlined,
  ReceiptLongOutlined,
  Transgender
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Fab,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  TextField
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTicketStore from '../../store/ticketStore';
import { iTicket } from '../../types/store/ticket';
import StageCard from './widgets/StageCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ageSetter } from '../../utils/ageReturn';
import Estimate from './widgets/Estimate';
import useServiceStore from '../../store/serviceStore';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import Rx from '../../assets/Rx.svg';
import Bulb from '../../assets/Vector.svg';
import NotesWidget from './widgets/NotesWidget';
import { iDepartment, iDoctor, iScript } from '../../types/store/service';
import QueryResolutionWidget from './widgets/QueryResolutionWidget';
import { getSingleScript } from '../../api/script/script';
import PrescriptionTabsWidget from './widgets/PrescriptionTabsWidget';
import AddNewTaskWidget from './widgets/AddNewTaskWidget';
import {
  getAllReminderHandler,
  getTicketHandler
} from '../../api/ticket/ticketHandler';
import MessagingWidget from './widgets/whatsapp/WhatsappWidget';
import ShowPrescription from './widgets/ShowPrescriptionModal';
import { updateTicketSubStage } from '../../api/ticket/ticket';
import { UNDEFINED } from '../../constantUtils/constant';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FormControlLabel from '@mui/material/FormControlLabel';

dayjs.extend(relativeTime);

type Props = {};

const SingleTicketDetails = (props: Props) => {
  const { ticketID } = useParams();
  const { tickets, filterTickets } = useTicketStore();
  const { doctors, departments, stages } = useServiceStore();
  const [currentTicket, setCurrentTicket] = useState<iTicket>();
  const [value, setValue] = useState('1');
  const [script, setScript] = useState<iScript>();
  const [isScript, setIsScript] = useState(false);
  const [ticketUpdateFlag, setTicketUpdateFlag] = useState({});
  const [open, setOpen] = useState(false);

  // remove hanlePhoneCall in FE. post changes of phone call in backend is pending...

  const handlePhoneCall = async (e: React.SyntheticEvent) => {
     setOpen(true);
    const currentSubStageCode = currentTicket?.subStageCode?.code;
    const stageDetail: any = stages?.find(
      ({ _id }) => currentTicket?.stage === _id
    );
    const noOfChilds = stageDetail?.child?.length || 3;
    if (
      currentSubStageCode &&
      (!currentTicket?.prescription[0].admission || currentSubStageCode > noOfChilds - 3) &&
      currentSubStageCode < noOfChilds
    ) {
      const payload = {
        subStageCode: {
          active: true,
          code: 3
        },
        ticket: currentTicket?._id
      };

      const result = await updateTicketSubStage(payload);
      setTimeout(() => {
        (async function () {
          await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
          setTicketUpdateFlag(result);
        })();
      }, 1000);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  
  const [selectedResponses, setSelectedResponses] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 40,
    p: 4,
    width: '50%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = [
    {
      question: '	Has the patient received a Bill Estimate?',
      responses: ['Yes', 'No']
    },
    {
      question: '	Has the patient received a WhatsApp Message?',
      responses: ['Yes', 'No']
    },
    {
      question: '	Did the patient explore the ‘Menu’ from our Whatsapp Message?',
      responses: ['Yes', 'No']
    },
    {
      question:
        '	Is the patient able to perform Activities of Daily Living (ADL)?',
      responses: [
        'Walk without Support',
        'Eat without Support',
        'Need help for ADL'
      ]
    },
    {
      question: '	Does the Patient have any Surgical Fear?',
      responses: ['Yes', 'No']
    },
    {
      question:
        '	On the Basis  of ADL and SFQ, Indicate the  ‘Level Of Distress’',
      responses: ['Mild', 'Moderate', 'Severe']
    },
    {
      question: 'Payment Mode',
      responses: ['Cash', 'CGHS/ECHS', 'Corporate', 'NSG', 'TPA']
    },
    {
      question: '	Is Paras Hospital‘s, patients',
      responses: ['1st Opinion', '2nd Opinion']
    },
    {
      question: 'Does the patient have any Caregiver at',
      responses: ['Yes', 'No']
    },
    {
      question: 'Did you Inform the Next Follow-up date to Patient',
      responses: ['Yes', 'No']
    }

    // Add more questions as needed
  ];

  const handleResponseClick = (response) => {
    setSelectedResponses((prevSelectedResponses) => ({
      ...prevSelectedResponses,
      [currentQuestionIndex]: response
    }));
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const getTicketInfo = (ticketID: string | undefined) => {
    const fetchTicket = tickets.find((element) => ticketID === element._id);
    setCurrentTicket(fetchTicket);
  };

  useEffect(() => {
    (async function () {
      getTicketInfo(ticketID);
      await getAllReminderHandler();
      if (currentTicket) {
        const script = await getSingleScript(
          currentTicket?.prescription[0]?.service?._id,
          currentTicket?.stage
        );
        setScript(script);
      }
    })();
  }, [ticketID, tickets, currentTicket, ticketUpdateFlag]);

  const { reminders } = useTicketStore();

  const doctorSetter = (id: string) => {
    return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((department: iDepartment) => department._id === id)
      ?.name;
  };
  // console.log(currentTicket,"yhis is current ticket")
  // console.log(currentTicket?.prescription[0].image,"this is iamge")
  // console.log(currentTicket?.estimate[0],"this is estimate")

  return (
    <Stack height={'100vh'} direction="row">
      <Box width="60%">
        <Box
          height="10vh"
          p={1}
          borderBottom={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          bgcolor="white"
          alignItems="center"
        >
          <Box width="60%">
            <Suspense fallback="Loading...">
              <Typography
                textTransform="capitalize"
                fontSize={20}
                fontWeight={500}
              >
                {currentTicket?.consumer[0].firstName}{' '}
                {currentTicket?.consumer[0].lastName}
              </Typography>
            </Suspense>
            <Box
              display="grid"
              gridTemplateColumns="repeat(5, 1fr)"
              columnGap={2}
            >
              <Box display="grid" gridTemplateColumns="repeat(2,1fr)">
                {currentTicket?.consumer[0].gender === 'M' ? (
                  <Box display="flex" alignItems="center">
                    <Male fontSize="inherit" /> <Typography>Male</Typography>{' '}
                  </Box>
                ) : currentTicket?.consumer[0].gender === 'F' ? (
                  <Box display="flex" alignItems="center">
                    <Female fontSize="inherit" />{' '}
                    <Typography>Female</Typography>{' '}
                  </Box>
                ) : currentTicket?.consumer[0].gender === 'O' ? (
                  <Box>
                    <Transgender />
                    <Typography>Others</Typography>
                  </Box>
                ) : null}
              </Box>
              <Typography fontSize="small">
                {currentTicket?.consumer[0].dob
                  ? ageSetter(currentTicket.consumer[0].dob)
                  : ''}
              </Typography>
              <Typography variant="body1">
                #{currentTicket?.consumer[0].uid}
              </Typography>
            </Box>
          </Box>
          <Box
            width="40%"
            display={'flex '}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <a href={`tel:${currentTicket?.consumer[0].phone}`}>
              <div>
                <IconButton
                  sx={{ bgcolor: 'green', color: 'white' }}
                  onClick={handlePhoneCall}
                >
                  <Call />
                </IconButton>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                    // overflow: 'auto', // Add the overflow attribute here
                  }}
                >
                  <div>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        width: '50%',
                        height: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto'
                      }}
                    >
                      <Stack spacing={3}>
                        <Typography variant="h6" align="center" gutterBottom>
                          Checklist Form
                        </Typography>

                        <Box
                          sx={{
                            width: '100%',
                            height: '20%',
                            borderRadius: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          {/* Current Question */}
                          <Typography
                            variant="h5"
                            style={{ textAlign: 'center' }}
                          >
                            {questions[currentQuestionIndex].question}
                          </Typography>
                        </Box>
                        <div>
                          {/* Responses */}

                          {currentQuestionIndex === 3
                            ? questions[currentQuestionIndex].responses.map(
                                (response, index) => (
                                  <Box sx={{ justifyContent: 'center' }}>
                                    <FormControlLabel
                                      key={index}
                                      control={
                                        <Checkbox
                                          checked={
                                            selectedResponses[
                                              currentQuestionIndex
                                            ] &&
                                            selectedResponses[
                                              currentQuestionIndex
                                            ].includes(response)
                                          }
                                          onChange={() =>
                                            handleResponseClick(response)
                                          }
                                          sx={{
                                            color: 'primary.main',
                                            '&.Mui-checked': {
                                              color: 'primary.main'
                                            }
                                          }}
                                        />
                                      }
                                      label={response}
                                    />
                                  </Box>
                                )
                              )
                            : currentQuestionIndex === 5 ||
                              currentQuestionIndex === 6 ||
                              currentQuestionIndex === 7
                            ? questions[currentQuestionIndex].responses.map(
                                (response, index) => (
                                  <Box sx={{ justifyContent: 'center' }}>
                                    <FormControlLabel
                                      key={index}
                                      control={
                                        <Checkbox
                                          checked={
                                            selectedResponses[
                                              currentQuestionIndex
                                            ] === response
                                          }
                                          onChange={() =>
                                            handleResponseClick(response)
                                          }
                                          sx={{
                                            color: 'primary.main',
                                            '&.Mui-checked': {
                                              color: 'primary.main'
                                            }
                                          }}
                                        />
                                      }
                                      label={response}
                                    />
                                  </Box>
                                )
                              )
                            : questions[currentQuestionIndex].responses.map(
                                (response, index) => (
                                  <Box sx={{ justifyContent: 'center' }}>
                                    <Button
                                      key={index}
                                      variant="contained"
                                      fullWidth
                                      onClick={() =>
                                        handleResponseClick(response)
                                      }
                                      sx={{ mt: 1, mb: 1, bgcolor: 'EBEDF5' }}
                                    >
                                      {response}
                                    </Button>
                                  </Box>
                                )
                              )}

                          {currentQuestionIndex === 2 &&
                            selectedResponses[currentQuestionIndex] ===
                              'No' && (
                              <div>
                                <h2>Reason:</h2>
                                <textarea
                                  rows={4}
                                  cols={60}
                                  value={
                                    selectedResponses[
                                      currentQuestionIndex + '_reason'
                                    ] || ''
                                  }
                                  onChange={(e) =>
                                    setSelectedResponses(
                                      (prevSelectedResponses) => ({
                                        ...prevSelectedResponses,
                                        [currentQuestionIndex + '_reason']:
                                          e.target.value
                                      })
                                    )
                                  }
                                />
                                <Button variant="contained">Submit</Button>
                              </div>
                            )}
                        </div>

                        {currentQuestionIndex == 8 &&
                          selectedResponses[currentQuestionIndex] === 'Yes' && (
                            <div>
                              <form>
                                <TextField
                                  label="Name"
                                  fullWidth
                                  // margin="normal"
                                  variant="outlined"
                                />
                                <TextField
                                  label="Phone Number"
                                  fullWidth
                                  // margin="normal"
                                  variant="outlined"
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  //onClick={handleFormSubmit}
                                  sx={{ mt: 2 }}
                                >
                                  Submit
                                </Button>
                              </form>
                            </div>
                          )}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: '2px',
                            width: '90%'
                          }}
                        >
                          <MobileStepper
                            variant="progress"
                            steps={10}
                            position="static"
                            activeStep={activeStep}
                            sx={{ maxWidth: '100%', flexGrow: 0 }}
                            nextButton={
                              <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === 9}
                              >
                                Next
                                {theme.direction === 'rtl' ? (
                                  <KeyboardArrowLeft />
                                ) : (
                                  <KeyboardArrowRight />
                                )}
                              </Button>
                            }
                            backButton={
                              <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                              >
                                {theme.direction === 'rtl' ? (
                                  <KeyboardArrowRight />
                                ) : (
                                  <KeyboardArrowLeft />
                                )}
                                Back
                              </Button>
                            }
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </div>
                </Modal>
              </div>
            </a>
            <Chip
              sx={{ textTransform: 'capitalize' }}
              label={dayjs(currentTicket?.createdAt).fromNow()}
            />
          </Box>
        </Box>
        <Stack bgcolor="#F1F5F7" height="90vh" direction="column">
          <Box p={1} height="30%">
            <Box bgcolor={'white'} p={1.5} borderRadius={2}>
              <StageCard
                currentTicket={currentTicket}
                setTicketUpdateFlag={setTicketUpdateFlag}
              />
            </Box>
          </Box>
          <Box
            p={1}
            height="100%"
            style={{ marginBottom: '20px' }}
            position="relative"
            bgcolor="#F1F5F7"
          >
            <TabContext value={value}>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                bgcolor="white"
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Whatsapp Message" value="1" />
                  <Tab label="Notes" value="2" />
                  <Tab label="Query Resolution" value="3" />
                </TabList>
              </Box>
              <TabPanel sx={{ p: 0, height: '100%' }} value="1">
                <MessagingWidget />
              </TabPanel>
              <TabPanel sx={{ p: 0, height: '100%' }} value="2">
                <NotesWidget setTicketUpdateFlag={setTicketUpdateFlag} />
              </TabPanel>
              <TabPanel sx={{ p: 0, height: '100%' }} value="3">
                <QueryResolutionWidget />
              </TabPanel>
            </TabContext>
          </Box>
        </Stack>
      </Box>
      <Box width="40%" height="100vh" position="relative">
        <Box
          height="10vh"
          p={1}
          bgcolor="white"
          borderBottom={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          alignItems="center"
        >
          <Estimate setTicketUpdateFlag={setTicketUpdateFlag} />
        </Box>

        {isScript ? (
          <Box bgcolor="white" height="90vh">
            <Stack p={1}>
              <Typography variant="h6" fontWeight={500}>
                Script Name
              </Typography>

              <Box
                sx={{
                  overflowY: 'scroll',
                  '&::-webkit-scrollbar ': {
                    display: 'none'
                  },
                  height: '100%'
                }}
              >
                <Typography>
                  {script ? script.text : 'Script Not Available'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box
            height="83vh"
            sx={{
              overflowX: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              p={1}
              sx={{
                overflowX: 'scroll',
                '&::-webkit-scrollbar ': {
                  display: 'none'
                }
              }}
            >
              <Chip label="Tasks" variant="outlined" color="info" />
              <Chip label="Appointments" variant="outlined" color="info" />
              <Chip label="Documents" variant="outlined" color="info" />
              <Chip label="Estimates" variant="outlined" color="info" />
              <Chip label="Prescriptsions" variant="outlined" color="info" />
            </Stack>

            <Stack borderRadius={2} m={1} bgcolor="white">
              <Box p={1} borderBottom={1} borderColor="#f5f5f5">
                <Typography
                  textTransform="uppercase"
                  variant="subtitle1"
                  fontWeight={500}
                >
                  Lead Details
                </Typography>
              </Box>
              <Box p={1}>
                <Stack direction="row" spacing={3} my={1}>
                  <MedicalServicesOutlined htmlColor="gray" />
                  <Typography textTransform={'capitalize'}>
                    {doctorSetter(currentTicket?.prescription[0].doctor!)}(
                    {departmentSetter(
                      currentTicket?.prescription[0].departments[0]!
                    )}
                    )
                  </Typography>
                </Stack>

                {currentTicket?.prescription[0].followUp && (
                  <Stack direction="row" spacing={3} my={1} alignItems="center">
                    <PendingActionsOutlined htmlColor="gray" />
                    <Typography>
                      {dayjs(currentTicket?.prescription[0].followUp).format(
                        'DD/MMM/YYYY '
                      )}
                      <Chip
                        color="primary"
                        label="Follow Up"
                        size="small"
                        sx={{ fontSize: '0.6rem' }}
                      />
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={3} my={1}>
                  <img src={Rx} alt="prescriptionIcon" />
                  <ShowPrescription
                    image={currentTicket?.prescription[0].image}
                  />
                </Stack>
              </Box>
            </Stack>
            <Stack borderRadius={2} m={1} bgcolor="white">
              <Box
                p={1}
                borderBottom={1}
                borderColor="#f5f5f5"
                display="flex"
                justifyContent="space-between"
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  textTransform="uppercase"
                >
                  Value and Payment Mode
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    disabled={currentTicket?.estimate[0] ? false : true}
                    startIcon={<ReceiptLongOutlined />}
                    color="primary"
                  >
                    View Estimate
                  </Button>
                </Stack>
              </Box>
              {currentTicket?.estimate[0] ? (
                <Box p={1}>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      color="error"
                      label={`₹${currentTicket?.estimate[0]?.total}`}
                      variant="outlined"
                      size="medium"
                      sx={{
                        fontSize: '1rem'
                      }}
                    />
                    {currentTicket?.estimate[0]?.paymentType ? (
                      <Chip
                        color={
                          currentTicket?.estimate[0].paymentType === 0 ||
                          currentTicket?.estimate[0].paymentType === 1 ||
                          currentTicket?.estimate[0].paymentType === 2
                            ? 'info'
                            : 'default'
                        }
                        label={
                          currentTicket?.estimate[0]?.paymentType === 0
                            ? 'Cash'
                            : currentTicket?.estimate[0]?.paymentType === 1
                            ? 'Insurance'
                            : currentTicket?.estimate[0]?.paymentType === 2
                            ? 'CGHS| ECHS'
                            : 'Payment Type Not Available'
                        }
                        variant="filled"
                        size="medium"
                        sx={{
                          fontSize: '1rem'
                        }}
                      />
                    ) : (
                      <Typography color="GrayText"></Typography>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Box p={1}>No Estimate Available</Box>
              )}
            </Stack>
            <Stack borderRadius={2} m={1} bgcolor="white">
              {currentTicket ? (
                <PrescriptionTabsWidget currentTicket={currentTicket} />
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Stack>
            <Box
              sx={{
                overflowX: 'scroll',
                '&::-webkit-scrollbar ': {
                  display: 'none'
                }
              }}
              m={1}
              borderRadius={2}
              bgcolor="white"
            >
              <Box p={1} borderBottom={1} borderColor="#f5f5f5">
                <Stack direction="row" spacing={3} my={1}>
                  <img src={Bulb} alt="prescriptionIcon" />
                  <Typography
                    textTransform="uppercase"
                    variant="subtitle1"
                    fontWeight={500}
                  >
                    Reminders For You
                  </Typography>
                </Stack>
              </Box>
              <Box>
                {reminders.length > 0 ? (
                  reminders.map((reminder, index) => {
                    return (
                      dayjs(reminder.date).diff(new Date(), 'days') > 0 && (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={2}
                          bgcolor={index % 2 === 0 ? '#f5f5f7' : 'white'}
                        >
                          <Box>
                            <Typography>{reminder.title}</Typography>
                            <Chip
                              size="small"
                              variant="outlined"
                              color="primary"
                              label={dayjs(reminder.date).format(
                                'DD/MMM/YYYY hh:mm A '
                              )}
                            />
                          </Box>
                          <Box>
                            <Tooltip title={reminder.description}>
                              <InfoOutlined />
                            </Tooltip>
                          </Box>
                        </Box>
                      )
                    );
                  })
                ) : (
                  <Typography p={1}>No Reminders Available</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Lead View  */}

        <Box
          height="7vh"
          p={1}
          width="100%"
          position="absolute"
          bottom={0}
          bgcolor="white"
          borderTop={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          justifyContent="space-between"
        >
          <Button onClick={() => setIsScript((prev) => !prev)}>
            {!isScript ? 'View Agent Script' : 'Close Script '}
          </Button>
          <AddNewTaskWidget />
        </Box>
      </Box>
    </Stack>
  );
};

export default SingleTicketDetails;
