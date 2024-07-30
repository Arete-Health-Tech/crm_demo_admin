import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  IconButton,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Stack,
  Tooltip,
  Zoom,
  makeStyles,
  TooltipProps,
  styled,
  tooltipClasses,
  StepIcon
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import useServiceStore from '../../../store/serviceStore';
import { iStage, iSubStage } from '../../../types/store/service';
import { iTicket } from '../../../types/store/ticket';
import { updateTicketData } from '../../../api/ticket/ticket';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../../constantUtils/constant';
import useTicketStore from '../../../store/ticketStore';
import { apiClient } from '../../../api/apiClient';
import { useNavigate, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CloseModalIcon from "../../../assets/Group 48095853.svg";
import UploadFileIcon from "../../../assets/UploadFileIcon.svg";
import ActiveIcon from "../../../assets/CheckedActive.svg"
import NotActiveIcon from "../../../assets/ActiveIcon.svg"
import CheckedActiveIcon from "../../../assets/NotActive.svg"
import RightArrowIcon from "../../../assets/arrow-right.svg"
import documentIcon from "../../../assets/document-text.svg"
import "../singleTicket.css";
type Props = {
  currentTicket: iTicket | any;
  setTicketUpdateFlag: any;
};

function getTotalDaysFromDate(date: Date) {
  if (!date) return -1;
  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - date.getTime());
  const totalDays = Math.round(timeDiff / (1000 * 3600 * 24));
  return totalDays;
}

