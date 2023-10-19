import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { image } from 'pdfkit/js/mixins/images';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
 
 const [imageUrl, setImageUrl] = useState('');
 








  return (
    <Box
      boxShadow=" 0 1px .5px rgba(11,20,26,.13)"
      my={1}
      maxWidth="70%"
      p={1}
      bgcolor="#f5f5f5"
      borderRadius="7.5px 7.5px 7.5px 0px"
    >
      {message.text ? (
        <Typography>{message.text}</Typography>
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
