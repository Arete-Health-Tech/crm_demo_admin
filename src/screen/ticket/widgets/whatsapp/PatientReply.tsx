import { Box, Typography,IconButton } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { image } from 'pdfkit/js/mixins/images';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
 const isImage =
   typeof message.url === 'string' &&
   message.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
 
 const handleImageClick = (event) => {
   if (isImage) {
     // Open the URL in a new tab
     window.open(message.url, '_blank');
     // Prevent the default behavior of the anchor element (prevents opening in the same tab)
     event.preventDefault();
     
   }
 };
  


  return (
    <Box
      boxShadow=" 0 1px .5px rgba(11,20,26,.13)"
      my={1}
      maxWidth="50%"
      p={1}
      bgcolor="#f5f5f5"
      borderRadius="7.5px 7.5px 7.5px 0px"
    >
      {message.text ? (
        <Typography>{message.text}</Typography>
      ) : isImage ? (
        <a
          href={message.url}
          download="image.jpg"
        
          rel="noopener noreferrer"
          onClick={handleImageClick}
        
        >
          <img src={message.url} alt="Image" />
        </a>
      ) : (
        <img src={message.url} alt="Image" />
      )}
      <Box display="flex" justifyContent="flex-start">
        <Typography variant="caption" fontSize="0.7rem" color="GrayText">
          {dayjs(message.createdAt).format('DD MMM YYYY hh:mm A')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PatientReply;
