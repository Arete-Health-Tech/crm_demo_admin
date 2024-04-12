import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Chip, Stack, Tab, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useServiceStore from '../../../store/serviceStore';
import { iTicket } from '../../../types/store/ticket';

type Props = {
  currentTicket: iTicket;
};

const PrescriptionTabsWidget = ({ currentTicket }: Props) => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} bgcolor="white">
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Admission Details" value="1" />
            <Tab label="Diagnostics" value="2" />
            <Tab label="Pharmacy" value="3" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0, height: '100%' }} value="1">
          <Stack p={1} direction="column" spacing={2}>
            {currentTicket.prescription[0].service ? (
              <Typography textTransform="uppercase" variant="body1">
                {currentTicket.prescription[0].service.name}
              </Typography>
            ) : (
              <Typography> No Service Advised</Typography>
            )}
            {currentTicket.prescription[0].admission && (
              <Chip
                label={currentTicket.prescription[0].admission}
                variant="filled"
                color="primary"
                sx={{ width: '40%', textTransform: 'uppercase' }}
              />
            )}
          </Stack>
        </TabPanel>
        <TabPanel sx={{ p: 0, height: '100%' }} value="2">
          <Stack p={1} direction="column" spacing={2}>
            {currentTicket.prescription[0].diagnostics.length > 0 ? (
              currentTicket.prescription[0].diagnostics.map(
                (diagostic: string) => (
                  <Typography textTransform="uppercase" variant="body1">
                    {diagostic}
                  </Typography>
                )
              )
            ) : (
              <Typography>No Diagnostics Available </Typography>
            )}
            {currentTicket.prescription[0].diagnostics.length > 0 && (
              <Chip
                label="Latest Advised"
                variant="filled"
                color="primary"
                size="small"
                sx={{ width: '30%' }}
              />
            )}
          </Stack>
        </TabPanel>
        <TabPanel sx={{ p: 0, height: '100%' }} value="3">
          <Stack p={1} direction="column" spacing={2}>
            {currentTicket.prescription[0].isPharmacy ? (
              <Chip
                label={currentTicket.prescription[0].isPharmacy}
                variant="filled"
                color="primary"
                sx={{ width: '40%', textTransform: 'uppercase' }}
              />
            ) : (
              ""
            )}
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default PrescriptionTabsWidget;
