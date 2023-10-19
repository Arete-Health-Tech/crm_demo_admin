import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { image } from 'pdfkit/js/mixins/images';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
 
   const isImage = message.url.match(/\.(jpeg|jpg|gif|png|webp)$/);

  const handleImageClick = () => {
    if (isImage) {
      // Create a hidden anchor element
      const downloadLink = document.createElement('a');
      downloadLink.href = message.url; // Set the URL to the image
      downloadLink.download = 'image.jpg'; // Specify the default file name for the downloaded image
      downloadLink.style.display = 'none';

      // Trigger a click event on the anchor element
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
    }
  };






  return (
    <Box
      style={{
        boxShadow: '0 1px .5px rgba(11, 20, 26, .13)',
        margin: '1rem 0',
        maxWidth: '70%',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '7.5px 7.5px 7.5px 0px',
        cursor: isImage ? 'pointer' : 'default' // Add a pointer cursor to indicate clickability for images
      }}
      onClick={handleImageClick}
    >
      {message.text ? (
        <p>{message.text}</p>
      ) : isImage ? (
        <a href={message.url} download="image.jpg">
          <img src={message.url} alt="Image" style={{ width: '100%' }} />
        </a>
      ) : (
        <img src={message.url} alt="Image" style={{ width: '100%' }} />
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
