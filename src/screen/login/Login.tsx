import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material';
import { useState } from 'react';
import loginBg from '../../assets/images/login-bg.png';
import { loginHandler } from '../../api/auth/authHandler';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import styles from './login.module.css';
import LoginWallpaper from '../../../src/assets/LoginWallpaper.svg';
import AreteLogo from '../../../src/assets/AreteLogo.svg';
import MailIcon from '../../../src/assets/mail.svg';

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0566FF',
          },
        },
      },
    },
  },
});

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState({
    secret: '',
    show: false
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    <Loader isOpen={true} />;
    let phoneNumber: string
    if (phone.length == 10 && /^[0-9]+$/.test(phone)) {
      phoneNumber = `91${phone}`;
    } else {
      phoneNumber = phone;
    }
    console.log({ phone })
    loginHandler(phoneNumber, password.secret);
    navigate('/');
    <Loader isOpen={false} />;
  };
  const handleClickShowPassword = () => {
    setPassword({ ...password, show: !password.show });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Box className={styles.login_container} sx={{ background: `url(${LoginWallpaper}) lightgray 50% / cover no-repeat` }}>

        <Box className={styles.login_head}>
          <Stack display={'flex'} flexDirection={'row'} gap={'16px'}>
            <Stack>
              <img src={AreteLogo} alt='arete logo' />
            </Stack>
            <Stack className={styles.subLogo}>
              Octa PRM
            </Stack>
          </Stack>

          <Stack className={styles.mail}>
            <Stack className={styles.mailIcon}>
              <img src={MailIcon} alt='mail' />
            </Stack>
            <Stack className={styles.mailId}>
              help@aretehealth.tech
            </Stack>
          </Stack>
        </Box>


        <Box className={styles.login_box}>

          <Stack display={'flex'} flexDirection={'column'} gap={'8px'}>
            <Stack className={styles.login_box_title}>Welcome Back</Stack>
            <Stack className={styles.login_box_subtitle}>Please Enter You Details to Login into your account</Stack>
          </Stack>

          <Stack display={'flex'} width={'100%'} flexDirection={'column'} gap={'9px'} marginTop={"40px"}>
            <ThemeProvider theme={theme}>
              <Stack width={'100%'} height={"48px"}>
                <TextField
                  className='inputField-placeholder'
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  label="Phone"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: '13px',
                      color: "#0566FF",
                      fontFamily: `"Outfit",sans-serif`,
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: '12px',
                      color: 'var(--Text-Black, #080F1A)',
                      fontFamily: `"Outfit",sans-serif`,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0566FF',
                    },
                  }}
                />
              </Stack>
            </ThemeProvider>

            <ThemeProvider theme={theme}>
              <Stack width={'100%'} height={"48px"}>
                <FormControl color="success" margin="normal" variant="outlined">
                  <InputLabel
                    required
                    htmlFor="outlined-adornment-password"
                    sx={{
                      fontSize: '13px',
                      color: "#0566FF !important",
                      fontFamily: `"Outfit",sans-serif`,
                    }}
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="outlined-adornment-password"
                    type={password.show ? 'text' : 'password'}
                    value={password.secret}
                    onChange={(e) =>
                      setPassword({ ...password, secret: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {password.show ? (
                            <VisibilityOff sx={{ color: '#0566FF' }} />
                          ) : (
                            <Visibility sx={{ color: '#0566FF' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    sx={{
                      fontSize: '12px',
                      color: 'var(--Text-Black, #080F1A)',
                      fontFamily: `"Outfit",sans-serif`,
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0566FF',
                      },
                    }}
                  />
                </FormControl>
              </Stack>
            </ThemeProvider>


          </Stack>

          <Stack width={'100%'} marginTop={'24px'}>
            <button
              className={styles.login_btn}
              onClick={handleLogin}
            >
              Login
            </button>
          </Stack>

          <Stack className={styles.admincontact}>Forgot your password and want to reset <span style={{ color: "#0566FF" }}>Contact Admin</span></Stack>
        </Box>


        <Box className={styles.login_footer}>
          Copyright © 2024 areteheath.tech | All rights reserved
        </Box>

      </Box>

    </>
  );
};

export default Login;
