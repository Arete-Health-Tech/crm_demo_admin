import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  message: any;
};

const PatientReply = ({ message }: Props) => {
 
 const [imageUrl, setImageUrl] = useState('');
 




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
 const imageurl = response.data?.url;

        // Handle the response data here
        try{
          const imageResponse = await axios.get(imageurl, {
            responseType: 'blob',
            headers: {
              Authorization:
                'Bearer EAALU5Uh1hCoBAHOvIZAOLuJVrUltYe3uMCIQwKvayQCZC5zR45RO9iK5ZAeRNUKhZB3dShZBM4DugqeUtw9ZCIYOr39g3fqGsjYYycjNPb4CpMFZCQY4rqUSXaPHHam8utfUUzC4NBBSYLkoZCuSEW1oPl6TaZCK7hgmJ1h1E5DxXw8BEXKW1Vs2P'
            } // Specify 'blob' for binary data like images
          });

 setImageUrl(URL.createObjectURL(imageResponse.data));
        }catch(imageError){
          console.error('Error fetching the image:', imageError);
        }

      } catch (error) {
        // Handle any errors that occurred during the request
        console.error(error);
      }
    };

    fetchData();
  }, []);

  

console.log(imageUrl)




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
      {imageUrl ? <img src={imageUrl} alt="Image" /> : <p>Image not found</p>}

      <Box display="flex" justifyContent="flex-start">
        <Typography variant="caption" fontSize="0.7rem" color="GrayText">
          {dayjs(message.createdAt).format('DD MMM YYYY hh:mm A')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PatientReply;
