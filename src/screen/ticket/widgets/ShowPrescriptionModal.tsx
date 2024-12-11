// import React, { useState, useRef, WheelEvent } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// import { Drawer, Stack } from '@mui/material';
// import { DownloadOutlined } from '@mui/icons-material';
// import FileSaver from 'file-saver';
// import "../singleTicket.css";
// import DocumentDownload from "../../../assets/document-download.svg"

// interface Props {
//   image: string;
//   image1: string;
// }

// const ShowPrescription = ({ image, image1 }: Props) => {
//   const [open, setOpen] = React.useState(false);
//   // const [scale, setScale] = useState(1);
//   // const [scale1, setScale1] = useState(1);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const drawerWidth = 'auto';

//   const downloadPrescription = () => {
//     FileSaver.saveAs(image, 'prescription_img.jpg');
//     FileSaver.saveAs(image1, 'prescription_img.jpg');
//   };

//   const [isHovering, setIsHovering] = useState(false);
//   const [bgPos, setBgPos] = useState('0% 0%');
//   const resultRef = useRef<HTMLDivElement>(null);

//   const handleMouseMove = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
//     if (!resultRef.current) return;
//     const img = event.currentTarget;
//     const rect = img.getBoundingClientRect();
//     const x = ((event.clientX - rect.left) / img.clientWidth) * 100;
//     const y = ((event.clientY - rect.top) / img.clientHeight) * 100;

//     setBgPos(`${x}% ${y}%`);
//   };

//   const handleMouseEnter = () => {
//     setIsHovering(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovering(false);
//   };

//   const [isHovering1, setIsHovering1] = useState(false);
//   const [bgPos1, setBgPos1] = useState('0% 0%');
//   const resultRef1 = useRef<HTMLDivElement>(null);

//   const handleMouseMove1 = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
//     if (!resultRef.current) return;
//     const img = event.currentTarget;
//     const rect = img.getBoundingClientRect();
//     const x = ((event.clientX - rect.left) / img.clientWidth) * 100;
//     const y = ((event.clientY - rect.top) / img.clientHeight) * 100;

//     setBgPos1(`${x}% ${y}%`);
//   };

//   const handleMouseEnter1 = () => {
//     setIsHovering1(true);
//   };

//   const handleMouseLeave1 = () => {
//     setIsHovering1(false);
//   };

//   // const handleWheel = (event: WheelEvent<HTMLImageElement>) => {
//   //   event.preventDefault(); // Prevent the page from scrolling
//   //   const newScale = scale + event.deltaY * -0.01; // Adjust scale factor here
//   //   // Set limits for scale
//   //   setScale(Math.min(Math.max(1, newScale), 3)); // Limits scaling between 1 and 3
//   // };
//   // const handleWheel1 = (event: WheelEvent<HTMLImageElement>) => {
//   //   event.preventDefault(); // Prevent the page from scrolling
//   //   const newScale = scale1 + event.deltaY * -0.01; // Adjust scale factor here
//   //   // Set limits for scale
//   //   setScale1(Math.min(Math.max(1, newScale), 3)); // Limits scaling between 1 and 3
//   // };

//   return (
//     <div>
//       <Stack className="prescription-link" onClick={handleOpen}>View Prescription</Stack>
//       <Drawer
//         sx={{
//           position: 'relative',
//           display: { xs: 'none', sm: 'block' },
//           '& .MuiDrawer-paper': {
//             boxSizing: 'border-box',
//             width: drawerWidth,
//             borderTopLeftRadius: "15px",
//             borderBottomLeftRadius: "15px"
//           }
//         }}
//         anchor="right"
//         open={open}
//         onClose={handleClose}
//       >
//         <Box
//           position="sticky"
//           top={0}
//           bgcolor="white"
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           borderBottom={1}
//           p={1}
//           borderColor="#f5f5f5"
//         >
//           <Stack className='viewprescription-heading'>View Prescription</Stack>
//           {/* <Button
//             onClick={downloadPrescription}
//             sx={{ textTransform: 'capitalize' }}
//             color="success"
//             endIcon={<DownloadOutlined />}
//           >
//             Download Prescription
//           </Button> */}
//           <Stack className='Download-Icon'
//             onClick={downloadPrescription}
//           ><img src={DocumentDownload} /></Stack>
//         </Box>
//         <Box style={{
//           display: 'flex',
//           borderRadius: "20px",
//           justifyContent: image1 ? 'space-around' : 'end',
//           marginRight: image1 ? 0 : 10,

