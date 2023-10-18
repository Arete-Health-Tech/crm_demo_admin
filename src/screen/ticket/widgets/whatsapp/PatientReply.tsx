import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
  const [imageBlob, setImageBlob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v18.0/${message.url?.id}/`,
          {
            headers: {
              Authorization:
                'Bearer EAALU5Uh1hCoBAHOvIZAOLuJVrUltYe3uMCIQwKvayQCZC5zR45RO9iK5ZAeRNUKhZB3dShZBM4DugqeUtw9ZCIYOr39g3fqGsjYYycjNPb4CpMFZCQY4rqUSXaPHHam8utfUUzC4NBBSYLkoZCuSEW1oPl6TaZCK7hgmJ1h1E5DxXw8BEXKW1Vs2P'
            }
          }
        );

        // Assuming response.data.url is the URL of the image
        const imageurl = JSON.stringify(response.data?.url);
        const myHeaders = new Headers();
        myHeaders.append(
          'Authorization',
          'Bearer EAALU5Uh1hCoBAHOvIZAOLuJVrUltYe3uMCIQwKvayQCZC5zR45RO9iK5ZAeRNUKhZB3dShZBM4DugqeUtw9ZCIYOr39g3fqGsjYYycjNPb4CpMFZCQY4rqUSXaPHHam8utfUUzC4NBBSYLkoZCuSEW1oPl6TaZCK7hgmJ1h1E5DxXw8BEXKW1Vs2P'
        );

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow' as RequestRedirect
        };

        fetch(
          imageurl,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            // Handle the result here
            console.log(result);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        // Handle the response data here
      
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error(error);
      }
    };

    fetchData();
  }, []);

  console.log(imageBlob);

  // Function to trigger the download
  const downloadImage = () => {
    if (imageBlob) {
      // Create a blob URL for the image
      const url = URL.createObjectURL(imageBlob);

      // Create an anchor element with the download attribute
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageBlob);
      link.download = 'media_file.jpg'; // Specify the desired file name

      // Trigger a click event to download the file
      link.click();

      // Revoke the object URL to free up resources
      URL.revokeObjectURL(url);
    }
  };


  


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
        <p>text not found</p>
      )}
      {imageBlob ? (
        <div>
          <img src={URL.createObjectURL(imageBlob)} alt="Image" />
          <button onClick={downloadImage}>Download Image</button>
        </div>
      ) : (
        <p>Image not found</p>
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
