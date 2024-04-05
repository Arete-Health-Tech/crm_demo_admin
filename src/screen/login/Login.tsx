import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import loginBg from '../../assets/images/login-bg.png';
import { loginHandler } from '../../api/auth/authHandler';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

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
    console.log({phone})
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
    <Grid
      container
      sx={{ minHeight: '100vh', background: '#226D4A' }}
      alignItems="center"
    >
      <Grid
        xs={0}
        md={6}
        item
        sx={{
          backgroundImage: `url(${loginBg})`,
          minHeight: '100vh',
          backgroundPosition: 'right',
          backgroundSize: 'cover'
        }}
      ></Grid>
      <Grid xs={12} md={6} p={2} alignItems="center">
        <Stack
          boxShadow={5}
          padding={4}
          justifyContent="center"
          sx={{
            background: 'white'
          }}
          borderRadius={5}
        >
          <Typography variant="h6" color="#226D4A" fontWeight="bold">
            Welcome Back !
          </Typography>
          <Typography variant="caption" color="#226D4A" fontWeight="bold">
            Please Enter You Details to Login into your account
          </Typography>
          <TextField
            color="success"
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            label="Phone"
          />
          <FormControl color="success" margin="normal" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
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
                      <VisibilityOff color="success" />
                    ) : (
                      <Visibility color="success" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            sx={{
              marginTop: '1rem',
              padding: '0.8rem'
            }}
            variant="contained"
            color="success"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Login;
