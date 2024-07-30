import { ArrowBack, Send } from '@mui/icons-material';
import { Box, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { database } from '../../../utils/firebase';

type Props = {
  roomId: string;
  onRoomClose: any;
  roomName: string;
};

const QueryRoom = ({ roomId, onRoomClose, roomName }: Props) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);

  useEffect(() => {
    const collectionRef = collection(database, 'queries', roomId, 'messages');
    const q = query(collectionRef, orderBy('createdAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      const messages: DocumentData[] = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages((_) => messages);
    });
    return () => unsub();
  }, [roomId]);
  return (
    <Box height="100%" position="relative">
      <Stack
        spacing={2}
        direction="row"
        borderBottom={1}
        borderColor="#f1f5f7"
        p={1}
      >
        <ArrowBack sx={{ cursor: 'pointer' }} onClick={onRoomClose} />
        <Typography fontWeight={500}>{roomName} </Typography>
      </Stack>
      <Box height="100%" position="relative">
        <Box
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              display: 'none'
            }
          }}
          height="80%"
        >
          {messages.map((message: any, index: number) =>
            message.sender === 'agent' ? (
              <Box display="flex" justifyContent="flex-end">
                <Box
                  sx={{
                    borderRadius: `-webkit-border-radius: 20px;
                              -webkit-border-bottom-right-radius: 0;
                              -moz-border-radius: 20px;
                              -moz-border-radius-bottomright: 0;
                              border-radius: 20px;
                              border-bottom-right-radius: 0;`
                  }}
                  bgcolor="#317AE2"
                  p={1}
                  m={1}
                  maxWidth="70%"
                >
                  <Typography color="white">{message.content}</Typography>
                  <Typography color="white" variant="caption">
                    {dayjs(message.createdAt.seconds * 1000).format(
                      'DD MMMM YYYY HH:MM A '
                    )}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="flex-start">
                <Box
                  sx={{
                    borderRadius: `-webkit-border-radius: 20px;
                    -webkit-border-bottom-left-radius: 0;
                    -moz-border-radius: 20px;
                    -moz-border-radius-bottomleft: 0;
                    border-radius: 20px;
                    border-bottom-left-radius: 0;`
                  }}
                  bgcolor="#f5f7f5"
                  p={1}
                  m={1}
                  maxWidth="70%"
                >
                  <Typography color="black">{message.content}</Typography>
                  <Typography color="gray" variant="caption">
                    {dayjs(message.createdAt.seconds * 1000).format(
                      'DD MMMM YYYY HH:MM A '
                    )}
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </Box>
        <Box
          height="10%"
          position="sticky"
          bottom={2}
          borderTop={2.5}
          borderColor="#317AE2"
          bgcolor="white"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              id="note"
              autoFocus
              placeholder="Write Your Note "
              InputProps={{
                disableUnderline: true
              }}
              value={message}
              onChange={(e) => setMessage((_) => e.target.value)}
            />
            <Box
              width="25%"
              sx={{ cursor: 'pointer' }}
              display="flex"
              justifyContent="space-evenly"
              onClick={async () => {
                const trimmedMessage = message.trim();
                if (trimmedMessage.length) {
                  const collectionRef = collection(
                    database,
                    'queries',
                    roomId,
                    'messages'
                  );
                  await addDoc(collectionRef, {
                    content: trimmedMessage,
                    createdAt: Timestamp.fromDate(new Date()),
                    sender: 'agent'
                  });
                  setMessage((_) => '');
                }
              }}
            >
              <Typography color="gray">Send</Typography>
              <Send htmlColor="gray" />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default QueryRoom;
