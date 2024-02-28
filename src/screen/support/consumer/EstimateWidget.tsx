import {
  AddCircle,
  ArrowBack,
  FilePresentOutlined,
  PictureAsPdf,
  RemoveRedEye,
  SendOutlined
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createEstimateHandler } from '../../../api/estimate/estimateHandler';
import { getAllServicesHandler } from '../../../api/service/serviceHandler';
import { getWardsHandler } from '../../../api/ward/wardHandler';
import useServiceStore from '../../../store/serviceStore';
import useTicketStore from '../../../store/ticketStore';
import {
  iDoctor,
  iService,
  IWard,
  serviceAdded
} from '../../../types/store/service';
import { iEstimate } from '../../../types/store/ticket';

type Props = {};

const EstimateWidget = (props: Props) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const { tickets } = useTicketStore();
  const { ticketID } = useParams();
  const ticket = tickets.find((element) => element._id === ticketID);

  useEffect(() => {
    (async function () {
      await getAllServicesHandler(pageNumber, 50);
      await getWardsHandler();
    })();
  }, []);

  const [estimateFileds, setEstimateFields] = useState<iEstimate>({
    type: 1,
    isEmergency: false,
    wardDays: 0,
    icuDays: 0,
    ward: '',
    paymentType: 0,
    insuranceCompany: '',
    insurancePolicyNumber: 0,
    insurancePolicyAmount: 0,
    service: [],
    // investigation: [],
    // procedure: [],
    mrd: 0,
    pharmacy: 0,
    pathology: 0,
    equipmentAmount: 0,
    diet: 0,
    admission: 0,
    prescription: ticket?.prescription[0]._id!,
    ticket: ticketID!
  });

  type AlertType = {
    services: string;
    procedure: string;
    investigation: string;
  };

  const [serviceObject, setServiceObject] = useState<serviceAdded>({
    id: '',
    isSameSite: false
  });
  const [procedure, setProcedure] = useState<string>();
  const [investigation, setInvestigation] = useState('');
  const [clickedIndex, setClickedIndex] = useState<number | undefined>();
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const { allServices, wards, doctors } = useServiceStore();

  const [alert, setAlert] = useState<AlertType>({
    investigation: '',
    procedure: '',
    services: ''
  });

  const wardICUSetter = (id: string) => {
    return wards.find((ward: IWard) => ward._id === id)?.name;
  };

  const doctorSetter = (id: string) => {
    return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleServiceType = (e: number) => {
    setClickedIndex(e);
    setEstimateFields({ ...estimateFileds, type: e });
  };

  // const addInvestigation = () => {
  //   if (investigation) {
  //     setAlert({ ...alert, investigation: '' });
  //     setEstimateFields({
  //       ...estimateFileds,
  //       investigation: [...estimateFileds.investigation, investigation]
  //     });
  //     setInvestigation('');
  //   } else {
  //     setAlert({
  //       ...alert,
  //       investigation: 'Please Select a Valid Investigation'
  //     });
  //   }
  // };

  // const addProcedure = () => {
  //   if (procedure) {
  //     setAlert({ ...alert, procedure: '' });
  //     setEstimateFields({
  //       ...estimateFileds,
  //       procedure: [...estimateFileds.procedure, procedure]
  //     });
  //     setProcedure('');
  //   } else {
  //     setAlert({
  //       ...alert,
  //       procedure: 'Please Select a Valid Procedure'
  //     });
  //   }
  // };

  const addServiceToArray = () => {
    if (serviceObject.id) {
      setAlert({
        ...alert,
        services: ''
      });
      setEstimateFields({
        ...estimateFileds,
        service: [...estimateFileds.service, serviceObject]
      });
      setServiceObject({
        id: '',
        isSameSite: false
      });
    } else {
      setAlert({
        ...alert,
        services: 'Please Select a Valid Services'
      });
    }
  };

  const deleteService = (index: number) => {
    estimateFileds.service.splice(index, 1);

    setEstimateFields({ ...estimateFileds, service: estimateFileds.service });
  };

  // const deleteProcedure = (index: number) => {
  //   estimateFileds.procedure.splice(index, 1);
  //   setEstimateFields({
  //     ...estimateFileds,
  //     procedure: estimateFileds.procedure
  //   });
  // };

  // const deleteInvestigation = (index: number) => {
  //   estimateFileds.investigation.splice(index, 1);
  //   setEstimateFields({
  //     ...estimateFileds,
  //     investigation: estimateFileds.investigation
  //   });
  // };

  const serviceGetter = (id: string | undefined) => {
    return allServices.services.find((service: iService) => service._id === id)
      ?.name;
  };

  const handleCreateEstimate = () => {
  
    createEstimateHandler(estimateFileds);
   
  };

  return (
    <Stack position="relative">
      <Box position="static" sx={{ offsetDistance: '10vh' }}>
        <img src={ticket?.prescription[0].image} alt="prescription" />
      </Box>
      {/* create estimate comp */}
      <Box display={!isPreview ? 'block' : 'none'} bgcolor="#f1f5f7" p={1}>
        <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Select Service Type
          </Typography>
          <Stack direction="row" spacing={2}>
            {[
              { name: 'Package', value: 0 },
              { name: 'Non Package', value: 1 }
            ].map((item: any, index: number) => {
              return (
                <Chip
                  key={index}
                  label={item.name}
                  color="primary"
                  variant={clickedIndex === item.value ? 'filled' : 'outlined'}
                  onClick={() => handleServiceType(item.value)}
                />
              );
            })}
          </Stack>
        </Box>
        {estimateFileds.type === 1 && (
          <Box my={1} bgcolor="white" borderRadius={3} p={1}>
            <Typography fontWeight={500} my={1}>
              Ward Details
            </Typography>
            <Box mb={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">ICU Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="ICU Type"
                  value={estimateFileds.ward}
                  onChange={(e) => {
                    setEstimateFields({
                      ...estimateFileds,
                      ward: e.target.value
                    });
                  }}
                >
                  {wards
                    .filter((ward: IWard) => ward.type === 1)
                    .map((item: IWard, index: number) => {
                      return <MenuItem value={item._id}>{item.name}</MenuItem>;
                    })}
                </Select>
              </FormControl>
            </Box>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Ward Days"
                required
                size="small"
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    wardDays: +e.target.value
                  });
                }}
                placeholder="5"
                sx={{ borderRadius: 40 }}
              />
              <TextField
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    icuDays: +e.target.value
                  });
                }}
                label="ICU Days"
                required
                size="small"
                placeholder="5"
                sx={{ borderRadius: 40 }}
              />
            </Stack>
          </Box>
        )}

        <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Emergency Details
          </Typography>
          <Stack direction="row" spacing={2} my={1}>
            <FormControl required>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Is Emergency Admission
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    isEmergency: e.target.value === 'true' ? true : false
                  });
                }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Box>
        <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Insurance Details (optional)
          </Typography>

          <Stack direction="row" spacing={2} my={1}>
            <FormControl required>
              <FormLabel id="payment-type">Preferred Payment Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="payment-type"
                name="payment-type"
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    paymentType: +e.target.value
                  });
                }}
              >
                <FormControlLabel value="0" control={<Radio />} label="Cash" />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Insurance"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="CGHS/ECHS"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
          {estimateFileds.paymentType === 1 && (
            <Stack spacing={2}>
              <TextField
                label="Insurance Company Name"
                size="small"
                placeholder="eg: Birla Sun Life Insurance"
                sx={{ borderRadius: 40 }}
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    insuranceCompany: e.target.value
                  });
                }}
              />
              <TextField
                label="Policy Number"
                size="small"
                placeholder="eg: XXX-XXXXX-XXXX"
                sx={{ borderRadius: 40 }}
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    insurancePolicyNumber: Number(e.target.value)
                  });
                }}
              />
              <TextField
                label="Policy Amount"
                size="small"
                placeholder="eg: 500000"
                sx={{ borderRadius: 40 }}
                onChange={(e) => {
                  setEstimateFields({
                    ...estimateFileds,
                    insurancePolicyAmount: +e.target.value
                  });
                }}
              />
            </Stack>
          )}
        </Box>
        <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Services Details
          </Typography>
          <Stack spacing={2}>
            <Autocomplete
              fullWidth
              aria-required={true}
              options={allServices.services}
              onChange={(event, value) =>
                setServiceObject({ ...serviceObject, id: value?._id })
              }
              id="combo-box-demo"
              getOptionLabel={(option: iService) => option.name}
              sx={{ textTransform: 'capitalize' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ textTransform: 'capitalize' }}
                  label="Select Surgery"
                />
              )}
            />
            <FormControl required>
              <FormLabel id="payment-type">Is On Same Site</FormLabel>
              <RadioGroup
                row
                aria-labelledby="is-same-site"
                name="isSameSite"
                onChange={(e) => {
                  setServiceObject({
                    ...serviceObject,
                    isSameSite: e.target.value === '0' ? true : false
                  });
                }}
              >
                <FormControlLabel value="0" control={<Radio />} label="Yes" />
                <FormControlLabel value="1" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <Button endIcon={<AddCircle />} onClick={addServiceToArray}>
              Add Service
            </Button>
          </Stack>
          {estimateFileds.service.length > 0 && (
            <Stack
              my={1}
              display="grid "
              gridTemplateColumns="repeat(3,1fr)"
              gap={1}
            >
              {estimateFileds.service.map((item, index: number) => (
                <Chip
                  color="primary"
                  label={`${serviceGetter(item.id)}/ ${
                    item.isSameSite ? 'Same Site' : 'Different Site'
                  }`}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                  onDelete={() => deleteService(index)}
                />
              ))}
            </Stack>
          )}
          {alert?.services.length > 0 && (
            <Stack my={1} width="50%">
              <Alert variant="outlined" severity="warning">
                {alert?.services}
              </Alert>
            </Stack>
          )}
        </Box>
        {/* <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Investigation(optional)
          </Typography>
          <Stack spacing={2}>
            <Autocomplete
              aria-required={true}
              options={allServices.services}
              onChange={(event, value) => setInvestigation(value?._id!)}
              id="combo-box-demo"
              getOptionLabel={(option: iService) => option.name}
              sx={{ textTransform: 'capitalize' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ textTransform: 'capitalize' }}
                  label="Select Investigation"
                />
              )}
            />
            <Button endIcon={<AddCircle />} onClick={addInvestigation}>
              Add Investigation
            </Button>
          </Stack>
          {alert?.investigation.length > 0 && (
            <Stack my={1} width="50%">
              <Alert variant="outlined" severity="warning">
                {alert?.investigation}
              </Alert>
            </Stack>
          )}
          {estimateFileds.investigation?.length > 0 && (
            <Stack
              my={1}
              display="grid "
              gridTemplateColumns="repeat(3,1fr)"
              gap={1}
            >
              {estimateFileds.investigation.map((item, index: number) => (
                <Chip
                  color="primary"
                  label={`${serviceGetter(item)}`}
                  variant="outlined"
                  onDelete={() => deleteInvestigation(index)}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
          )} */}

        {/* <Stack my={1} spacing={2}>
            <TextField
              label="Investigation Charges"
              size="small"
              placeholder="eg:5000"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  investigationAmount: +e.target.value
                });
              }}
            />
          </Stack> */}
        {/* </Box> */}
        {/* <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Procedure(optional)
          </Typography>
          <Stack spacing={2}>
            <Autocomplete
              fullWidth
              aria-required={true}
              options={allServices.services}
              onChange={(event, value) => setProcedure(value?._id!)}
              id="combo-box-demo"
              getOptionLabel={(option: iService) => option.name}
              sx={{ textTransform: 'capitalize' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ textTransform: 'capitalize' }}
                  label="Select Procedure"
                />
              )}
            />
            <Button onClick={addProcedure} endIcon={<AddCircle />}>
              Add Procedure
            </Button>
          </Stack>
          {estimateFileds.procedure.length > 0 && (
            <Stack
              my={1}
              display="grid "
              gridTemplateColumns="repeat(3,1fr)"
              gap={1}
            >
              {estimateFileds.procedure.map((item, index: number) => (
                <Chip
                  color="primary"
                  label={`${serviceGetter(item)}`}
                  variant="outlined"
                  onDelete={() => deleteProcedure(index)}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
          )}
          {alert.procedure.length > 0 && (
            <Stack my={1} width="50%">
              <Alert variant="outlined" severity="warning">
                {alert.procedure}
              </Alert>
            </Stack>
          )}

          <Stack my={1} direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Procedure Charges"
              size="small"
              placeholder="eg:5000"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  procedureAmount: +e.target.value
                });
              }}
            />
          </Stack>
        </Box> */}
        <Box my={1} bgcolor="white" borderRadius={3} p={1}>
          <Typography fontWeight={500} my={1}>
            Other Charges(optional)
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Mrd Amount"
              size="small"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  mrd: +e.target.value
                });
              }}
              placeholder="eg: 500000"
            />
            <TextField
              fullWidth
              label="Pharmacy Amount"
              size="small"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  pharmacy: +e.target.value
                });
              }}
              placeholder="eg: 500000"
            />
            <TextField
              fullWidth
              label="Pathology Amount"
              size="small"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  pathology: +e.target.value
                });
              }}
              placeholder="eg: 500000"
            />
            <TextField
              fullWidth
              label="Equipment Amount"
              size="small"
              placeholder="eg: 500000"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  equipmentAmount: +e.target.value
                });
              }}
            />
          </Stack>
          <Stack my={1} direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Blood Amount"
              size="small"
              placeholder="eg: 500000"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  diet: +e.target.value
                });
              }}
            />
            <TextField
              fullWidth
              label="Miscellenous Charges"
              size="small"
              placeholder="eg: 500000"
              onChange={(e) => {
                setEstimateFields({
                  ...estimateFileds,
                  admission: +e.target.value
                });
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Preview Component  */}

      <Box bgcolor="#f1f5f7" p={1} display={isPreview ? 'block' : 'none'}>
        <Stack my={1} bgcolor="white" p={1} borderRadius={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">
              <PictureAsPdf />
              Preview Estimate
            </Typography>

            <Button onClick={handleCreateEstimate} endIcon={<SendOutlined />}>
              Send Estimate
            </Button>
          </Box>

          <Stack
            direction="row"
            spacing={4}
            my={1}
            p={1}
            borderRadius={2}
            bgcolor="#f1f1f1"
          >
            <Box>
              <Typography
                textTransform="capitalize"
                variant="body1"
                fontWeight={500}
              >
                {ticket?.consumer[0].firstName +
                  ' ' +
                  ticket?.consumer[0].lastName}
              </Typography>
              <Typography>#{ticket?.consumer[0].uid}</Typography>
              <Typography textTransform="capitalize">
                Dr. {doctorSetter(ticket?.prescription[0].doctor!)}
              </Typography>
            </Box>
            <Box>
              <Typography>
                <FilePresentOutlined />
                {ticket?.prescription[0].symptoms}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack my={1} bgcolor="white" p={1} borderRadius={2}>
          <Stack
            direction="row"
            spacing={4}
            my={1}
            p={1}
            borderRadius={2}
            bgcolor="#f1f1f1"
          >
            <Box>
              <Typography variant="caption" fontWeight={500}>
                Package Type{' '}
                <Chip
                  size="small"
                  variant="outlined"
                  color="primary"
                  label={
                    estimateFileds.type === 0 ? 'Packaged' : 'Non Pacakage'
                  }
                />
              </Typography>
              {estimateFileds.type === 1 && (
                <Stack my={1}>
                  <Typography variant="caption" fontWeight={500}>
                    Ward Details
                  </Typography>
                  <Typography variant="caption">
                    ICU Type: {wardICUSetter(estimateFileds.ward)}
                  </Typography>
                  <Typography variant="caption">
                    ICU Days: {estimateFileds.icuDays}
                  </Typography>
                  <Typography variant="caption">
                    Ward Days: {estimateFileds.icuDays}
                  </Typography>
                </Stack>
              )}
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={500}>
                Payment Type :{' '}
                {estimateFileds.paymentType === 0
                  ? 'Cash'
                  : estimateFileds.paymentType === 1
                  ? 'Insurance'
                  : 'CGHS | ECHS'}
              </Typography>

              {estimateFileds.paymentType === 1 && (
                <Stack my={1}>
                  <Typography variant="caption" fontWeight={500}>
                    Insurance Details
                  </Typography>
                  <Typography variant="caption">
                    Insurance Comapny: {estimateFileds.insuranceCompany}
                  </Typography>
                  <Typography variant="caption">
                    Policy Number: {estimateFileds.insurancePolicyNumber}
                  </Typography>
                  <Typography variant="caption">
                    Policy Amount: {estimateFileds.insurancePolicyAmount}
                  </Typography>
                </Stack>
              )}
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={500}>
                Emergency Details{' '}
                <Chip
                  color="primary"
                  size="small"
                  variant="outlined"
                  label={
                    estimateFileds.isEmergency === true
                      ? 'Emergency Case'
                      : 'Not Emergency'
                  }
                />
              </Typography>
            </Box>
          </Stack>
          <Stack my={1} p={1} borderRadius={2} bgcolor="#f1f1f1">
            <Typography variant="body2" fontWeight={500}>
              Services Details
            </Typography>
            <Box my={1}>
              {estimateFileds.service.length > 0 ? (
                estimateFileds.service.map((item, index: number) => (
                  <Chip
                    size="small"
                    color="primary"
                    label={`${serviceGetter(item.id)}/ ${
                      item.isSameSite ? 'Same Site' : 'Different Site'
                    }`}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize', mx: 1 }}
                  />
                ))
              ) : (
                <Alert severity="warning" sx={{ width: '50%' }}>
                  {' '}
                  Required Field Please Select a Service
                </Alert>
              )}
            </Box>
            {/* <Typography variant="body2" fontWeight={500}>
              Investigation Details
            </Typography> */}
            {/* <Box my={1}>
              {estimateFileds.investigation.length > 0 ? (
                estimateFileds.investigation.map((item, index: number) => (
                  <Chip
                    size="small"
                    color="primary"
                    label={`${serviceGetter(item)}`}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize', mx: 1 }}
                  />
                ))
              ) : (
                <Typography variant="caption">
                  No Investigation Selected
                </Typography>
              )} */}
              {/* <Stack my-={1}>
                <Typography fontWeight={500} variant="caption">
                  Investigation Amount : {estimateFileds.investigationAmount}
                </Typography>
              </Stack> */}
            {/* </Box> */}
            {/* <Typography variant="body2" fontWeight={500}>
              Procedure Details
            </Typography> */}
            {/* <Box my={1}> */}
            {/* {estimateFileds.procedure.length > 0 ? (
                estimateFileds.procedure.map((item, index: number) => (
                  <Chip
                    size="small"
                    color="primary"
                    label={`${serviceGetter(item)}`}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize', mx: 1 }}
                  />
                ))
              ) : (
                <Typography variant="caption">No Procedure Selected</Typography>
              )} */}
            {/* <Stack my-={1}>
                <Typography fontWeight={500} variant="caption">
                  Procedure Amount : {estimateFileds.procedureAmount}
                </Typography>
              </Stack> */}
            {/* </Box> */}
          </Stack>
          <Stack my={1} p={1} borderRadius={2} bgcolor="#f1f1f1">
            <Typography variant="body2" fontWeight={500}>
              Other Charges
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="caption" fontWeight={500}>
                Mrd Amount : {estimateFileds.mrd}
              </Typography>
              <Typography variant="caption" fontWeight={500}>
                Pharmacy Amount : {estimateFileds.pharmacy}
              </Typography>
              <Typography variant="caption" fontWeight={500}>
                Pathology Amount : {estimateFileds.pathology}
              </Typography>
              <Typography variant="caption" fontWeight={500}>
                Equipment Amount : {estimateFileds.equipmentAmount}
              </Typography>
              <Typography variant="caption" fontWeight={500}>
                Diet Amount : {estimateFileds.diet}
              </Typography>
              <Typography variant="caption" fontWeight={500}>
                Admission Amount : {estimateFileds.admission}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box height="20vh" p={1}>
        <Button
          fullWidth
          variant="contained"
          endIcon={!isPreview ? <RemoveRedEye /> : <ArrowBack />}
          onClick={handlePreview}
        >
          {!isPreview ? 'Preview Estimate' : 'Back To Editor'}
        </Button>
      </Box>
    </Stack>
  );
};

export default EstimateWidget;
