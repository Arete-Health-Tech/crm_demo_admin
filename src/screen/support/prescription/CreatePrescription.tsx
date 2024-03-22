import {
  Camera,
  Check,
  Close,
  Delete,
  Label,
  Undo,
  Upload
} from '@mui/icons-material';
import {
  MenuItem,
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  Select,
  TextField,
  OutlinedInput,
  IconButton,
  CardMedia,
  Typography,
  CardContent,
  Button,
  Grid,
  FormHelperText,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { apiClient } from '../../../api/apiClient';
import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
import { getDoctorsHandler } from '../../../api/doctor/doctorHandler';
import { createTicketHandler } from '../../../api/ticket/ticketHandler';
import useServiceStore from '../../../store/serviceStore';
import { iService } from '../../../types/store/service';



type iPrescription = {
  department: string;
  // subDepartment: string;
  doctor: string;
  admission: null | string;
  symptoms: string | null;
  condition: string | null;
  medicines: string[];
  followUp: Date | number;
  image: string | null;
  isPharmacy: string | null;
  caregiver_name: string | null;
  caregiver_phone: string | null;
  service?: { _id: string; label: string };
};

const initialPrescription = {
  department: '',
  diagnostics: 'Lab',
  // subDepartment: '',
  doctor: '',
  admission: 'Surgery',
  symptoms: null,
  condition: null,
  medicines: [],
  followUp: new Date(),
  image: null,
  isPharmacy: 'yes',
  caregiver_name: null,
  caregiver_phone: null
};

const CreatePrescription = () => {
  const { departments, doctors } = useServiceStore();
  // const [medicine, setMedicine] = useState('');
  const [openCamera, setOpenCamera] = useState(false);
  const [foundServices, setFoundServices] = useState<iService[]>([]);
  const camera = useRef<Webcam>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<iPrescription>(
    structuredClone(initialPrescription)
  );
  const [diagnostics, setDiagnostics] = useState<string[]>(['Lab']);
  const defaultValidation = { message: '', value: false };
  const [isCaregiver, setIsCaregiver] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [buttonVariant, setButtonVariant] = useState<string | null>(null);

  const [selectedPharmacy, setSelectedPharmacy] = useState('yes');
  const [scannedResult, setScannedResult] = useState(null);


  const findService = async (query: string) => {
    try {
      if (query.length <= 3) return;
      const { data } = await apiClient.get(`/service/search?search=${query}`);
      setFoundServices(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [validations, setValidations] = useState({
    department: { message: '', value: false },
    // subDepartment: { message: '', value: false },
    doctor: { message: '', value: false },
    admission: { message: '', value: false },
    service: { message: '', value: false },
    followUp: { message: '', value: false },
    image: { message: '', value: false }
  });

  const changePrescriptionValue = (field: any, value: any) => {
    setPrescription((prev: any) => {
      prev[field] = value;
      return { ...prev };
    });
  };

  useEffect(() => {
    setPrescription(structuredClone(initialPrescription));
  }, []);

  const validation = () => {
    const department = prescription.department === '';
    // const subDepartment = prescription.subDepartment === '';
    const doctor = prescription.doctor === '';
    const admission = prescription.admission === '';
    const image = prescription.image === null;

    // let service = false;
    // if (prescription.admission !== 'none') {
    //   if (!prescription.service || prescription.service?._id === '') {
    //     service = true;
    //   }
    // }
    // const followUp = new Date(prescription.followUp).getTime() < Date.now();

    setValidations((prev) => {
      prev.department = department
        ? { message: 'Invalid Value', value: true }
        : defaultValidation;
      // prev.subDepartment = subDepartment
      //   ? { message: 'Invalid Value', value: true }
      //   : defaultValidation;
      prev.doctor = doctor
        ? { message: 'Invalid Value', value: true }
        : defaultValidation;
      prev.admission = admission
        ? { message: 'Invalid Value', value: true }
        : defaultValidation;
      // prev.followUp = followUp
      //   ? { message: 'Invalid Value', value: true }
      //   : defaultValidation;
      prev.image = image
        ? { message: 'Invalid Value', value: true }
        : defaultValidation;

      // prev.service = service
      //   ? { message: 'Please specify service', value: true }
      //   : defaultValidation;
      return { ...prev };
    });
    return (
      department === false &&
      // subDepartment === false &&
      doctor === false &&
      admission === false &&
      image === false
      // followUp === false &&
      // service === false
    );
  };






  const handelUploadPrescription = async () => {
    setDisableButton(true);
    const validationCheck = validation();
    if (validationCheck === true) {
      const ticket: any = structuredClone(prescription);
      delete ticket.department;
      delete ticket.subDepartment;
      ticket.consumer = id;
      ticket.departments = [prescription.department];
      ticket.diagnostics = diagnostics;

      ticket.followup = ticket.followup ? ticket.followup : null;
      await createTicketHandler(ticket);
      setPrescription(structuredClone(initialPrescription));
      setDiagnostics([]);
      setDisableButton(false);

      navigate('/');
    } else {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    (async function () {
      await getDepartmentsHandler();
      await getDoctorsHandler();
    })();
  }, []);




  // console.log(prescription)


  const handleInternal = (item: string) => {
    // console.log('this is response');
    setButtonVariant(item);
  };







  return (
    <>
      <Box display={openCamera ? 'none' : 'block'}>
        <form>
          <Box my={1.5}>
            <Autocomplete
              size="small"
              fullWidth
              onChange={(_, newValue) =>
                changePrescriptionValue('department', newValue!._id!)
              }
              renderOption={(props, option) => (
                <li {...props} style={{ textTransform: 'capitalize' }}>
                  {option.name}
                </li>
              )}
              getOptionLabel={(option) => option.name}
              options={departments.filter((item) => item.parent === null)}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
            />
            <FormHelperText error={validations.department.value}>
              {validations.department.message}
            </FormHelperText>
          </Box>
          {/* <Box my={1.5}>
            <Autocomplete
              disablePortal
              fullWidth
              onChange={(_, newValue) =>
                changePrescriptionValue('subDepartment', newValue!._id!)
              }
              options={subDepartmentLabels}
              renderInput={(params) => (
                <TextField {...params} label="Sub Department" />
              )}
            />
            <FormHelperText error={validations.subDepartment.value}>
              {validations.subDepartment.message}
            </FormHelperText>
          </Box> */}
          <Box my={1.5}>
            <Autocomplete
              size="small"
              disablePortal
              renderOption={(props, option) => (
                <li {...props} style={{ textTransform: 'capitalize' }}>
                  {option.name}
                </li>
              )}
              fullWidth
              onChange={(_, newValue) =>
                changePrescriptionValue('doctor', newValue!._id!)
              }
              options={doctors.filter((item) =>
                item.departments.includes(prescription.department)
              )}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Doctor" />}
            />
            <FormHelperText error={validations.doctor.value}>
              {validations.doctor.message}
            </FormHelperText>
          </Box>
          <Box my={1.5}>
            <Typography color="gray" id="demo-simple-select-label">
              Admission Type
            </Typography>
            <Stack flexWrap={'wrap'} flexDirection="row">
              {[
                'none',
                'Surgery',
                'MM'
              ].map((item) => (
                <Button
                  size="small"
                  sx={{ m: 0.4 }}
                  key={item}
                  onClick={() => changePrescriptionValue('admission', item)}
                  variant={
                    prescription.admission === item ? 'contained' : 'outlined'
                  }
                >
                  {item}
                </Button>
              ))}
            </Stack>

            <FormHelperText error={validations.admission.value}>
              {validations.admission.message}
            </FormHelperText>

            {prescription.admission === 'Internal Reference' ? (
              <Stack flexWrap={'wrap'} flexDirection="row">
                {/* Render three buttons for Internal Reference */}
                {['Med', 'Surg', 'Chemo'].map((item) => (
                  <Button
                    size="small"
                    sx={{ m: 0.4 }}
                    key={item}
                    onClick={() => handleInternal(item)}
                    variant={buttonVariant === item ? 'contained' : 'outlined'}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            ) : (
              prescription.admission !== 'none' && (
                <Box my={1.5}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    onChange={(_, newValue) =>
                      changePrescriptionValue('service', newValue)
                    }
                    options={foundServices}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        onChange={(e) => findService(e.target.value)}
                        {...params}
                        label="Service"
                      />
                    )}
                  />
                  <FormHelperText error={validations.service.value}>
                    {validations.service.message}
                  </FormHelperText>
                </Box>
              )
            )}
          </Box>
          {/* <Box my={1.5}>
            <TextField
              value={prescription.symptoms}
              onChange={(e) =>
                changePrescriptionValue('symptoms', e.target.value)
              }
              rows={3}
              fullWidth
              multiline
              placeholder="Headache, Vomit"
              label="Symptoms"
            />
          </Box>
          <Box my={1.5}>
            <TextField
              value={prescription.condition}
              onChange={(e) =>
                changePrescriptionValue('condition', e.target.value)
              }
              rows={3}
              fullWidth
              multiline
              placeholder="BP 80/130"
              label="Conditions"
            />
          </Box>
          <Box my={1.5}> */}
          {/* {prescription.medicines.map((item, index) => (
            <Chip
              sx={{ mx: 1 }}
              label={item}
              onDelete={() =>
                setPrescription((prev) => {
                  prev.medicines.splice(index, 1);
                  return { ...prev };
                })
              }
            />
          ))} */}
          {/* <FormControl sx={{ mt: 0.5 }} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Medicine
            </InputLabel>
            <OutlinedInput
              fullWidth
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              id="outlined-adornment-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      if (medicine.length <= 0) return;
                      setPrescription((prev) => {
                        prev.medicines.push(medicine);
                        return { ...prev };
                      });
                      setMedicine('');
                    }}
                    edge="end"
                  >
                    <Add />
                  </IconButton>
                </InputAdornment>
              }
              label="Medicines"
            />
          </FormControl> */}
          {/* </Box> */}
          <Box my={1.5}>
            <Typography color="gray" id="demo-simple-select-label">
              Diagnostics
            </Typography>
            <Stack flexWrap={'wrap'} flexDirection="row">
              <Button
                size="small"
                sx={{ m: 0.4 }}
                onClick={() => {
                  setDiagnostics([]);
                  changePrescriptionValue('diagnostics', [])
                }}
                variant={diagnostics.length === 0 ? 'contained' : 'outlined'}
              >
                None
              </Button>
              {['CT-Scan', 'EEG', 'EMG', 'MRI', 'Lab', 'X-RAY', 'USG'].map(
                (item) => (
                  <Button
                    size="small"
                    sx={{ m: 0.4 }}
                    key={item}
                    onClick={() => {
                      const diag = new Set(diagnostics);
                      if (diag.has(item)) {
                        diag.delete(item);
                      } else {
                        diag.add(item);
                      }
                      setDiagnostics(Array.from(diag));
                      changePrescriptionValue('diagnostics', Array.from(diag))
                    }}
                    variant={
                      new Set(diagnostics).has(item) ? 'contained' : 'outlined'
                    }
                  >
                    {item}
                  </Button>
                )
              )}
            </Stack>
          </Box>
          <Box my={1.5}>
            <Typography color="gray" id="demo-simple-select-label">
              Is Pharmacy advised
            </Typography>
            <Stack flexWrap={'wrap'} flexDirection="row">
              <Button
                size="small"
                sx={{ m: 0.4 }}
                variant={selectedPharmacy === 'yes' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedPharmacy('yes');
                  changePrescriptionValue('isPharmacy', 'Pharmacy Advised');
                }}
              >
                Yes
              </Button>
              <Button
                size="small"
                sx={{ m: 0.4 }}
                variant={selectedPharmacy === 'no' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedPharmacy('no');
                  changePrescriptionValue('isPharmacy', 'Not Advised');
                }}
              >
                No
              </Button>
            </Stack>{' '}
          </Box>

          <Box my={1.8}>
            <Typography color="gray" id="demo-simple-select-label">
              Follow Up Date
            </Typography>
            <TextField
              inputProps={{ inputProps: { min: new Date() } }}
              value={prescription.followUp}
              onChange={(e) =>
                changePrescriptionValue('followUp', e.target.value)
              }
              fullWidth
              // label="Follow Up Date"
              type="date"
              variant="standard"
              error={validations.followUp.value}
              helperText={validations.followUp.message}
            />
          </Box>
          {/* <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCaregiver}
                  onChange={(e) => setIsCaregiver(e.target.checked)}
                />
              }
              label="Caregiver should receive updates and information."
            />
            {isCaregiver && (
              <>
                <TextField
                  size="small"
                  sx={{ my: 0.5 }}
                  value={prescription.caregiver_name}
                  onChange={(e) =>
                    changePrescriptionValue('caregiver_name', e.target.value)
                  }
                  fullWidth
                  label="Caregiver Name"
                />
                <TextField
                  size="small"
                  sx={{ my: 0.5 }}
                  value={prescription.caregiver_phone}
                  onChange={(e) =>
                    changePrescriptionValue('caregiver_phone', e.target.value)
                  }
                  fullWidth
                  label="Caregiver Phone"
                />
              </>
            )}
          </FormGroup> */}
          <Box my={1.5}>
            <Grid container>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="subtitle1">
                      Prescription Image
                    </Typography>
                    <Stack spacing={0.5}>
                      {prescription.image === null && (
                        <Button
                          onClick={() => setOpenCamera(true)}
                          fullWidth
                          variant="outlined"
                          startIcon={<Camera />}
                        >
                          Capture
                        </Button>
                      )}
                      {prescription.image !== null && (
                        <>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Undo />}
                            onClick={() => setOpenCamera(true)}
                          >
                            Retake
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() =>
                              changePrescriptionValue('image', null)
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <CardMedia
                  component="img"
                  sx={{ width: '150px', objectFit: 'contain', height: '150px' }}
                  image={
                    prescription.image
                      ? prescription.image
                      : 'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png'
                  }
                  alt="Prescription Image"
                />
              </Grid>
            </Grid>
            <FormHelperText error={validations.image.value}>
              {validations.image.message}
            </FormHelperText>
          </Box>
          <Box height="20vh">
            <Button
              disabled={disableButton}
              onClick={handelUploadPrescription}
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Upload />}
            >
              {disableButton ? 'Uploading ...' : 'Upload Prescription'}
            </Button>
          </Box>
        </form>
      </Box>
      <Box
        display={openCamera ? 'absolute' : 'none'}
        sx={{
          position: 'absolute',
          height: '100vh',
          width: '100vw',
          top: '0px',
          backgroundColor: 'white',
          zIndex: 10,
          left: '0px',
          overflow: 'hidden'
        }}
      >
        {prescription.image === null ? (

          <Webcam
            style={{ height: '90vh' }}
            audio={false}
            screenshotFormat="image/jpeg"
            ref={camera}
          // videoConstraints={{
          //   facingMode: { exact: 'environment' }
          // }}
          />

        ) : (
          <Box>
            <img
              src={prescription.image}
              style={{ width: '100vw', height: '90vh', objectFit: 'contain' }}
            />
          </Box>
        )}
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
          <IconButton onClick={() => changePrescriptionValue('image', null)}>
            <Undo fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => {
              changePrescriptionValue(
                'image',
                camera.current!.getScreenshot()!
              );
            }}
          >
            <Camera fontSize="large" />
          </IconButton>
          <IconButton onClick={() => setOpenCamera(false)}>
            {prescription.image === null ? (
              <Close fontSize="large" />
            ) : (
              <Check fontSize="large" />
            )}
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default CreatePrescription;
// import {
//   Camera,
//   Check,
//   Close,
//   Delete,
//   Label,
//   Undo,
//   Upload
// } from '@mui/icons-material';
// import {
//   MenuItem,
//   Autocomplete,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   TextField,
//   OutlinedInput,
//   IconButton,
//   CardMedia,
//   Typography,
//   CardContent,
//   Button,
//   Grid,
//   FormHelperText,
//   Checkbox,
//   FormGroup,
//   FormControlLabel
// } from '@mui/material';
// import { Stack } from '@mui/system';
// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import AddIcon from '@mui/icons-material/Add';
// import { apiClient } from '../../../api/apiClient';
// import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
// import { getDoctorsHandler } from '../../../api/doctor/doctorHandler';
// // import { createTicketHandler } from '../../../api/ticket/createTicketHandler';
// import useServiceStore from '../../../store/serviceStore';
// import { iService } from '../../../types/store/service';
// import { createTicketHandler } from '../../../api/ticket/ticketHandler';



// type iPrescription = {
//   department: string;
//   diagnostics: string;
//   // subDepartment: string;
//   doctor: string;
//   admission: null | string;
//   symptoms: string | null;
//   condition: string | null;
//   medicines: string[];
//   followUp: Date | number;
//   image: string[];
//   isPharmacy: string | null;
//   caregiver_name: string | null;
//   caregiver_phone: string | null;
//   service?: { _id: string; label: string };
// };

// const initialPrescription = {
//   department: '',
//   diagnostics: 'Lab',
//   // subDepartment: '',
//   doctor: '',
//   admission: 'Surgery',
//   symptoms: null,
//   condition: null,
//   medicines: [],
//   followUp: new Date(),
//   image: [],
//   isPharmacy: 'yes',
//   caregiver_name: null,
//   caregiver_phone: null
// };

// const CreatePrescription = () => {
//   const { departments, doctors } = useServiceStore();
//   // const [medicine, setMedicine] = useState('');
//   const [openCamera, setOpenCamera] = useState(false);
//   const [foundServices, setFoundServices] = useState<iService[]>([]);
//   const camera = useRef<Webcam>(null);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [prescription, setPrescription] = useState<iPrescription>(
//     structuredClone(initialPrescription)
//   );
//   const [diagnostics, setDiagnostics] = useState<string[]>(['Lab']);
//   const defaultValidation = { message: '', value: false };
//   const [isCaregiver, setIsCaregiver] = useState(false);
//   const [disableButton, setDisableButton] = useState(false);
//   const [buttonVariant, setButtonVariant] = useState<string | null>(null);

//   const [selectedPharmacy, setSelectedPharmacy] = useState('yes');
//   const [scannedResult, setScannedResult] = useState(null);


//   const findService = async (query: string) => {
//     try {
//       if (query.length <= 3) return;
//       const { data } = await apiClient.get(`/service/search?search=${query}`);
//       setFoundServices(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [validations, setValidations] = useState({
//     department: { message: '', value: false },
//     // subDepartment: { message: '', value: false },
//     doctor: { message: '', value: false },
//     admission: { message: '', value: false },
//     service: { message: '', value: false },
//     followUp: { message: '', value: false },
//     image: { message: '', value: false }
//   });

//   const changePrescriptionValue = (field: any, value: any) => {
//     console.log({ field, value })
//     setPrescription((prev: any) => {
//       if (field == "image") {
//         if (value.length > 0) {
//           return { ...prev, [field]: [...prev[field], value] };
//         } else {
//           return { ...prev, [field]: [] }
//         }
//       } else {
//         prev[field] = value;
//         return { ...prev };
//       }
//     });
//   };

//   console.log(prescription.image)
//   useEffect(() => {
//     setPrescription(structuredClone(initialPrescription));
//   }, []);
//   const validation = () => {
//     const department = prescription.department === '';
//     // const subDepartment = prescription.subDepartment === '';
//     const doctor = prescription.doctor === '';
//     const admission = prescription.admission === '';
//     const image = prescription.image?.length === 0;

//     // let service = false;
//     // if (prescription.admission !== 'none') {
//     //   if (!prescription.service || prescription.service?._id === '') {
//     //     service = true;
//     //   }
//     // }
//     // const followUp = new Date(prescription.followUp).getTime() < Date.now();

//     setValidations((prev) => {
//       prev.department = department
//         ? { message: 'Invalid Value', value: true }
//         : defaultValidation;
//       // prev.subDepartment = subDepartment
//       //   ? { message: 'Invalid Value', value: true }
//       //   : defaultValidation;
//       prev.doctor = doctor
//         ? { message: 'Invalid Value', value: true }
//         : defaultValidation;
//       prev.admission = admission
//         ? { message: 'Invalid Value', value: true }
//         : defaultValidation;
//       // prev.followUp = followUp
//       //   ? { message: 'Invalid Value', value: true }
//       //   : defaultValidation;
//       prev.image = image
//         ? { message: 'Invalid Value', value: true }
//         : defaultValidation;

//       // prev.service = service
//       //   ? { message: 'Please specify service', value: true }
//       //   : defaultValidation;
//       return { ...prev };
//     });
//     return (
//       department === false &&
//       // subDepartment === false &&
//       doctor === false &&
//       admission === false &&
//       image === false
//       // followUp === false &&
//       // service === false
//     );
//   };






//   const handelUploadPrescription = async () => {
//     setDisableButton(true);
//     const validationCheck = validation();
//     if (validationCheck === true) {
//       const ticket: any = structuredClone(prescription);
//       delete ticket.department;
//       delete ticket.subDepartment;
//       ticket.consumer = id;
//       ticket.departments = [prescription.department];
//       ticket.diagnostics = diagnostics;

//       ticket.followup = ticket.followup ? ticket.followup : null;
//       console.log({ ticket })
//       await createTicketHandler(ticket);
//       setPrescription(structuredClone(initialPrescription));
//       setDiagnostics([]);
//       setDisableButton(false);

//       navigate('/');
//     } else {
//       setDisableButton(false);
//     }
//   };

//   useEffect(() => {
//     (async function () {
//       await getDepartmentsHandler();
//       await getDoctorsHandler();
//     })();
//   }, []);




//   console.log(prescription)


//   const handleInternal = (item: string) => {
//     console.log('this is response');
//     setButtonVariant(item);
//   };







//   return (
//     <>
//       <Box display={openCamera ? 'none' : 'block'}>
//         <form>
//           <Box my={1.5}>
//             <Autocomplete
//               size="small"
//               fullWidth
//               onChange={(_, newValue) =>
//                 changePrescriptionValue('department', newValue!._id!)
//               }
//               renderOption={(props, option) => (
//                 <li {...props} style={{ textTransform: 'capitalize' }}>
//                   {option.name}
//                 </li>
//               )}
//               getOptionLabel={(option) => option.name}
//               options={departments.filter((item) => item.parent === null)}
//               renderInput={(params) => (
//                 <TextField {...params} label="Department" />
//               )}
//             />
//             <FormHelperText error={validations.department.value}>
//               {validations.department.message}
//             </FormHelperText>
//           </Box>
//           {/* <Box my={1.5}>
//             <Autocomplete
//               disablePortal
//               fullWidth
//               onChange={(_, newValue) =>
//                 changePrescriptionValue('subDepartment', newValue!._id!)
//               }
//               options={subDepartmentLabels}
//               renderInput={(params) => (
//                 <TextField {...params} label="Sub Department" />
//               )}
//             />
//             <FormHelperText error={validations.subDepartment.value}>
//               {validations.subDepartment.message}
//             </FormHelperText>
//           </Box> */}
//           <Box my={1.5}>
//             <Autocomplete
//               size="small"
//               disablePortal
//               renderOption={(props, option) => (
//                 <li {...props} style={{ textTransform: 'capitalize' }}>
//                   {option.name}
//                 </li>
//               )}
//               fullWidth
//               onChange={(_, newValue) =>
//                 changePrescriptionValue('doctor', newValue!._id!)
//               }
//               options={doctors.filter((item) =>
//                 item.departments.includes(prescription.department)
//               )}
//               getOptionLabel={(option) => option.name}
//               renderInput={(params) => <TextField {...params} label="Doctor" />}
//             />
//             <FormHelperText error={validations.doctor.value}>
//               {validations.doctor.message}
//             </FormHelperText>
//           </Box>
//           <Box my={1.5}>
//             <Typography color="gray" id="demo-simple-select-label">
//               Admission Type
//             </Typography>
//             <Stack flexWrap={'wrap'} flexDirection="row">
//               {[
//                 'none',
//                 'Surgery',
//                 'MM'
//               ].map((item) => (
//                 <Button
//                   size="small"
//                   sx={{ m: 0.4 }}
//                   key={item}
//                   onClick={() => changePrescriptionValue('admission', item)}
//                   variant={
//                     prescription.admission === item ? 'contained' : 'outlined'
//                   }
//                 >
//                   {item}
//                 </Button>
//               ))}
//             </Stack>

//             <FormHelperText error={validations.admission.value}>
//               {validations.admission.message}
//             </FormHelperText>

//             {prescription.admission === 'Internal Reference' ? (
//               <Stack flexWrap={'wrap'} flexDirection="row">
//                 {/* Render three buttons for Internal Reference */}
//                 {['Med', 'Surg', 'Chemo'].map((item) => (
//                   <Button
//                     size="small"
//                     sx={{ m: 0.4 }}
//                     key={item}
//                     onClick={() => handleInternal(item)}
//                     variant={buttonVariant === item ? 'contained' : 'outlined'}
//                   >
//                     {item}
//                   </Button>
//                 ))}
//               </Stack>
//             ) : (
//               prescription.admission !== 'none' && (
//                 <Box my={1.5}>
//                   <Autocomplete
//                     size="small"
//                     fullWidth
//                     onChange={(_, newValue) =>
//                       changePrescriptionValue('service', newValue)
//                     }
//                     options={foundServices}
//                     getOptionLabel={(option) => option.name}
//                     renderInput={(params) => (
//                       <TextField
//                         onChange={(e) => findService(e.target.value)}
//                         {...params}
//                         label="Select surgery"
//                       />
//                     )}
//                   />
//                   <FormHelperText error={validations.service.value}>
//                     {validations.service.message}
//                   </FormHelperText>
//                 </Box>
//               )
//             )}
//           </Box>
//           {/* <Box my={1.5}>
//             <TextField
//               value={prescription.symptoms}
//               onChange={(e) =>
//                 changePrescriptionValue('symptoms', e.target.value)
//               }
//               rows={3}
//               fullWidth
//               multiline
//               placeholder="Headache, Vomit"
//               label="Symptoms"
//             />
//           </Box>
//           <Box my={1.5}>
//             <TextField
//               value={prescription.condition}
//               onChange={(e) =>
//                 changePrescriptionValue('condition', e.target.value)
//               }
//               rows={3}
//               fullWidth
//               multiline
//               placeholder="BP 80/130"
//               label="Conditions"
//             />
//           </Box>
//           <Box my={1.5}> */}
//           {/* {prescription.medicines.map((item, index) => (
//             <Chip
//               sx={{ mx: 1 }}
//               label={item}
//               onDelete={() =>
//                 setPrescription((prev) => {
//                   prev.medicines.splice(index, 1);
//                   return { ...prev };
//                 })
//               }
//             />
//           ))} */}
//           {/* <FormControl sx={{ mt: 0.5 }} fullWidth variant="outlined">
//             <InputLabel htmlFor="outlined-adornment-password">
//               Medicine
//             </InputLabel>
//             <OutlinedInput
//               fullWidth
//               value={medicine}
//               onChange={(e) => setMedicine(e.target.value)}
//               id="outlined-adornment-password"
//               endAdornment={
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => {
//                       if (medicine.length <= 0) return;
//                       setPrescription((prev) => {
//                         prev.medicines.push(medicine);
//                         return { ...prev };
//                       });
//                       setMedicine('');
//                     }}
//                     edge="end"
//                   >
//                     <Add />
//                   </IconButton>
//                 </InputAdornment>
//               }
//               label="Medicines"
//             />
//           </FormControl> */}
//           {/* </Box> */}
//           <Box my={1.5}>
//             <Typography color="gray" id="demo-simple-select-label">
//               Diagnostics
//             </Typography>
//             <Stack flexWrap={'wrap'} flexDirection="row">
//               <Button
//                 size="small"
//                 sx={{ m: 0.4 }}
//                 onClick={() => {
//                   setDiagnostics([]);
//                   changePrescriptionValue('diagnostics', [])
//                 }}
//                 variant={diagnostics.length === 0 ? 'contained' : 'outlined'}
//               >
//                 None
//               </Button>
//               {['CT-Scan', 'EEG', 'EMG', 'MRI', 'Lab', 'X-RAY', 'USG'].map(
//                 (item) => (
//                   <Button
//                     size="small"
//                     sx={{ m: 0.4 }}
//                     key={item}
//                     onClick={() => {
//                       const diag = new Set(diagnostics);
//                       if (diag.has(item)) {
//                         diag.delete(item);
//                       } else {
//                         diag.add(item);
//                       }
//                       setDiagnostics(Array.from(diag));
//                       changePrescriptionValue('diagnostics', Array.from(diag))
//                     }}
//                     variant={
//                       new Set(diagnostics).has(item) ? 'contained' : 'outlined'
//                     }
//                   >
//                     {item}
//                   </Button>
//                 )
//               )}
//             </Stack>
//           </Box>
//           <Box my={1.5}>
//             <Typography color="gray" id="demo-simple-select-label">
//               Is Pharmacy advised
//             </Typography>
//             <Stack flexWrap={'wrap'} flexDirection="row">
//               <Button
//                 size="small"
//                 sx={{ m: 0.4 }}
//                 variant={selectedPharmacy === 'yes' ? 'contained' : 'outlined'}
//                 onClick={() => {
//                   setSelectedPharmacy('yes');
//                   changePrescriptionValue('isPharmacy', 'Pharmacy Advised');
//                 }}
//               >
//                 Yes
//               </Button>
//               <Button
//                 size="small"
//                 sx={{ m: 0.4 }}
//                 variant={selectedPharmacy === 'no' ? 'contained' : 'outlined'}
//                 onClick={() => {
//                   setSelectedPharmacy('no');
//                   changePrescriptionValue('isPharmacy', 'Not Advised');
//                 }}
//               >
//                 No
//               </Button>
//             </Stack>{' '}
//           </Box>

//           <Box my={1.8}>
//             <Typography color="gray" id="demo-simple-select-label">
//               Follow Up Date
//             </Typography>
//             <TextField
//               inputProps={{ inputProps: { min: new Date() } }}
//               value={prescription.followUp}
//               onChange={(e) =>
//                 changePrescriptionValue('followUp', e.target.value)
//               }
//               fullWidth
//               // label="Follow Up Date"
//               type="date"
//               variant="standard"
//               error={validations.followUp.value}
//               helperText={validations.followUp.message}
//             />
//           </Box>
//           {/* <FormGroup>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={isCaregiver}
//                   onChange={(e) => setIsCaregiver(e.target.checked)}
//                 />
//               }
//               label="Caregiver should receive updates and information."
//             />
//             {isCaregiver && (
//               <>
//                 <TextField
//                   size="small"
//                   sx={{ my: 0.5 }}
//                   value={prescription.caregiver_name}
//                   onChange={(e) =>
//                     changePrescriptionValue('caregiver_name', e.target.value)
//                   }
//                   fullWidth
//                   label="Caregiver Name"
//                 />
//                 <TextField
//                   size="small"
//                   sx={{ my: 0.5 }}
//                   value={prescription.caregiver_phone}
//                   onChange={(e) =>
//                     changePrescriptionValue('caregiver_phone', e.target.value)
//                   }
//                   fullWidth
//                   label="Caregiver Phone"
//                 />
//               </>
//             )}
//           </FormGroup> */}
//           <Box my={1.5}>
//             <Grid container>
//               <Grid item xs={6}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                   <CardContent sx={{ flex: '1 0 auto' }}>
//                     <Typography component="div" variant="subtitle1">
//                       Prescription Image
//                     </Typography>
//                     <Stack spacing={0.5}>
//                       {prescription.image.length < 2 && (
//                         <Button
//                           onClick={() => setOpenCamera(true)}
//                           fullWidth
//                           variant="outlined"
//                           startIcon={prescription.image.length == 0 ? <Camera /> : <AddIcon />}
//                         >
//                           {prescription.image.length == 0 ? "Capture" : "Add More"}
//                         </Button>
//                       )}
//                       {prescription.image.length > 0 && (
//                         <>
//                           <Button
//                             fullWidth
//                             variant="outlined"
//                             startIcon={<Undo />}
//                             onClick={() => (changePrescriptionValue('image', []), setOpenCamera(true))}
//                           >
//                             Retake
//                           </Button>
//                           <Button
//                             fullWidth
//                             variant="outlined"
//                             color="error"
//                             startIcon={<Delete />}
//                             onClick={() =>
//                               changePrescriptionValue('image', [])
//                             }
//                           >
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </Stack>
//                   </CardContent>
//                 </Box>
//               </Grid>
//               {prescription.image.length > 0 ? prescription.image.map((item) => {
//                 return (<>
//                   <Grid item>
//                     <CardMedia
//                       component="img"
//                       sx={{ width: '70px', objectFit: 'contain', height: '70px', display: 'flex', marginLeft: '10px', marginTop: 6 }}
//                       image={item}
//                       alt="Prescription Image"
//                     />
//                   </Grid>
//                 </>)
//               }) :
//                 <>
//                   <Grid item xs={6}>
//                     < CardMedia
//                       component="img"
//                       sx={{ width: '150px', objectFit: 'contain', height: '150px' }}
//                       image='https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png'
//                       alt="Prescription Image"
//                     />
//                   </Grid>
//                 </>

//               }
//             </Grid>
//             <FormHelperText error={validations.image.value}>
//               {validations.image.message}
//             </FormHelperText>
//           </Box>
//           <Box height="20vh">
//             <Button
//               disabled={disableButton}
//               onClick={handelUploadPrescription}
//               variant="contained"
//               fullWidth
//               size="large"
//               startIcon={<Upload />}
//             >
//               {disableButton ? 'Uploading ...' : 'Upload Prescription'}
//             </Button>
//           </Box>
//         </form>
//       </Box>
//       <Box
//         display={openCamera ? 'absolute' : 'none'}
//         sx={{
//           position: 'absolute',
//           height: '100vh',
//           width: '100vw',
//           top: '0px',
//           backgroundColor: 'white',
//           zIndex: 10,
//           left: '0px',
//           overflow: 'hidden'
//         }}
//       >
//         {prescription.image.length < 2 ? (

//           <Webcam
//             style={{ height: '90vh' }}
//             audio={false}
//             screenshotFormat="image/jpeg"
//             ref={camera}
//             videoConstraints={{
//               facingMode: { exact: 'environment' }
//             }}
//           />

//         ) : (
//           <Box>
//             {prescription.image.map((item) => {
//               return (
//                 <div className='d-flex justify-content-between'>
//                   <img
//                     src={item}
//                     style={{ width: '20vw', height: '20vh', margin: '10px' }}
//                     alt="" />
//                 </div>
//               )
//             })}
//           </Box>
//         )}
//         <Box display="flex" justifyContent="space-evenly" alignItems="center">
//           <IconButton onClick={() => changePrescriptionValue('image', [])}>
//             <Undo fontSize="large" />
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               changePrescriptionValue(
//                 'image',
//                 camera.current!.getScreenshot()!
//               );
//             }}
//           >
//             <Camera fontSize="large" />
//           </IconButton>
//           <IconButton onClick={() => setOpenCamera(false)}>
//             {prescription.image === null ? (
//               <Close fontSize="large" />
//             ) : (
//               <Check fontSize="large" />
//             )}
//           </IconButton>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default CreatePrescription;
