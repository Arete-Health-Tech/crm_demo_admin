import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
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
import { UNDEFINED } from '../../../constantUtils/constant';
import useTicketStore from '../../../store/ticketStore';


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
 const [textValue, setTextValue] = useState('');
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
  const [nextStage, setNextStage] = useState<string>('');
  const { filterTickets, searchByName } = useTicketStore();
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
  console.log(changeStageName);

  useEffect(() => {
    if (currentTicket && stages.length > 0 && subStages.length > 0) {
      const stageDetail: any = stages?.find(
        ({ _id }) => currentTicket.stage === _id
      );
      setValidStageList(stages?.slice(stageDetail?.code - 1));
      setValidSubStageList(
        stageDetail?.child?.map((id) => subStages[id - 1]) || []
      );
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
    updateTicketData(payload);
    // window.location.reload();
    setTimeout(() => {
      (async function () {
        const result = await getTicketHandler(
          searchByName,
          1,
          'false',
          filterTickets
        );
        setTicketUpdateFlag(result);
      })();
    }, 800);
  };


  const handleOpen = () => {
    console.log('Open Modal');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Text Value:', textValue);
    console.log('File:', file);
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
         marginTop:"-60px",
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
            <Typography id="modal-modal-title" variant="h5" component="h1">
              Verify Payment
            </Typography>
            <TextField
              label="Payment Reference ID"
              value={textValue}
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
              value={textValue}
              onChange={handleTextChange}
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
marginTop:"-60px",
            width: '60px',
            height: '40px',
             
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
        activeStep={
          currentStage?.child?.length > 3
            ? currentTicket?.subStageCode?.code
            : currentTicket?.subStageCode?.code - 1 || 0
        }
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
