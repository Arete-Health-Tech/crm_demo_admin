import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import React, { useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import CancelIcon from '@mui/icons-material/Cancel';
import { CSVFileParser } from '../../../utils/csvFileParser';
import { createServiceHandler } from '../../../api/service/serviceHandler';
import { iService } from '../../../types/store/service';

type Props = {};

const BulkServiceUpload = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [filename, setFileName] = useState<File | undefined | null>();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '1rem',
    borderWidth: 0,
    p: 4
  };

  const serviceMasterParser = async () => {
    if (!filename) {
      setMessage('Please Select a File to upload');
    } else {
      setMessage('Please Wait Parsing CSV file');
      const data = await CSVFileParser(filename);

      const uploadData = data.map((item: iService) => {
        return {
          name: item.name,
          serviceId: item.serviceId,
          department: item.department,
          departmentType: item.departmentType,
          tag: item.tag,
          opd_one: +item.opd_one,
          ip_one: +item.ipd_one,
          four_one: +item.four_one,
          twin_one: +item.twin_one,
          single_one: +item.single_one,
          deluxe_one: +item.deluxe_one,
          vip_one: +item.vip_one,
          // opd_two: +item.opd_two,
          // ip_two: +item.ipd_two,
          // four_two: +item.four_two,
          // twin_two: +item.twin_two,
          // single_two: +item.single_two,
          // deluxe_two: +item.deluxe_two,
          // vip_two: +item.vip_two
        };
      });
      await createServiceHandler(uploadData);
      setMessage('File Uploaded Please Close the Window');
    }
  };

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFileName((prev) => {
      prev = (e.target as HTMLInputElement).files![0];
      return prev;
    });
  };

  return (
    <>
      <Box>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenModal(true)}
        >
          <UploadIcon />
          Upload Service Master
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack padding={3} sx={style} spacing={3}>
          <Typography marginY={3} variant="h5" fontWeight={600}>
            Upload Service in Bulk
          </Typography>
          <Box
            sx={{
              border: 'dashed 1px black',
              borderRadius: '1rem',
              position: 'relative',

              background: '#f0f0f0',
              '&:hover': {
                backgroundColor: '#EFFAF5'
              }
            }}
          >
            <Box position="absolute" width="100%" height="100%" p={3}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <UploadIcon />
                <Typography>Bulk Upload Service Master</Typography>
              </Box>

              <Typography fontSize="10px" textAlign="center">
                only .csv file is supported
              </Typography>
            </Box>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{
                width: '100%',
                height: '150px',
                cursor: 'pointer',
                opacity: '0'
              }}
            />

            <Box
              p={1}
              display={`${filename === undefined ? 'none' : 'flex'}`}
              justifyContent="space-between"
              alignItems="center"
              sx={{
                background: '#f5f5f5',
                borderRadius: '15px'
              }}
              margin={2}
            >
              <Typography fontSize={14}>{filename?.name!}</Typography>
              <IconButton
                color="inherit"
                aria-label="delete file"
                component="label"
                onClick={() => {
                  setFileName(undefined);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {message.length > 0 && (
            <Alert severity="success" color="info">
              {message}
            </Alert>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={serviceMasterParser}
          >
            <UploadIcon />
            Bulk Upload
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default BulkServiceUpload;
