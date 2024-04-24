import React, { useState, useRef, WheelEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Drawer } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import FileSaver from 'file-saver';

interface Props {
  image: string;
  image1: string;
}

const ShowPrescription = ({ image, image1 }: Props) => {
  const [open, setOpen] = React.useState(false);
  // const [scale, setScale] = useState(1);
  // const [scale1, setScale1] = useState(1);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const drawerWidth = 1300;

  const downloadPrescription = () => {
    FileSaver.saveAs(image, 'prescription_img.jpg');
    FileSaver.saveAs(image1, 'prescription_img.jpg');
  };




  const [isHovering, setIsHovering] = useState(false);
  const [bgPos, setBgPos] = useState('0% 0%');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!resultRef.current) return;
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / img.clientWidth) * 100;
    const y = ((event.clientY - rect.top) / img.clientHeight) * 100;

    setBgPos(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };




  const [isHovering1, setIsHovering1] = useState(false);
  const [bgPos1, setBgPos1] = useState('0% 0%');
  const resultRef1 = useRef<HTMLDivElement>(null);

  const handleMouseMove1 = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!resultRef.current) return;
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / img.clientWidth) * 100;
    const y = ((event.clientY - rect.top) / img.clientHeight) * 100;

    setBgPos1(`${x}% ${y}%`);
  };

  const handleMouseEnter1 = () => {
    setIsHovering1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovering1(false);
  };







  // const handleWheel = (event: WheelEvent<HTMLImageElement>) => {
  //   event.preventDefault(); // Prevent the page from scrolling
  //   const newScale = scale + event.deltaY * -0.01; // Adjust scale factor here
  //   // Set limits for scale
  //   setScale(Math.min(Math.max(1, newScale), 3)); // Limits scaling between 1 and 3
  // };
  // const handleWheel1 = (event: WheelEvent<HTMLImageElement>) => {
  //   event.preventDefault(); // Prevent the page from scrolling
  //   const newScale = scale1 + event.deltaY * -0.01; // Adjust scale factor here
  //   // Set limits for scale
  //   setScale1(Math.min(Math.max(1, newScale), 3)); // Limits scaling between 1 and 3
  // };

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
        <Box style={{
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {/* {image ? (
            <img src={image} alt="Prescription" width="600vw" height="auto"
              style={{
                transition: 'transform 0.2s',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',// Ensures zooming happens from the center
                zIndex: 99999
              }}
              onWheel={handleWheel} />
          ) : (
            'Loading...'
          )}
          {image1 && (
            <img src={image1} alt="Prescription1" width="600vw" height="auto"
              style={{
                transition: 'transform 0.2s',
                transform: `scale(${scale1})`,
                transformOrigin: 'center center', // Ensures zooming happens from the center
                zIndex: 99999
              }}
              onWheel={handleWheel1} />
          )} */}

          {/* first image */}

          <div className="img-zoom-container" style={{ position: 'relative' }}>
            <img
              src={image} // Change to your actual image URL
              alt="Zoomable"
              width="600"
              height="480"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                width: '600px',
                height: '480px',
                display: isHovering1 ? 'none' : 'block'
              }}
            />
          </div>
          <div
            ref={resultRef}
            style={{
              display: isHovering ? 'block' : 'none',
              // position: 'absolute',
              border: '1px solid #d4d4d4',
              width: '600px',
              height: '480px',
              overflow: 'hidden',
              zIndex: 9999,
              top: '0',
              left: '0',
              backgroundImage: `url(${image})`, // Same as the image above
              backgroundSize: '1200px 960px', // Double the size of the original image for zoom
              backgroundPosition: bgPos,
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* second image */}
          <div
            ref={resultRef1}
            style={{
              display: isHovering1 && image1 ? 'block' : 'none',
              // position: 'absolute',
              border: '1px solid #d4d4d4',
              width: '600px',
              height: '480px',
              overflow: 'hidden',
              zIndex: 9999,
              top: '0',
              left: '0',
              backgroundImage: `url(${image1})`, // Same as the image above
              backgroundSize: '1200px 960px', // Double the size of the original image for zoom
              backgroundPosition: bgPos1,
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="img-zoom-container" style={{ position: 'relative' }}>
            {image1 && <img
              src={image1} // Change to your actual image URL\
              alt="Zoomable"
              width="600"
              height="480"
              onMouseMove={handleMouseMove1}
              onMouseEnter={handleMouseEnter1}
              onMouseLeave={handleMouseLeave1}
              style={{
                width: '600px',
                height: '480px',
                display: isHovering ? 'none' : 'block'
              }}
            />}
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default ShowPrescription;
