import * as React from 'react';
import {
    styled,
    Theme,
    CSSObject,
    createTheme,
    ThemeProvider
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

import Logo from '../../assets/Logo.svg';
import Logout from '../login/Logout';

import QueryImage from '../../assets/query.svg'











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
              {/* <Stack>
                <Stack
                  onClick={() => goToPage('/auditDetails')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.5vw',
                    height: '7vh',
                    borderRadius: '8px',
                    backgroundColor: location.pathname.includes('/auditDetails')
                      ? '#DAE8FF'
                      : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Audit"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname.includes('/auditDetails') ? (
                      <img src={Audit_Icon} alt="Audit" />
                    ) : (
                      <img src={NonActiveTicket} alt="Audit" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack> */}
              {/* <Stack>
                <Stack
                  onClick={() => goToPage('/OrderList')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.5vw',
                    height: '7vh',
                    borderRadius: '8px',
                    backgroundColor: location.pathname.includes('/OrderList')
                      ? '#DAE8FF'
                      : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Pharmacy"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname.includes('/OrderList') ? (
                      <img src={ActivePharmacyIcon} alt="Pharmacy" />
                    ) : (
                      <img src={pharmacy} alt="Pharmacy" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack> */}
              {/* <Stack>
                <Stack
                  onClick={() => goToPage('/Tasks')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.5vw',
                    height: '7vh',
                    borderRadius: '8px',
                    backgroundColor: location.pathname.includes('/Tasks')
                      ? '#DAE8FF'
                      : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Tasks"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname.includes('/Tasks') ? (
                      <img src={TaskActiveIcon} alt="Tasks" />
                    ) : (
                      <img src={Tasks} alt="Tasks" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack> */}
            </Box>

            {/* <Box sx={{ flexGrow: 1 }} /> */}
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              sx={{ alignItems: 'center' }}
            >
              {/* <Stack>
                <Stack
                  onClick={() => goToPage('/Configurations')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    width: '3.5vw',
                    height: '7vh',
                    borderRadius: '8px',
                    backgroundColor:
                      location.pathname === '/Configurations'
                        ? '#DAE8FF'
                        : 'transparent',
                    '&:hover': {
                      background: '#E1E6EE'
                    }
                  }}
                >
                  <LightTooltip
                    title="Configurations"
                    disableInteractive
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    {location.pathname === '/Configurations' ? (
                      <img src={SettingActive} alt="Configurations" />
                    ) : (
                      <img src={Taskscopy} alt="Configurations" />
                    )}
                  </LightTooltip>
                </Stack>
              </Stack> */}
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
        {/* </Drawer> */}
        <Box
          component="main"
          // sx={{ flexGrow: 1 }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default NavQuery;
