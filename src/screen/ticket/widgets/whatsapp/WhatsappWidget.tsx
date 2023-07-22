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

type Props = {};

const MessagingWidget = (props: Props) => {
  const { ticketID } = useParams();
  const { user } = useUserStore();
  const {tickets} = useTicketStore();

  
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

  const handleSendMessage = async () => {
    await sendTextMessage(sendMessage, consumerId ,ticketID as string);
    setSendMessage(sendMessage);
  };
  console.log(messages);
  console.log(sendMessage);

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
          overflowY: 'scroll',
          '&::-webkit-scrollbar ': {
            display: 'none'
          }
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
                    ) : (
                      message.text
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
            placeholder="Enter Message"
            style={TextInput}
          />
          <Box display="flex" onClick={handleSendMessage}>
            <Typography color="gray">Reply</Typography>
            <Send htmlColor="gray" />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MessagingWidget;