//         }}>
//           {/* {image ? (
//             <img src={image} alt="Prescription" width="600vw" height="auto"
//               style={{
//                 transition: 'transform 0.2s',
//                 transform: `scale(${scale})`,
//                 transformOrigin: 'center center',// Ensures zooming happens from the center
//                 zIndex: 99999
//               }}
//               onWheel={handleWheel} />
//           ) : (
//             'Loading...'
//           )}
//           {image1 && (
//             <img src={image1} alt="Prescription1" width="600vw" height="auto"
//               style={{
//                 transition: 'transform 0.2s',
//                 transform: `scale(${scale1})`,
//                 transformOrigin: 'center center', // Ensures zooming happens from the center
//                 zIndex: 99999
//               }}
//               onWheel={handleWheel1} />
//           )} */}

//           {/* first image */}

//           {image1 ?
//             <>
//               <div className="img-zoom-container">
//                 <img
//                   src={image} // Change to your actual image URL
//                   alt="Zoomable"
//                   width="600"
//                   height="90vh"
//                   onMouseMove={handleMouseMove}
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}
//                   style={{
//                     width: '600px',
//                     height: '90vh',
//                     display: isHovering1 ? 'none' : 'block',
//                     margin: 10
//                   }}
//                 />
//               </div>
//               <div
//                 ref={resultRef}
//                 style={{
//                   display: isHovering ? 'block' : 'none',
//                   // position: 'absolute',
//                   border: '1px solid #d4d4d4',
//                   width: '600px',
//                   height: '90vh',
//                   overflow: 'hidden',
//                   zIndex: 9999,
//                   backgroundImage: `url(${image})`, // Same as the image above
//                   backgroundSize: '1200px 960px', // Double the size of the original image for zoom
//                   backgroundPosition: bgPos,
//                   backgroundRepeat: 'no-repeat'
//                 }}
//               />
//             </>
//             :
//             <>
//               <div
//                 ref={resultRef}
//                 style={{
//                   display: isHovering ? 'block' : 'none',
//                   // position: 'absolute',
//                   border: '1px solid #d4d4d4',
//                   width: '600px',
//                   height: '90vh',
//                   overflow: 'hidden',
//                   zIndex: 9999,
//                   backgroundImage: `url(${image})`, // Same as the image above
//                   backgroundSize: '1200px 960px', // Double the size of the original image for zoom
//                   backgroundPosition: bgPos,
//                   backgroundRepeat: 'no-repeat'
//                 }}
//               />
//               <div className="img-zoom-container">
//                 <img
//                   src={image} // Change to your actual image URL
//                   alt="Zoomable"
//                   width="600"
//                   height="90vh"
//                   onMouseMove={handleMouseMove}
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}
//                   style={{
//                     width: '600px',
//                     height: '90vh',
//                     display: isHovering1 ? 'none' : 'block',
//                     marginLeft: 10
//                   }}
//                 />
//               </div>

//             </>
//           }

//           {/* second image */}
//           <div
//             ref={resultRef1}
//             style={{
//               display: isHovering1 && image1 ? 'block' : 'none',
//               // position: 'absolute',
//               border: '1px solid #d4d4d4',
//               width: '600px',
//               height: '90vh',
//               overflow: 'hidden',
//               zIndex: 9999,
//               backgroundImage: `url(${image1})`, // Same as the image above
//               backgroundSize: '1200px 960px', // Double the size of the original image for zoom
//               backgroundPosition: bgPos1,
//               backgroundRepeat: 'no-repeat',
//               margin: 10
//             }}
//           />
//           <div className="img-zoom-container">
//             {image1 && <img
//               src={image1} // Change to your actual image URL\
//               alt="Zoomable"
//               width="600"
//               height="90vh"
//               onMouseMove={handleMouseMove1}
//               onMouseEnter={handleMouseEnter1}
//               onMouseLeave={handleMouseLeave1}
//               style={{
//                 width: '600px',
//                 height: '90vh',
//                 display: isHovering ? 'none' : 'block',
//                 margin: 10
//               }}
//             />}
//           </div>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default ShowPrescription;

import React, { useState, useRef, WheelEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Drawer, Stack } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import FileSaver from 'file-saver';
import '../singleTicket.css';
import DocumentDownload from '../../../assets/document-download.svg';

interface Props {
  image: string;
  image1: string;
}

