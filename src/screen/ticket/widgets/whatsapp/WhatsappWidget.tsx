import { Send } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import { getTicketHandler } from '../../../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../../../constantUtils/constant';


type Props = {};

const MessagingWidget = (props: Props) => {
  const { ticketID } = useParams();
  const { user } = useUserStore();
  const { tickets, filterTickets } = useTicketStore();

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

  console.log(messages,"this is messages    1111");

  // console.log(sendMessage);

  return (
    <Stack
      direction="column"
      height="90%"
      position="relative"
      bgcolor="white"
      p={1}
    >
      <Box
        sx={{
          backgroundImage: `url(${bgWhatsapp})`,
          overflowY: 'auto'
        }}
        height="90%"
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
                    ) :message.imageUrl ?(
                       
      <img src={message.imageUrl} alt="Image" />
    
  
                    ):
                     (
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
            style={{ cursor: sendMessage ? 'pointer' : 'not-allowed' }}
          >
            <Typography color={sendMessage ? 'blue' : 'gray'}>Reply</Typography>
            <Send htmlColor={sendMessage ? 'blue' : 'gray'} />
           
          
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MessagingWidget;
