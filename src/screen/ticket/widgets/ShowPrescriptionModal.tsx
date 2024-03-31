import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Drawer } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import FileSaver from 'file-saver';

interface Props {
  image: string;
}

const ShowPrescription = ({ image }: Props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const drawerWidth = 600;

  const downloadPrescription = () => {
    FileSaver.saveAs(image, 'prescription_img.jpg');
  };

  return (
    <div>
      <Button onClick={handleOpen}>View Prescription</Button>
      <Drawer
        sx={{
          position: 'relative',
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        anchor="right"
        open={open}
        onClose={handleClose}
      >
        <Box
          position="sticky"
          top={0}
          bgcolor="white"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          p={2}
          borderColor="#f5f5f5"
        >
          <Typography variant="h6">Prescription Captured</Typography>
          <Button
            onClick={downloadPrescription}
            sx={{ textTransform: 'capitalize' }}
            color="success"
            endIcon={<DownloadOutlined />}
          >
            Download Prescription
          </Button>
        </Box>
        <Box>
          {image ? (
            <img src={image} alt="Prescription" width="100%" />
          ) : (
            'Loading...'
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default ShowPrescription;
