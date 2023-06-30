import { AddCircleOutlineOutlined } from '@mui/icons-material';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { createStageHandler } from '../../../api/stages/stagesHandler';
import useServiceStore from '../../../store/serviceStore';
import { iStage } from '../../../types/store/service';

type Props = {};

const AddStage = (props: Props) => {
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

  const { stages } = useServiceStore();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<Stage>({
    name: '',
    code: 0,
    description: '',
    parent: '',
    child: []
  });

  type Stage = Omit<iStage, '_id'>;

  const handleAddStage = async () => {
    await createStageHandler(stage);
    console.log(stage);
    setMessage('Stage Added');
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenModal(true)}
        endIcon={<AddCircleOutlineOutlined />}
      >
        Add New
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack padding={3} sx={style} spacing={3}>
          <Typography marginY={3} variant="h5" fontWeight={600}>
            Add Stage
          </Typography>
          <TextField
            fullWidth
            label="Stage Name"
            onChange={(e) => setStage({ ...stage, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Stage Code"
            onChange={(e) => setStage({ ...stage, code: +e.target.value })}
          />
          <TextField
            fullWidth
            label="Stage Description"
            onChange={(e) =>
              setStage({ ...stage, description: e.target.value })
            }
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Parent</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Parent"
              value={stage.parent}
              onChange={(e) => {
                e.target.value !== 'null'
                  ? setStage({ ...stage, parent: e.target.value })
                  : setStage({ ...stage, parent: null });
              }}
            >
              <MenuItem value="null">None</MenuItem>
              {stages.map(
                (item) =>
                  item.parent === null && (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          {message.length > 0 && <Alert>{message}</Alert>}
          <Button
            onClick={handleAddStage}
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

export default AddStage;
