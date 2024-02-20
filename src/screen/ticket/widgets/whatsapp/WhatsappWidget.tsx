import { Send } from '@mui/icons-material';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { database } from '../../../../utils/firebase';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import bgWhatsapp from '../../../../assets/images/whatsappBg.png';
import NodeListMessage from './NodeListMessage';
import NodeReplyMessage from './NodeReplyMessage';
import PatientReply from './PatientReply';
import useUserStore from '../../../../store/userStore';
import { sendTextMessage } from '../../../../api/ticket/ticket';
import useTicketStore from '../../../../store/ticketStore';
import AgentReply from './AgentReply';
import dayjs from 'dayjs';

import { apiClient } from '../../../../api/apiClient';
import AttachFileIcon from '@mui/icons-material/AttachFile';

type Props = {};






const MessagingWidget = (props: Props) => {
  const { ticketID } = useParams();
  const { user } = useUserStore();
  const { tickets, filterTickets } = useTicketStore();
 const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [file, setFile] = useState(null);
    const [id, setId] = useState('');
   const containerRef = useRef<HTMLDivElement | null>(null);

  function getConsumerIdByDataId(dataArray, dataIdToMatch) {
    for (const obj of dataArray) {
      if (obj._id === dataIdToMatch) {
        return obj.consumer[0]._id;
      }
    }
    return null; // Return null if no matching dataId found in the data array
  }

  const consumerId = getConsumerIdByDataId(tickets, ticketID);

  if (consumerId) {
    console.log('Consumer ID found:', consumerId);
  } else {
    console.log('Consumer ID not found for the given dataId.');
  }

  const TextInput = {
    border: 0,
    width: '100%',
    outline: 0,
    ' &:hover, &:focus ': {
      outline: 'none'
    }
  };

  useEffect(() => {
      if (ticketID) {
        const collectionRef = collection(
          database,
          'ticket',
          ticketID,
          'messages'
        );
        const q = query(collectionRef, orderBy('createdAt'));
        const unsub = onSnapshot(q, (snapshot) => {
          const message: DocumentData[] = [];
          snapshot.forEach((doc) => {
            message.push(doc.data());
          });
          
          setMessages(message);
        });

        return () => unsub();
      }
  }, [ticketID]);

  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [sendMessage, setSendMessage] = useState('');
 

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && sendMessage.trim() !== '') {
      console.log('press enter');
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    await sendTextMessage(sendMessage, consumerId, ticketID as string);
    setSendMessage(''); 
  };

  

  



  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

const handleFileSelect = async (event) => {
  const selectedFile = event.target.files[0];
   console.log(selectedFile,"thisi s selected file")
    const formData = new FormData();

    // Append each Blob to the FormData object
console.log(consumerId, 'this is consimer id ');
    formData.append('images', selectedFile);
    formData.append('consumerId', consumerId);
    formData.append('ticketID',ticketID as string)

   
    try {
      // Send the FormData object to the API using your apiClient
      const response = await apiClient.post(
        '/flow/whatsappImageStatus',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        }
      );

      // Handle the API response
      console.log('API Response:', response);
    } catch (error) {
      // Handle any API errors
      console.error('API Error:', error);
    }
 
};
console.log(messages,"this is message for send whtasapp image")
console.log(file,"thuis is file outsider")
useEffect(() => {
  // Check if containerRef.current is not null before accessing properties
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
}, [messages]);

  return (
    <Stack
      direction="column"
      height="90%"
      position="relative"
      bgcolor="white"
      p={1}
    >
      <Box
        ref={containerRef}
        sx={{
          backgroundImage: `url(${bgWhatsapp})`,
          overflowY: 'auto'
        }}
        height="85%"
      >
        {messages
          ? messages.length > 0
            ? messages.map((message, index) =>
                message.type === 'sent' ? (
                  <Stack
                    direction="column"
                    display="flex"
                    alignItems="flex-end"
                  >
                    {message.listId0 ? (
                      <NodeListMessage message={message} />
                    ) : message.replyButton1 ? (
                      <NodeReplyMessage message={message} />
                    ) : message.imageURL ? (
                      <div
                        style={{
                          height: '10%',
                          width: '50%'
                        }}
                      >
                        {message.messageType === 'image' ? (
                          <img
                            src={message.imageURL}
                            alt="Image"
                            style={{
                              boxShadow: '0 1px .5px rgba(11,20,26,.13)',
                              margin: '10px 0',
                              padding: '5px',
                              backgroundColor: '#d8fdd3',
                              borderRadius: '7.5px 7.5px 7.5px 0px'
                            }}
                          />
                        ) : message.messageType === 'pdf' ? (
                          <a
                            href={message.imageURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <embed
                              src={message.imageURL}
                              type="application/pdf"
                              width="100%"
                              height="100%"
                            />
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <Box
                        boxShadow=" 0 1px .5px rgba(11,20,26,.13)"
                        my={1}
                        maxWidth="70%"
                        p={1}
                        bgcolor="#d8fdd3"
                        borderRadius="7.5px 7.5px 7.5px 0px"
                      >
                        <Typography> {message.text}</Typography>
                        <Box display="flex" justifyContent="flex-start">
                          <Typography
                            variant="caption"
                            fontSize="0.7rem"
                            color="GrayText"
                          >
                            {dayjs(message.createdAt).format(
                              'DD MMM YYYY hh:mm A'
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Stack direction="column" justifyContent="flex-start">
                    <PatientReply message={message} />
                  </Stack>
                )
              )
            : 'No Messages Available'
          : 'Loading ....'}
      </Box>

      <Box
        borderTop={2.5}
        borderColor="#317AE2"
        bottom={0}
        bgcolor="white"
        height="45%"
      >
        <Stack p={1} direction="row" spacing={2} alignItems="center">
          <input
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Message"
            style={TextInput}
          />
          <Box
            display="flex"
            onClick={handleSendMessage}
            style={{
              cursor: sendMessage ? 'pointer' : 'not-allowed'
             
            }}
          >
            <Typography color={sendMessage ? 'blue' : 'gray'}>Reply</Typography>
            <Send htmlColor={sendMessage ? 'blue' : 'gray'} />
          </Box>
          <div>
            <Button onClick={handleImageUpload} style={{ cursor: 'pointer' }}>
              <AttachFileIcon
                color="primary"
                sx={{  marginRight: '10px' }}
              />
            </Button>
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </div>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MessagingWidget;
