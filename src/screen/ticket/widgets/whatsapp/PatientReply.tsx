import { Box, Typography, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { image } from 'pdfkit/js/mixins/images';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import whtsappIcon from '../../../../assets/whtsappIcon.svg';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
  const handleImageClick = (event) => {
    // Open the URL in a new tab
    window.open(message.url, '_blank');
    // Prevent the default behavior of the anchor element (prevents opening in the same tab)
    event.preventDefault();
  };

  return (
    <>
      <Box display={'flex'}>
        <img src={whtsappIcon} alt="" style={{ marginLeft: 10, marginTop: '-1.5rem' }} />
        <Box
          border={'1px solid #25D366'}
          boxShadow=" 0 1px .5px rgba(11,20,26,.13)"
          my={2}
          marginLeft={2}
          maxWidth="50%"
          p={1}
          bgcolor="var(--Communication-Color-Whatsapp-Bg, #DEF8E8)"
          borderRadius="10px"
        >
          {message.text ? (
            <Typography
              color="var(--Text-Black, #080F1A)"
              fontFamily={'Outfit,sans-serif'}
              fontSize={'0.875rem'}
              fontWeight={400}
            >
              {message.text}
            </Typography>
          ) : message.messageType === 'image' ? (
            <a
              href={message.url}
              download="image.jpg"
              rel="noopener noreferrer"
              onClick={handleImageClick}
            >
              <img src={message.url} alt="Image" />
            </a>
          ) : message.messageType === 'pdf' ? (
            <a
              href={message.url}
              download="document.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF Document
            </a>
          ) : (
            <img src={message.url} alt="Image" />
          )}
          <Box display="flex" justifyContent="flex-start">
            <Typography
              variant="caption"
              color="var(--Text-Light-Grey, #647491)"
              fontFamily={'Outfit,sans-serif'}
              fontSize={'0.625rem'}
              fontWeight={400}
            >
              {dayjs(message.createdAt).format('DD MMM YYYY hh:mm A')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PatientReply;