const StageCard = (props: Props) => {
  const { ticketID } = useParams();
  const { stages, subStages } = useServiceStore();
  const { isSwitchView, isAuditor } = useTicketStore();

  const [open, setOpen] = useState(false);
  const [paymentIDValue, setPaymentIDValue] = useState('');
  const [noteTextValue, setNoteTextValue] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [lose, setLose] = useState('');
  const [openLose, setOpenLose] = useState(false);

  const [validStageList, setValidStageList] = useState<iStage[] | []>([]);
  const [validSubStageList, setValidSubStageList] = useState<iSubStage[] | []>(
    []
  );
  const { currentTicket, setTicketUpdateFlag } = props;
  const [lastModifiedDate, setLastModifiedDate] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<any>({});
  const [changeStageName, setChangeStageName] = useState<string>('');
  const [progressCount, setProgressCount] = useState<number>(0);
  const [activeState, setActiveState] = useState<number>(0);
  const [nextStage, setNextStage] = useState<string>('');
  const { filterTickets, searchByName, pageNumber } = useTicketStore();
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState('');
  const [disableLostButton, setDisableLostButton] = useState(true);
  const [disableWonButton, setDisableWonButton] = useState(true);


  const [steps, setSteps] = useState([
    {
      id: 1,
      key: "NewLead",
      label: "New Lead",
      isDone: true,
    },
    {
      id: 2,
      key: "Contacted",
      label: "Contacted",
      isDone: false,
    },
    {
      id: 3,
      key: "Working",
      label: "Working",
      isDone: false,
    },
    {
      id: 4,
      key: "Orientation",
      label: "Orientation",
      isDone: false,
    },
    {
      id: 5,
      key: "Nurturing",
      label: "Nurturing",
      isDone: false,
    },
  ]);

  const [activeStep, setActiveStep] = useState(steps[0]);


  const handleHospitalNameChange = (event) => {
    setHospitalName(event.target.value);
  };

  const redirectTicket = () => {
    navigate(NAVIGATE_TO_TICKET);
  };

  // const getCurrentStage = () => {
  //   const index = stages.findIndex(
  //     (stage) => stage._id === currentTicket?.stage
  //   );
  //   setCurrentStageIndex(index);
  // };

  // useEffect(()=>{
  //   getCurrentStage();
  // },[])

  useEffect(() => {
    if (currentTicket && stages.length > 0 && subStages.length > 0) {
      const stageDetail: any = stages?.find(
        ({ _id }) => currentTicket.stage === _id
      );
      setValidStageList(stages);
      // setValidStageList(stages?.slice(stageDetail?.code - 1));
      const childCode: any[] = [];
      stageDetail?.child?.forEach((id) => {
        if (!currentTicket?.prescription[0].admission) {
          if (stageDetail?.code === 1 && id === 2) {
            setActiveState(currentTicket?.subStageCode?.code || 0);
          } else if (stageDetail?.code !== 1 && id === 1) {
          } else {
            if (currentStage?.child?.length > 3) {
              if (currentTicket?.subStageCode?.code < 2) setActiveState(1);
              else if (currentTicket?.subStageCode?.code > 2)
                setActiveState(currentTicket?.subStageCode?.code - 1);
            } else setActiveState(currentTicket?.subStageCode?.code - 2 || 0);
            childCode.push(subStages[id - 1]);
          }
        } else {
          setActiveState(
            currentStage?.child?.length > 3
              ? currentTicket?.subStageCode?.code
              : currentTicket?.subStageCode?.code - 1 || 0
          );
          childCode.push(subStages[id - 1]);
        }
      });
      setValidSubStageList(childCode);

      const stageName = stageDetail?.name || '';
      setChangeStageName(stageName);
      setCurrentStage(stageDetail);

      setProgressCount(stageDetail?.code * 20 || 0);


      if (stageDetail?.code > 0) {
        const index = activeStep ? steps.findIndex((x) => x.key === activeStep.key) : -1;
        if (index !== -1) {
          setSteps((prevSteps) =>
            prevSteps.map((step, i) => ({
              ...step,
              isDone: i < stageDetail?.code,
            }))
          );
        }
      }


      if (activeStep > steps[0] && progressCount > 0) {

        setActiveStep(steps[Math.floor(progressCount / 20) - 1]);
      }

      // .....

      setNextStage('');
      setLastModifiedDate(
        currentTicket?.modifiedDate
          ? getTotalDaysFromDate(new Date(currentTicket?.modifiedDate))
          : -1
      );
      if (currentTicket?.subStageCode?.code > 3 && stageDetail?.code <= 5) {
        const nextStageIndex = stageDetail?.code;
        setNextStage(stages[nextStageIndex]?.name || '');
      }
    }
  }, [currentTicket, stages, subStages, changeStageName, ticketID]);

  const handleStages = async (name: any) => {

    setChangeStageName(name);
    const payload = {
      stageCode: currentStage?.code + 1,
      subStageCode: {
        active: true,
        code: 1
      },
      ticket: currentTicket?._id
    };
    await updateTicketData(payload);
    // window.location.reload();
    setTimeout(() => {
      (async () => {
        const result = await getTicketHandler(
          searchByName,
          pageNumber,
          'false',
          filterTickets,

        );
        setTicketUpdateFlag(result);
      })();
    }, 1000);
    if ((currentTicket?.subStageCode.code || 0) + 1 > 3) {
      redirectTicket();
    }
  };

  const handleStagesNotFound = (name: string) => {
    if (changeStageName !== name) {
      if (changeStageName === "Contacted") {
        if (name !== "New Lead" && name !== "contacted") {
          toast.warning(`Complete all Sub Stage in ${changeStageName} Stage!`);
        }
      } else if (changeStageName === "Working") {
        if (name !== "New Lead" && name !== "Contacted") {
          toast.warning(`Complete all Sub Stage in ${changeStageName} Stage!`);
        }
      } else if (changeStageName === "Orientation") {
        if (name !== "New Lead" && name !== "Contacted" && name !== "Working") {
          toast.warning(`Complete all Sub Stage in ${changeStageName} Stage!`);
        }
      } else if (changeStageName === "Nurturing") {
        if (name !== "New Lead" && name !== "Contacted" && name !== "Working" && name !== "Orientation") {
          toast.warning(`Complete all Sub Stage in ${changeStageName} Stage!`);
        }
      } else {
        if (name !== "New Lead") {
          toast.warning(`Complete all Sub Stage in ${changeStageName} Stage!`);
        }
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPaymentIDValue("");
    setFileName("");
    setDisableWonButton(true);
    setFile(null);
    setOpen(false);
  };

  const handleTextChange = (event) => {

    if (event.target.value.length > 0) {
      setDisableWonButton(false);
    } else {
      setDisableWonButton(true);
    }

    setPaymentIDValue(event.target.value);
  };

  const handleNoteTextChange = (event: any) => {
    setNoteTextValue(event.target.value);
  };


  const handleFileChange = (event) => {

    setFileName(event.target.files[0].name);
    setFile(event.target.files[0]);

    if (event.target.value !== null) {
      setDisableWonButton(false);
    }

  };


  const handleSubmit = async () => {
    // Handle form submission logic here

    let isPayloadEmpty = true;

    const formdata = new FormData();

    formdata.append('ticket', currentTicket._id);
    formdata.append(
      'consumer',
      `${currentTicket?.consumer[0]._id}/${currentTicket?.consumer[0]?.firstName}`
    );
    if (paymentIDValue) {
      formdata.append('paymentRefId', paymentIDValue);
      isPayloadEmpty = false;
    }

    if (file) {
      formdata.append('image', file);
      isPayloadEmpty = false;
    }

    if (noteTextValue) {
      formdata.append('note', noteTextValue);
      isPayloadEmpty = false;
    }

    if (lose) {
      formdata.append('dropReason', lose);
      isPayloadEmpty = false;
    }

    if (!isPayloadEmpty) {
      const { data } = await apiClient.post('/ticket/patientStatus', formdata, {
        /* @ts-ignore */
        headers: {
          'Content-Type': 'multipart/form-data'
        }

      });
      setTimeout(() => {
        (async () => {
          const result = await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets,

          );
          setTicketUpdateFlag(result);
        })();
      }, 1000);
      setPaymentIDValue('');
      setNoteTextValue('');
      setOpenLose(false);
      handleCloseLose();
      setHospitalName('');
      setFile(null);
      setLose('');
      redirectTicket();
    }

    setOpen(false);
  };

  const handleOpenLose = () => {
    setOpenLose(true);
  };

  const handleCloseLose = () => {
    setLose('');
    setDisableLostButton(true);
    setOpenLose(false);
  };

  const handleChangeLose = (event) => {
    if (event.target.value.length > 0) {
      setDisableLostButton(false);
    }

    setLose(event.target.value);
  };

  const handleSubmitLose = () => {
    // Handle your submit logic here
    // Close the modal
    handleCloseLose();
    setHospitalName('');
  };

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#0566FF',
      color: '#ffffff',
      fontSize: 12,
      fontFamily: `"Outfit",sans-serif`,
    },
  }));



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {lastModifiedDate > -1 && (
        <Stack sx={{ color: "#000", fontFamily: `"Outfit",san-serif`, fontSize: "12px" }}>
          {`Last update ${lastModifiedDate} days ago`}
        </Stack>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>

          {/* <LinearProgress
            variant="determinate"
            value={progressCount}
            sx={{
              height: '10px',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3949AC'
              }
            }}
          /> */}

          {/* Updated Divided Progress Bar */}

          <Box className={isSwitchView ? "switchViewSteps" : "steps"}>
            <ul className="nav">
              {/* {steps && steps.map((step, i) => {
                return (
                  <li
                    key={step.id}
                    className={`${activeStep && activeStep.key === step.key ? "active" : ""}  ${step.isDone ? "done" : ""}`}
                  >

                    <LightTooltip title={step.label}
                      disableInteractive
                      placement="top"
                      TransitionComponent={Zoom}
                    >
                      <Box>
                        <br />
                      </Box>
                    </LightTooltip>
                  </li>
                );
              })} */}
              {validStageList.map(({ name, code }: iStage, index) => {
                const isCurrentStage = changeStageName === name;
                const isNextStage = nextStage === name;
                const isPreviousStage = validStageList.findIndex(stage => stage.name === changeStageName) >= index;

                return (
                  <li
                    key={code}
                    className={`${isCurrentStage || isNextStage || isPreviousStage ? "active done" : ""}`}
                    onClick={() => {
                      if (isNextStage) {
                        handleStages(name);
                      } else {
                        handleStagesNotFound(name);
                      }
                    }}
                  >
                    <LightTooltip title={name}
                      disableInteractive
                      placement="top"
                      TransitionComponent={Zoom}
                    >
                      <Box>
                        <br />
                      </Box>
                    </LightTooltip>
                  </li>
                );
              })}
            </ul>
          </Box>

        </Box>

        {/* <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="black">
            {progressCount}%
          </Typography>
        </Box> */}

      </Box>
      <Box
        p={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '7px',
          marginTop: '12px',
          justifyContent: "space-between"
        }}
      >
        <Box display="flex" flexDirection="row">

          <Stack>
            <Box
              component="div"
              display="flex"
              flexDirection="row"
            >
              <span style={{
                fontFamily: `"OutFit",sans-serif`,
                fontSize: "14px",
                marginRight: '6px',
                fontWeight: "400",
                color: "#0566FF"
              }}>
                Current Stage
              </span>
              <span style={{
                marginTop: '2px',
              }}>
                <img src={RightArrowIcon} />
              </span> {' '}
            </Box>
          </Stack>
          {/* <Stack marginRight="5px !important">
            <FormControl variant="standard">
              <Select
                size="small"
                name="stages"
                onChange={handleStages}
                value={changeStageName || ''}
                sx={{
                  height: '25px',
                  outline: 'none',
                  fontFamily: `"OutFit",sans-serif`,
                  fontSize: "14px",
                  marginRight: '12px',
                  fontWeight: "400",
                  color: "#0566FF"
                }}
              >
                {validStageList?.map(({ name, parent, code }: iStage, index) => {
                  return (
                    parent === null && (
                      <MenuItem
                        value={name}
                        disabled={![changeStageName, nextStage].includes(name)}
                        sx={{
                          fontFamily: `"OutFit",sans-serif`,
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "black"
                        }}
                      >
                        {name}
                      </MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>
          </Stack> */}
          <Box>
            {validStageList?.map(({ name, parent, code }: iStage, index) => {
              // if ([changeStageName, nextStage].includes(name)) {
              if (changeStageName.includes(name)) {
                return (
                  <Box
                    color={'#0566FF'}
                    fontSize={'0.875rem'}
                    fontWeight={400}
                    fontFamily={'OutFit,san-serif'}
                    lineHeight={'150%'}
                    paddingLeft={'0.5rem'}
                  >
                    {name}
                  </Box>
                )
              }
              // }
              // return (
              //   parent === null && (
              //     <MenuItem
              //       value={name}
              //       disabled={![changeStageName, nextStage].includes(name)}
              //       sx={{
              //         fontFamily: `"OutFit",sans-serif`,
              //         fontSize: "14px",
              //         fontWeight: "400",
              //         color: "black"
              //       }}
              //     >
              //       {name}
              //     </MenuItem>
              //   )
              // );
            })}
          </Box>


        </Box>

        {!isAuditor && <Box display="flex" flexDirection="row">
          <button
            className='Won-Btn won'
            onClick={handleOpen}
          >
            WON
          </button>
          <button
            className='Won-Btn lost'
            onClick={handleOpenLose}
          >
            LOST
          </button>
        </Box>

        }
      </Box>

      <Box>
        {/* Won Modal */}
        <Modal
          open={open}
          onClose={() => { }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="reminder-modal-container">
            <Stack
              className='reminder-modal-title'
              direction="row"
              spacing={1}
              display="flex"
              alignItems="center"
            >
              <Stack className='reminder-modal-title' sx={{ fontSize: "18px !important" }}>
                Verify Payment
              </Stack>
              <Stack
                className='modal-close'
                onClick={handleClose}
              >
                <img src={CloseModalIcon} />
              </Stack>
            </Stack>

            <TextField
              label="Payment Reference ID"
              value={paymentIDValue}
              onChange={handleTextChange}
              fullWidth
              multiline
              InputLabelProps={{
                style: {
                  fontSize: '14px',
                  color: 'rgba(128, 128, 128, 0.744)',
                  fontFamily: `"Outfit",sans-serif`,
                }
              }}
              InputProps={{
                style: {
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }
              }}
            />

            <Stack className='Or-line'> <p className='Or'>OR</p></Stack>

            <Box className="file-upload">
              <Stack className="file-upload-title">
                <label htmlFor="file-upload" style={{ display: "flex", flexDirection: "row" }}> <img className='img-upload' src={UploadFileIcon} /> Upload Receipt sent by hospital</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />{' '}
              </Stack>
              <Stack className="file-upload-Sub" marginTop="12px">Upload one .txt, .doc, .pdf, .docx, .png, .jpg</Stack>
              <Stack className="file-upload-Sub">Max file size 5mb</Stack>
            </Box>

            {fileName !== "" ? (
              <Box className="Uploaded-file">
                <Stack className='Uploaded-Box'><img src={documentIcon} /></Stack>
                <Box display="flex" flexDirection="column">
                  <Stack className="file-upload-title">{fileName}</Stack>
                  <Stack className="file-upload-Sub">Uploading Completing</Stack>
                </Box>
                <Stack p={1} sx={{ marginLeft: "250px" }}><img src={CheckedActiveIcon} /></Stack>
              </Box>
            ) : (
              <>
              </>
            )}

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%'
              }}
            >
              <button
                className='reminder-cancel-btn'
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='reminder-btn'
                type='submit'
                disabled={disableWonButton}
                style={{
                  marginLeft: "10px",
                  backgroundColor: disableWonButton ? "#F6F7F9" : "#0566FF",
                  color: disableWonButton ? "#647491" : "#FFF",

                }}
              >
                Mark as Won
              </button>
            </Box>

          </Box>
        </Modal>

        {/* Lost  Modal */}

        <Modal
          open={openLose}
          onClose={() => { }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            className="reminder-modal-container"
          >
            <Stack
              className='reminder-modal-title'
              direction="row"
              spacing={1}
              display="flex"
              alignItems="center"
            >
              <Stack className='reminder-modal-title' sx={{ fontSize: "18px !important" }}>
                Reason for closing lead
              </Stack>
              <Stack
                className='modal-close'
                onClick={handleCloseLose}
              >
                <img src={CloseModalIcon} />
              </Stack>
            </Stack>

            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label"
                  sx={{
                    fontSize: '14px',
                    color: 'rgba(128, 128, 128, 0.744)',
                    fontFamily: `"Outfit",sans-serif`,

                  }}>
                  {' '}
                  Reason for closing lead
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={lose}
                  label="Reason for closing lead"
                  onChange={handleChangeLose}
                  MenuProps={{
                    disableAutoFocusItem: true
                  }}
                  sx={{
                    fontSize: '14px',
                    color: '#080F1A',
                    fontFamily: `"Outfit",sans-serif`,
                  }}
                >
                  <MenuItem sx={{
                    fontSize: '14px',
                    color: '#080F1A',
                    fontFamily: `"Outfit",sans-serif`,
                  }}
                    value={"Too expensive / Have a better pricing"}>
                    Too expensive / Have a better pricing
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '14px',
                      color: '#080F1A',
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                    value={"Financial Constraint"}>
                    Financial Constraint
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '14px',
                      color: '#080F1A',
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                    value={"Chose to stay back in home city"}>
                    Chose to stay back in home city
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '14px',
                      color: '#080F1A',
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                    value={"Adopted alternative medicines"}>
                    Adopted alternative medicines
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '14px',
                      color: '#080F1A',
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                    value={"No Further Treatment Advised"}>
                    No Further Treatment Advised
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: '14px',
                      color: '#080F1A',
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                    value={"Chose another hospital - Which Hospital"}>
                    Chose another hospital - Which Hospital ?
                    <TextField
                      id="hospitalName"
                      value={hospitalName}
                      onChange={handleHospitalNameChange}
                      variant="standard"
                      sx={{ marginLeft: 2 }}
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%'
              }}
            >
              <button
                className='reminder-cancel-btn'
                onClick={handleCloseLose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='reminder-btn'
                type='submit'
                disabled={disableLostButton}
                style={{
                  marginLeft: "10px",
                  backgroundColor: disableLostButton ? "#F6F7F9" : "#0566FF",
                  color: disableLostButton ? "#647491" : "#FFF",

                }}
              >
                Mark as Lost
              </button>
            </Box>

            {/* <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button> */}
          </Box>
        </Modal>
      </Box>

      <Stepper
        activeStep={activeState}
        alternativeLabel
        sx={{ height: '50px', marginTop: '10px' }}
      >
        {validSubStageList?.map((label: iSubStage, index) => (
          <Step key={label._id}>
            <StepLabel
              StepIconComponent={({ active, completed }) =>
                completed ? (
                  <img src={CheckedActiveIcon} alt="CheckedActiveIcon" />
                ) : active ? (
                  <img src={ActiveIcon} alt="ActiveIcon" />
                ) : (
                  <img src={NotActiveIcon} alt="NotActiveIcon" />
                )
              }


            > <span className="stepper-label">{label.name}</span></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StageCard;
