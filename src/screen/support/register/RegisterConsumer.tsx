import { PersonAddAlt1Outlined } from '@mui/icons-material';
import {
  Box,
  Stack,
  TextField,
  Button,
  FormHelperText,
  Typography,
  Avatar
} from '@mui/material';
import axios from 'axios';
import { AnyAaaaRecord } from 'dns';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, apiClient } from '../../../api/apiClient';
import { getConsumerByUhid } from '../../../api/consumer/consumer';
import { registerConsumerHandler } from '../../../api/consumer/consumerHandler';
import useEventStore from '../../../store/eventStore';
import { database } from '../../../utils/firebase';
import { toast, ToastContainer } from 'react-toastify';

const RegisterConsumer = () => {
  const initialConsumerFields = {
    firstName: '',
    lastName: '',
    email: null,
    phone: '',
    uid: '',
    age: '',
    gender: ''
  };

  const defaultValidations = { message: '', value: false };

  const initialValidationsFields = {
    firstName: defaultValidations,
    lastName: defaultValidations,
    email: defaultValidations,
    phone: defaultValidations,
    uid: defaultValidations,
    age: defaultValidations,
    gender: defaultValidations
  };
  const [consumer, setConsumer] = useState(initialConsumerFields);
  const [consumerId, setConsumerId] = useState('');
  const [validations, setValidations] = useState(initialValidationsFields);
  const [existingData, setExistingData] = useState(false);
  const { setSnacks } = useEventStore();
  const navigate = useNavigate();
  let existingBIData = false;

  // const validationsChecker = () => {
  //   const firstName = consumer.firstName === initialConsumerFields.firstName;
  //   // const lastName = consumer.lastName === initialConsumerFields.lastName;
  //   const phone = consumer.phone.length > 12;

  //   const uid = consumer.uid === initialConsumerFields.uid;

  //   // const age = consumer.age === initialConsumerFields.age;
  //   // const gender = consumer.gender === initialConsumerFields.gender;
  //   setValidations((prev) => {
  //     prev.firstName = firstName
  //       ? { message: 'Please enter correct first name', value: true }
  //       : defaultValidations;
  //     // prev.lastName = lastName
  //     //   ? { message: 'Please enter correct last name', value: true }
  //     //   : defaultValidations;
  //     // prev.email = email
  //     //   ? { message: 'Please enter correct email', value: true }
  //     //   : defaultValidations;
  //     prev.phone = phone
  //       ? { message: 'Please enter correct phone number', value: true }
  //       : defaultValidations;
  //     prev.uid = uid
  //       ? { message: 'Please enter correct UHID', value: true }
  //       : defaultValidations;
  //     // prev.age = age
  //     //   ? { message: 'Please enter correct age', value: true }
  //     //   : defaultValidations;
  //     // prev.gender = gender
  //     //   ? { message: 'Please enter correct gender', value: true }
  //     //   : defaultValidations;
  //     return { ...prev };
  //   });
  //   return (
  //     firstName === false &&
  //     // lastName === false &&
  //     // email === false &&
  //     phone === false &&
  //     uid === false
  //     // age === false &&
  //     // gender === false
  //   );
  // };

  const validationsChecker = () => {
    const firstNameValid = consumer.firstName.trim() !== '';
    const phoneValid = consumer.phone.length === 10;
    const uidValid = /^[0-9]+$/.test(consumer.uid.trim());
    // const uidValid = /^[a-zA-Z0-9]+$/.test(consumer.uid.trim());

    setValidations((prev) => ({
      ...prev,
      firstName: firstNameValid
        ? defaultValidations
        : { message: 'Please enter correct first name', value: true },
      phone: phoneValid
        ? defaultValidations
        : { message: 'Please enter correct phone number', value: true },
      uid: uidValid
        ? defaultValidations
        : {
            message: 'Please enter correct UHID and it should be numeric',
            value: true
          }
    }));

    return firstNameValid && phoneValid && uidValid;
  };

  const updateConsumerState = (field: string, value: any) => {
    setConsumer((prev: any) => {
      prev[field] = value;
      return { ...prev };
    });
  };

  // const updateConsumerId = (field: string, value: any) => {
  //   setConsumerId((prev: any) => {
  //     prev[field] = value;
  //     return { ...prev, consumer };
  //   });
  // };

  const registerConsumer = async () => {
    const check = validationsChecker();
    const isValid = validationsChecker();
    if (!isValid) {
      setSnacks('Please fill in all required fields correctly!', 'error');
      return; // Exit early if validations fail
    }
    if (check === true) {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - +consumer.age);

      // const email = consumer.email
      //   ? consumer.email.match(
      //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //     ) === null
      //   : true;
      const consumerPayload: any = consumer;

      // consumerPayload.email = email ? null : consumer.email;

      consumerPayload.lastName = consumer.lastName ? consumer.lastName : null;

      consumerPayload.gender = consumer.gender ? consumer.gender : null;

      consumerPayload.dob = consumer.age ? dob : null;

      const data = await registerConsumerHandler(consumerPayload);
      if (data) {
        setConsumerId(data._id);
        setExistingData(true);
      } else {
        setConsumerId('');
      }
      setConsumer({ ...initialConsumerFields });

      setSnacks('Patient Registered Successfully!', 'success');

      navigate(`/consumer/${data._id}`);
    }
    // if (check === true) {
    //   const dob = new Date();
    //   dob.setFullYear(dob.getFullYear() - +consumer.age);
    //   // const email = consumer.email
    //   //   ? consumer.email.match(
    //   //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   //     ) === null
    //   //   : true;
    //   const consumerPayload: any = consumer;
    //   // consumerPayload.email = email ? null : consumer.email;
    //   consumerPayload.lastName = consumer.lastName ? consumer.lastName : null;
    //   consumerPayload.gender = consumer.gender ? consumer.gender : null;
    //   consumerPayload.dob = consumer.age ? dob : null;
    //   await registerConsumerHandler(consumerPayload);
    //   setConsumer({ ...initialConsumerFields });
    //   setSnacks('Patient Registered Successfully!', 'success');
    //   navigate('/');
    // }
  };

  const nextConsumer = () => {
    navigate(`/consumer/${consumerId}`);
  };

  const calculateAge = (dob) => {
    console.log(dob, 'dob');
    if (!dob) {
      return '';
    }

    const birthDate = new Date(dob);

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const fetchConsumerDataByUhid = async () => {
    try {
      const response = await apiClient.get('/consumer/UhidData?', {
        params: { search: consumer.uid }
      });
      if (response.data) {
        updateConsumerState(
          'firstName',
          response.data[0].PatientName.split(' ')[0]
        );
        updateConsumerState(
          'lastName',
          response.data[0].PatientName.split(' ')[1]
        );
        let mobile;
        if (response.data[0].MobileNo.startsWith('0')) {
          mobile = response.data[0].MobileNo.substring(1);
          updateConsumerState('phone', mobile);
        } else {
          updateConsumerState('phone', response.data[0].MobileNo);
        }

        updateConsumerState('age', calculateAge(response.data[0].DOB));
        updateConsumerState(
          'gender',
          response.data[0].Gender === 'Female'
            ? 'F'
            : response.data[0].Gender === 'Male'
            ? 'M'
            : 'O'
        );
        setConsumerId(response.data[0].PatientId);
        // existingBIData = true;
        setExistingData(true);
      }
    } catch (error) {
      console.log('gfggf');
      toast.error('Data not found');
    }
    // try {
    //   const response = await apiClient.get(
    //     '/consumer/findConsumer?',
    //     { params: { search: consumer.uid } }
    //   );
    //   if (response.status == 200) {
    //     updateConsumerState('firstName', response.data.firstName);
    //     updateConsumerState('lastName', response.data.lastName);
    //     updateConsumerState('phone', response.data.phone);
    //     updateConsumerState('age', calculateAge(response.data.dob));
    //     updateConsumerState('gender', response.data.gender);
    //     setConsumerId(response.data._id);
    //     setExistingData(true);
    //   }
    // } catch (error) {
    //   if (!existingBIData) {
    //     updateConsumerState('firstName', '');
    //     updateConsumerState('lastName', '');
    //     updateConsumerState('phone', '');
    //     updateConsumerState('age', '');
    //     updateConsumerState('gender', '');
    //     setConsumerId('');

    //     setExistingData(false);
    //   }
    // }
  };

  useEffect(() => {
    updateConsumerState('firstName', '');
    updateConsumerState('lastName', '');
    updateConsumerState('phone', '');
    updateConsumerState('age', '');
    updateConsumerState('gender', '');
    setConsumerId('');
  }, [consumer.uid]);

  return (
    <Box>
      {/* <BackHeader title="Register" /> */}
      <Stack
        direction="row"
        spacing={2}
        borderRadius="0rem 0rem 1rem 1rem"
        p={1}
        bgcolor="primary.main"
        height={'15vh'}
        mb={2}
      >
        <Avatar>
          <PersonAddAlt1Outlined />
        </Avatar>
        <Stack>
          <Typography color="white" variant="h6">
            Patient Registration
          </Typography>
          <Typography variant="body2" color="lightgray" sx={{ pb: 2 }}>
            Register Patient here for further tasks on the registered patient
          </Typography>
        </Stack>
      </Stack>

      {/* <TextField>{uhidData}</TextField> */}
      <Stack p={1} spacing={2} height="80vh">
        <Stack
          display={'flex'}
          flexDirection={'row'}
          gap={'5px'}
          width={'100%'}
        >
          <Stack width={'70%'}>
            <TextField
              // sx={{ px: 0.5 }}
              value={consumer.uid}
              onChange={(e) => updateConsumerState('uid', e.target.value)}
              // fullWidth
              size="small"
              type="text"
              placeholder="33XXX"
              label="UHID"
              // onBlur={fetchConsumerDataByUhid}
              error={validations.uid.value}
              helperText={validations.uid.message}
              // inputProps={{ maxLength: 13, pattern: "\\d{0,12}" }}
              // disabled={existingBIData ? false : true}
            />
          </Stack>

          <Stack
            component={'div'}
            onClick={fetchConsumerDataByUhid}
            width={'30%'}
          >
            <Button size="medium" variant="contained">
              Search
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            value={consumer.firstName}
            onChange={(e) => updateConsumerState('firstName', e.target.value)}
            fullWidth
            size="small"
            type="text"
            placeholder="Jhon"
            label="First Name"
            error={validations.firstName.value}
            helperText={validations.firstName.message}
            disabled={existingData ? true : false}
          />
          <TextField
            value={consumer.lastName}
            onChange={(e) => updateConsumerState('lastName', e.target.value)}
            fullWidth
            size="small"
            type="text"
            placeholder="Doe"
            label="Last Name (optional)"
            error={validations.lastName.value}
            // disabled={consumer.uid ? false : true}
            helperText={validations.lastName.message}
            disabled={existingData ? true : false}
          />
        </Stack>
        {/* <TextField
          value={consumer.email}
          onChange={(e) => updateConsumerState('email', e.target.value)}
          fullWidth
          size="small"
          type="email"
          placeholder="Jhondoe@gmail.com"
          label="Email Address"
          error={validations.email.value}
          helperText={validations.email.message}
        /> */}
        <TextField
          value={consumer.phone}
          onChange={(e) => updateConsumerState('phone', e.target.value)}
          fullWidth
          type="tel"
          size="small"
          placeholder="8979XXXXXX"
          label="Phone Number"
          error={validations.phone.value}
          // disabled={consumer.uid ? false : true}
          helperText={validations.phone.message}
          disabled={existingData ? true : false}
        />
        {/* <TextField
          value={consumer.uid}
          onChange={(e) => updateConsumerState('uid', e.target.value)}
          fullWidth
          size="small"
          type="text"
          placeholder="33XXX"
          label="UHID"
          error={validations.uid.value}
          helperText={validations.uid.message}
        /> */}
        <TextField
          value={consumer.age}
          onChange={(e) => updateConsumerState('age', e.target.value)}
          fullWidth
          size="small"
          type="number"
          placeholder="32"
          label="Age  (optional)"
          error={validations.age.value}
          // disabled={consumer.uid ? false : true}
          helperText={validations.age.message}
          disabled={existingData ? true : false}
        />
        {/* <Typography color="GrayText">Select Gender</Typography>
        <Stack spacing={2} direction="row">
          <Paper
            onClick={() => {
              updateConsumerState('gender', 'M');
            }}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: consumer.gender === 'M' ? 'primary' : 'white'
            }}
            square
          >
            <MaleOutlined />
          </Paper>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }} square>
            <FemaleOutlined />
          </Paper>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }} square>
            <TransgenderOutlined />
          </Paper>
        </Stack> */}
        <Box>
          <Typography sx={{ my: 1 }} color="CaptionText">
            Gender (optional)
          </Typography>
          <Stack flexDirection="row" alignItems="center">
            {[
              { label: 'Male', value: 'M' },
              { label: 'Female', value: 'F' },
              { label: 'Other', value: 'O' }
            ].map((item) => {
              return (
                <Button
                  size="small"
                  sx={{ mr: 1 }}
                  variant={
                    item.value === consumer.gender ? 'contained' : 'outlined'
                  }
                  // disabled={consumer.uid ? false : true}
                  onClick={() => updateConsumerState('gender', item.value)}
                  disabled={existingData ? true : false}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
          <FormHelperText error={validations.gender.value}>
            {validations.gender.message}
          </FormHelperText>
        </Box>
        {/* {existingData ? (
          <Button size="large" onClick={nextConsumer} variant="contained">
            Next
          </Button>
        ) : (
          <Button size="large" onClick={registerConsumer} variant="contained">
            Next
          </Button>
        )} */}
        <Button size="large" onClick={registerConsumer} variant="contained">
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterConsumer;
