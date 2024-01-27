import { Forum, PersonAdd } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../../store/userStore';
import Logout from '../../login/Logout';
import register from '../../../assets/images/addPatient.png';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const inputStyles = {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: '5px',
    outline: 'none',
    padding: '12px'
  };

  return (
    <Box>
      <Box bgcolor="primary.main" p={2} borderRadius=" 0rem  0rem 1rem 1rem">
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Stack>
              <Typography
                color="white"
                variant="caption"
                textTransform="capitalize"
              >
                {new Date().toDateString()}
              </Typography>
              <Typography color="white" variant="h6" textTransform="capitalize">
                {'Hi, ' + user?.firstName + ' ' + user?.lastName}
              </Typography>
            </Stack>
            <Logout />
          </Box>                                                                                                 
        </Stack>
        <Stack
          mb={1}
          justifyContent="centers"
          onClick={() => navigate('/search')}
          style={inputStyles}
        >
          <Typography color="GrayText">Search Patient</Typography>
        </Stack>
      </Box>
      <Box p={1} height="100%">
        <Grid container>
          {[
            {
              name: 'Capture Prescription',
              description:
                "Register patient on the platform after doctor's visit and upload the prescription.",
              icon: <PersonAdd fontSize="medium" />,
              path: '/register'
            }
            // {
            //   name: 'Query Resolution',
            //   description:
            //     'Resolve queries of the patient, platform representatives will be chatting on behalf of patients.',
            //   icon: <Forum fontSize="medium" />,
            //   path: '/query'
            // }
          ].map((item) => {
            return (
              <Grid
                item
                borderRadius={2}
                border={1}
                p={1.4}
                mx={0.3}
                xs={5.8}
                my={2}
                borderColor="lightgrey"
                bgcolor="lightgray"
              >
                <Link to={item.path}>
                  <Stack spacing={1}>
                    <Avatar
                      sx={{
                        width: '56px',
                        height: '56px',
                        bgcolor: 'primary.main'
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="body1" fontWeight={500}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontSize="0.7rem"
                      color="GrayText"
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
