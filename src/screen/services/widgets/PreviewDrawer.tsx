import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack
} from '@mui/material';
import { iService } from '../../../types/store/service';
import { createServiceHandler } from '../../../api/service/serviceHandler';

interface Props {
  serviceArray: iService[];
  setServiceArray: (services: iService[]) => void;
}

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)'
}));

export default function PreviewDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [disableUpload, setDisableUpload] = React.useState(true);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const checkUploadButton = () => {
    if (props.serviceArray.length <= 0) {
      setDisableUpload(true);
    } else {
      setDisableUpload(false);
    }
  };

  const uploadServices = async () => {
    // console.log(props.serviceArray);
    await createServiceHandler(props.serviceArray);
    toggleDrawer(false);
    props.setServiceArray([]);
  };

  React.useEffect(() => {
    checkUploadButton();
  }, []);

  return (
    <Box>
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={toggleDrawer(true)}
        >
          Upload {props.serviceArray.length} Services
        </Button>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Puller />
        <Stack p={4}>
          <Box display="flex" justifyContent="space-between">
            <Typography>
              {props.serviceArray.length <= 0
                ? 'No Services Added'
                : `${props.serviceArray.length} Added`}
            </Typography>
            <Button
              onClick={uploadServices}
              variant="contained"
              disabled={disableUpload}
            >
              {' '}
              Upload Services
            </Button>
          </Box>
          <Box>
            {props.serviceArray.map((item, index) => {
              return (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.serviceId}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Stack>
      </SwipeableDrawer>
    </Box>
  );
}