const ShowPrescription = ({ image, image1 }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  // const [scale, setScale] = useState(1);
  // const [scale1, setScale1] = useState(1);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const drawerWidth = 'auto';

  const downloadPrescription = () => {
    FileSaver.saveAs(link1, 'prescription_img.jpg');
    FileSaver.saveAs(link2, 'prescription_img.jpg');
  };

  useEffect(() => {
    if (image) {
      setLink1(processLink(image));
      console.log(processLink(image), 'image1');
    }
    if (image1) {
      setLink2(processLink(image1));
    }
  }, [image, image1]);

  const processLink = (link: string) => {
    const partToRemove = 'https%3A//';
    if (link.includes(partToRemove)) {
      return link.split(partToRemove)[1];
    }

    return link;
  };

  const [isHovering, setIsHovering] = useState(false);
  const [bgPos, setBgPos] = useState('0% 0%');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
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

  const handleMouseMove1 = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
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

  const handleMediaFunction = () => {
    if (link1) {
      window.open(`https://${link1}`, '_blank'); // Opens the link in a new tab
    } else {
      console.error('No URL provided in link1.');
    }
  };
  return (
    <div>
      <Stack
        className="prescription-link"
        onClick={() => {
          if (link1.startsWith('media')) {
            handleMediaFunction();
          } else {
            handleOpen();
          }
        }}
      >
        View Prescription
      </Stack>
      <Drawer
        sx={{
          position: 'relative',
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderTopLeftRadius: '15px',
            borderBottomLeftRadius: '15px'
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
          p={1}
          borderColor="#f5f5f5"
        >
          <Stack className="viewprescription-heading">View Prescription</Stack>
          {/* <Button
            onClick={downloadPrescription}
            sx={{ textTransform: 'capitalize' }}
            color="success"
            endIcon={<DownloadOutlined />}
          >
            Download Prescription
          </Button> */}
          <Stack className="Download-Icon" onClick={downloadPrescription}>
            <img src={DocumentDownload} />
          </Stack>
        </Box>
        <Box
          style={{
            display: 'flex',
            borderRadius: '20px',
            justifyContent: link2 ? 'space-around' : 'end',
            marginRight: link2 ? 0 : 10
          }}
        >
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

          {link2 ? (
            <>
              <div className="img-zoom-container">
                <img
                  src={link1} // Change to your actual image URL
                  alt="Zoomable"
                  width="600"
                  height="90vh"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: '600px',
                    height: '90vh',
                    display: isHovering1 ? 'none' : 'block',
                    margin: 10
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
                  height: '90vh',
                  overflow: 'hidden',
                  zIndex: 9999,
                  backgroundImage: `url(${link1})`, // Same as the image above
                  backgroundSize: '1200px 960px', // Double the size of the original image for zoom
                  backgroundPosition: bgPos,
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </>
          ) : (
            <>
              <div
                ref={resultRef}
                style={{
                  display: isHovering ? 'block' : 'none',
                  // position: 'absolute',
                  border: '1px solid #d4d4d4',
                  width: '600px',
                  height: '90vh',
                  overflow: 'hidden',
                  zIndex: 9999,
                  backgroundImage: `url(${link1})`, // Same as the image above
                  backgroundSize: '1200px 960px', // Double the size of the original image for zoom
                  backgroundPosition: bgPos,
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div className="img-zoom-container">
                <img
                  src={link1} // Change to your actual image URL
                  alt="Zoomable"
                  width="600"
                  height="90vh"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: '600px',
                    height: '90vh',
                    display: isHovering1 ? 'none' : 'block',
                    marginLeft: 10
                  }}
                />
              </div>
            </>
          )}

          {/* second image */}
          <div
            ref={resultRef1}
            style={{
              display: isHovering1 && link2 ? 'block' : 'none',
              // position: 'absolute',
              border: '1px solid #d4d4d4',
              width: '600px',
              height: '90vh',
              overflow: 'hidden',
              zIndex: 9999,
              backgroundImage: `url(${link2})`, // Same as the image above
              backgroundSize: '1200px 960px', // Double the size of the original image for zoom
              backgroundPosition: bgPos1,
              backgroundRepeat: 'no-repeat',
              margin: 10
            }}
          />
          <div className="img-zoom-container">
            {link2 && (
              <img
                src={link2} // Change to your actual image URL\
                alt="Zoomable"
                width="600"
                height="90vh"
                onMouseMove={handleMouseMove1}
                onMouseEnter={handleMouseEnter1}
                onMouseLeave={handleMouseLeave1}
                style={{
                  width: '600px',
                  height: '90vh',
                  display: isHovering ? 'none' : 'block',
                  margin: 10
                }}
              />
            )}
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default ShowPrescription;
