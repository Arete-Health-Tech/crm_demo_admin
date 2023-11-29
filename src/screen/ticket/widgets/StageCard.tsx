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
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iStage, iSubStage } from '../../../types/store/service';
import { iTicket } from '../../../types/store/ticket';
import { updateTicketData } from '../../../api/ticket/ticket';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../../constantUtils/constant';
import useTicketStore from '../../../store/ticketStore';
import { apiClient } from '../../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

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
  const { stages, subStages } = useServiceStore();

  const [open, setOpen] = useState(false);
  const [paymentIDValue, setPaymentIDValue] = useState('');
  const [noteTextValue, setNoteTextValue] = useState('');
  const [file, setFile] = useState(null);
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

  const redirectTicket = () => {
    navigate(NAVIGATE_TO_TICKET);
  };
  // const getCurrentStage = () => {
  //   const index = stages.findIndex(
  //     (stage) => stage._id === currentTicket?.stage
  //   );
  //   console.log(index);
  //   setCurrentStageIndex(index);
  // };

  // useEffect(()=>{
  //   getCurrentStage();
  // },[])
  // console.log(changeStageName);

  useEffect(() => {
    if (currentTicket && stages.length > 0 && subStages.length > 0) {
      const stageDetail: any = stages?.find(
        ({ _id }) => currentTicket.stage === _id
      );
      setValidStageList(stages?.slice(stageDetail?.code - 1));
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
  }, [currentTicket, stages, subStages, changeStageName]);

  const handleStages = async (e: any) => {
    console.log('selected', e.target.value);

    setChangeStageName(e.target.value);
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
          filterTickets
        );
        setTicketUpdateFlag(result);
      })();
    }, 1000);
    if ((currentTicket?.subStageCode.code || 0) + 1 > 3) {
      redirectTicket();
      console.log('redirect to ticket');
    }
    console.log('redirect to ticket ?', currentTicket?.subStageCode.code + 1);
  };

  const handleOpen = () => {
    console.log('Open Modal');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (event) => {
    setPaymentIDValue(event.target.value);
  };

  const handleNoteTextChange = (event: any) => {
    setNoteTextValue(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
console.log(formdata)
      setPaymentIDValue('');
      setNoteTextValue('');
      setFile(null);
      setLose('');
      console.log('patient status res', data);
    }

    setOpen(false);
  };

  const handleOpenLose = () => {
    setOpenLose(true);
  };

  const handleCloseLose = () => {
    setOpenLose(false);
  };

  const handleChangeLose = (event) => {
    setLose(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {lastModifiedDate > -1 && (
        <Typography fontSize={'13px'} variant="body2" color="black">
          {`Last update ${lastModifiedDate} days ago`}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progressCount}
            sx={{
              height: '10px',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3949AC'
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="black">
            {progressCount}%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '7px',
          marginTop: '20px'
        }}
      >
        <Typography
          marginRight={'12px'}
          variant="body2"
          color="black"
          fontSize={15}
          fontWeight={600}
        >
          Current Stage -:{' '}
        </Typography>

        <FormControl variant="standard">
          <Select
            size="small"
            name="stages"
            onChange={handleStages}
            value={changeStageName || ''}
            sx={{ height: '16px', outline: 'none' }}
          >
            {validStageList?.map(({ name, parent, code }: iStage, index) => {
              return (
                parent === null && (
                  <MenuItem
                    value={name}
                    disabled={![changeStageName, nextStage].includes(name)}
                  >
                    {name}
                  </MenuItem>
                )
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Button
          variant="contained"
          style={{
            backgroundColor: 'green',
            marginRight: '10px',
            marginLeft: '550px',
            marginTop: '-60px',
            width: '60px',
            height: '40px'
          }}
          onClick={handleOpen}
        >
          WON
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700,
              bgcolor: 'background.paper',
              boxShadow: 24,
              height: 400,
              borderRadius: 10,
              p: 4,
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#e8eaf6'
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                bgcolor: '#0047ab',
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h5" component="h1">
              Verify Payment
            </Typography>
            <TextField
              label="Payment Reference ID"
              value={paymentIDValue}
              onChange={handleTextChange}
              fullWidth
              multiline
              margin="normal"
              style={{ backgroundColor: 'whitesmoke' }}
            />
            <Typography id="modal-modal-title">Or</Typography>
            <Typography id="modal-modal-title" component="h2">
              Upload Receipt sent by hospital
            </Typography>
            <TextField
              type="file"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              style={{ backgroundColor: 'whitesmoke' }}
            />{' '}
            <TextField
              label="Write Notes"
              value={noteTextValue}
              onChange={handleNoteTextChange}
              fullWidth
              multiline
              margin="normal"
              style={{ backgroundColor: 'whitesmoke' }}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Modal>
        <Button
          variant="contained"
          style={{
            backgroundColor: 'red',
            marginTop: '-60px',
            width: '60px',
            height: '40px'
          }}
          onClick={handleOpenLose}
        >
          LOST
        </Button>{' '}
        <Modal
          open={openLose}
          onClose={handleCloseLose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700,
              bgcolor: 'background.paper',
              boxShadow: 24,
              height: 250,
              borderRadius: 10,
              p: 4,
              backgroundColor: '#e8eaf6'
            }}
          >
            <IconButton
              onClick={handleCloseLose}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                bgcolor: '#0047ab',
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h5" component="h1">
              Reason for closing lead
            </Typography>
            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {' '}
                Reason for closing lead
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={lose}
                label="Reason for closing lead"
                onChange={handleChangeLose}
                style={{ backgroundColor: 'whitesmoke' }}
              >
                <MenuItem value={10}>Financial Problem</MenuItem>
                <MenuItem value={20}>Problem number 2</MenuItem>
                <MenuItem value={30}>Problem number 3</MenuItem>
                <MenuItem value={40}>Problem number 4</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />

            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
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
            <StepLabel>{label.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StageCard;
