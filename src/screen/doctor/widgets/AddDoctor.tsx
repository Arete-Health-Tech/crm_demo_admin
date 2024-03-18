import {
  Alert,
  Autocomplete,
  Button,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import useServiceStore from '../../../store/serviceStore';
import { createNewDoctorHandler } from '../../../api/doctor/doctorHandler';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '1rem',
  borderWidth: 0,
  p: 4
};

interface DoctorType {
  name: string;
  department: string[];
}

const AddDoctor = () => {
  const { departments } = useServiceStore();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [newDoctor, setNewDoctor] = useState<DoctorType>({
    name: '',
    department: []
  });

  const addNewDoctor = async () => {
    newDoctor.name = `Dr.${newDoctor.name}`;
    await createNewDoctorHandler(newDoctor);
    setMessage('Doctor Added To System');
    // console.log(newDoctor);
    setTimeout(() => {
      setMessage('');
    }, 2000);
    setNewDoctor({
      name: '',
      department: []
    });
    setOpenModal(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
        Add New
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack padding={3} sx={style} spacing={3}>
          <Typography marginY={3} variant="h5" fontWeight={600}>
            Add New Doctor
          </Typography>
          <TextField
            value={newDoctor.name}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, name: e.target.value })
            }
            fullWidth
            label="Doctor Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Dr.</InputAdornment>
              )
            }}
          />

          <Autocomplete
            sx={{ textTransform: 'uppercase' }}
            options={departments}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setNewDoctor({
                ...newDoctor,
                department: [value?._id as string]
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ textTransform: 'capitalize' }}
                value={newDoctor.department[0]}
                label="Search & Select Department "
                InputProps={{
                  ...params.InputProps,
                  type: 'search'
                }}
              />
            )}
          />

          {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Departments
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Departments"
              value={newDoctor.department}
              onChange={(e) =>
                setNewDoctor({
                  ...newDoctor,
                  department: e.target.value as string[]
                })
              }
            >
              <MenuItem value={''}>None</MenuItem>
              {departments.map((department: iDepartment) => {
                return (
                  <MenuItem key={department._id} value={department._id}>
                    {department.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl> */}
          {message.length > 0 && <Alert>{message}</Alert>}
          <Button
            onClick={addNewDoctor}
            color="success"
            fullWidth
            variant="contained"
          >
            Add
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default AddDoctor;
