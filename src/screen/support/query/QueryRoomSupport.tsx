import { ArrowBack, Send } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { database } from '../../../utils/firebase';
import dayjs from 'dayjs';

type Props = {};

const QueryRoomSupport = (props: Props) => {
  const { docId } = useParams();

  const navigate = useNavigate();

  const [sendMessage, setSendMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [docData, setDocData] = useState<DocumentData>();

  const TextInput = {
    border: 0,
    width: '100%',
    outline: 0,
    padding: '1rem',
    ' &:hover, &:focus ': {
      outline: 'none'
    }
  };

  useEffect(() => {
    (async function () {
      const collectionRef = doc(database, 'queries', docId as string);
      const docSnap = await getDoc(collectionRef);

      if (docSnap.exists()) {
        setDocData(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })();
  }, [docId]);

  useEffect(() => {
    const collectionRef = collection(
      database,
      'queries',
      docId as string,
      'messages'
    );
    const q = query(collectionRef, orderBy('createdAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      const messages: DocumentData[] = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages((_) => messages);
    });
    return () => unsub();
  }, [docId]);

  return (
    <Box height="100vh" bgcolor="whitesmoke" position="relative">
      <Stack
        position="sticky"
        top={0}
        bgcolor="white"
        p={1}
        direction="row"
        spacing={2}
        height="7vh"
      >
        <IconButton onClick={() => navigate('/query')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body2" fontWeight={500}>
          {docData?.subject}
        </Typography>
      </Stack>
      <Box
        sx={{
          overflowY: 'scroll',
          '&::-webkit-scrollbar ': {
            display: 'none'
          }
        }}
        height="83vh"
      >
        {messages
          ? messages.map((message: any, index: number) =>
            message.sender === 'support' ? (
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
                  maxWidth="80%"
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
                  bgcolor="lightblue"
                  p={1}
                  m={1}
                  maxWidth="80%"
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
          )
          : 'Loading....'}
      </Box>
      <Stack
        p={1}
        position="fixed"
        bottom={0}
        width="100vw"
        bgcolor="white"
        height="10vh"
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <input
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          placeholder="Enter Message"
          style={TextInput}
        />
        <IconButton
          onClick={async () => {
            const trimmedMessage = sendMessage.trim();
            if (trimmedMessage.length) {
              const collectionRef = collection(
                database,
                'queries',
                docId as string,
                'messages'
              );
              await addDoc(collectionRef, {
                content: trimmedMessage,
                createdAt: Timestamp.fromDate(new Date()),
                sender: 'support'
              });
              setSendMessage((_) => '');
            }
          }}
        >
          <Send />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default QueryRoomSupport;
