import * as React from 'react';
import {
  styled,
} from '@mui/material/styles';
import {
  Tooltip,
  Zoom,
  TooltipProps,
  tooltipClasses,

} from '@mui/material';
import Box from '@mui/material/Box';
import { Button, Stack } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Logo from '../../../assets/Logo.svg'
import QueryImage from '../../../assets/query.svg'
import Logout from '../../login/Logout';


const NavQuery = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToPage = (path) => {
    navigate(path);
  };



  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#0566FF',
      color: '#ffffff',
      fontSize: 12,
      fontFamily: `"Outfit",sans-serif`
    }
  }));

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box
          sx={{
            boxSizing: 'border-box',
            width: '4.4%',
            backgroundColor: '#F6F7F9',
            borderRight: '1px solid #D4DBE5'
          }}
        >
          <Box
            // bgcolor={'#F6F7F9'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
              justifyContent={'center'}
              sx={{ alignItems: 'center' }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  height: '54px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '24px'
                }}
              >
                <img src={Logo} alt="Logo" />
              </Stack>
              <Stack>
                <Stack
                  onClick={() => goToPage('/')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.5vw',
                    height: '7vh',
                    borderRadius: '8px',
                    backgroundColor:
                      location.pathname === '/' ? '#DAE8FF' : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Query"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname === '/' ? (
                      <img src={QueryImage} alt="Query" />
                    ) : (
                      <img src={QueryImage} alt="Query" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack>

            </Box>


            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              sx={{ alignItems: 'center' }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pb: 2
                }}
              >
                <LightTooltip
                  title="Logout"
                  disableInteractive
                  placement="right"
                  TransitionComponent={Zoom}
                >
                  <Logout />
                </LightTooltip>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Box
          component="main"
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default NavQuery;
