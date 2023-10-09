import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
  const [link, setLink] = useState('');

console.log(message.url.url,"thuis is message url")

  useEffect(() => {
    // Replace with your API endpoint URL
    const apiUrl = message.url.url;
    const bearerToken =
      'EAALU5Uh1hCoBAHOvIZAOLuJVrUltYe3uMCIQwKvayQCZC5zR45RO9iK5ZAeRNUKhZB3dShZBM4DugqeUtw9ZCIYOr39g3fqGsjYYycjNPb4CpMFZCQY4rqUSXaPHHam8utfUUzC4NBBSYLkoZCuSEW1oPl6TaZCK7hgmJ1h1E5DxXw8BEXKW1Vs2P';

    // Set up the Axios request with headers
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then((response) => {
        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          // Assuming the response is in JSON format, extract the link
          const linkData = response.data.link_key; // Replace "link_key" with the actual key for the link in the response
          setLink(linkData);
        } else {
          console.error(`Request failed with status code: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);



console.log(link ,"this is image url")


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
        <img src={link} alt="Image" />
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
