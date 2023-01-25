import { Box, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useEffect } from 'react';
import { getTicketHandler } from '../../api/ticket/ticketHandler';
import useTicketStore from '../../store/ticketStore';
import TicketCard from '../../screen/ticket/widgets/TicketCard';
import { iTicket } from '../../types/store/ticket';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import DefaultScreen from '../../components/DefaultScreen';

const Ticket = () => {
  const { tickets } = useTicketStore();

  const navigate = useNavigate();

  const currentRoute = useMatch('/ticket');

  console.log(currentRoute);

  const redirectTicket = () => {
    navigate('/ticket');
  };
  window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      await getTicketHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
    })();
  }, []);
  return (
    <Box height={'100vh'} display="flex" position="relative" width="100%">
      <Box width="25%" position="sticky" top={0}>
        <Box p={1} height={'10vh'} borderBottom={0.5} borderColor="#f0f0f0">
          <TextField
            size="small"
            fullWidth
            placeholder="Search Leads"
            id="outlined-start-adornment"
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box
          p={1}
          height={'90vh'}
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              display: 'none'
            }
          }}
        >
          {tickets.map((item: iTicket) => {
            return <TicketCard patientData={item} />;
          })}
        </Box>
      </Box>
      <Box bgcolor="#E2ECFB" width="75%">
        {currentRoute ? <DefaultScreen /> : <Outlet />}
      </Box>
    </Box>
  );
};

export default Ticket;