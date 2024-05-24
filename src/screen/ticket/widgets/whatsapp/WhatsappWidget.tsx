/* eslint-disable jsx-a11y/img-redundant-alt */
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
import styles from './Whtsapp.module.css';
import { apiClient } from '../../../../api/apiClient';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import whtsappMessageIcon from '../../../../assets/avatar1.svg';
import Attachment from '../../../../assets/Attachment.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import collapseIcon from '../../../../assets/collapseIcon.svg';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';

type Props = {};

const MessagingWidget = (props: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ticketID } = useParams();
  const { user } = useUserStore();
  const { tickets, filterTickets, setWhtsappExpanded, whtsappExpanded } =
    useTicketStore();
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
  } else {
    console.log('Consumer ID not found for the given dataId.');
  }

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
      // console.log('press enter');
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
    //  console.log(selectedFile,"thisi s selected file")
    const formData = new FormData();

    // Append each Blob to the FormData object
    // console.log(consumerId, 'this is consimer id ');
    formData.append('images', selectedFile);
    formData.append('consumerId', consumerId);
    formData.append('ticketID', ticketID as string);

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
      // console.log('API Response:', response);
    } catch (error) {
      // Handle any API errors
      console.error('API Error:', error);
    }
  };
  // console.log(messages,"this is message for send whtasapp image")
  // console.log(file,"thuis is file outsider")
  useEffect(() => {
    // Check if containerRef.current is not null before accessing properties
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Adjust the height on initial render
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        window.innerHeight * 0.1
      )}px`;
    }
  }, []);
  return (
    <>
      <Box className={whtsappExpanded ? styles.openedModal : ''}>
        {whtsappExpanded && (
          <Stack
            className={styles.reminder_modal_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            {/* <NotificationAddOutlined /> */}
            <Stack>WhatsApp</Stack>

            <Stack
              className={styles.modal_close}
              onClick={() => setWhtsappExpanded(false)}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
        )}

        <Stack
          direction="column"
          height={whtsappExpanded ? '80vh' : '55vh'}
          position="relative"
          bgcolor="white"
        >
          <Box
            ref={containerRef}
            sx={{
              backgroundImage: `url(${bgWhatsapp})`,
              overflowY: 'auto'
            }}
            className={styles.whtsappMessageBox}
          >
            {messages
              ? messages.length > 0
                ? messages.map((message, index) => (
                  <Stack
                    key={index}
                    direction="column"
                    alignItems={
                      message.type === 'sent' ? 'flex-end' : 'flex-start'
                    }
                  >
                    {message.listId0 ? (
                      <NodeListMessage message={message} />
                    ) : message.replyButton1 ? (
                      <NodeReplyMessage message={message} />
                    ) : message.imageURL ? (
                      <Box sx={{ height: '10%', width: '50%' }}>
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
                      </Box>
                    ) : (
                      <Box
                        boxShadow="0 1px .5px rgba(11,20,26,.13)"
                        my={1}
                        maxWidth="70%"
                        p={1}
                        bgcolor="#d8fdd3"
                        sx={{
                          borderRadius: '7.5px 7.5px 7.5px 0px',
                          borderBottomLeftRadius:
                            message.type === 'sent' ? '7.5px' : '0px'
                        }}
                      >
                        <Typography
                          color="var(--Text-Black, #080F1A)"
                          fontFamily="Outfit, sans-serif"
                          fontSize="0.875rem"
                          fontWeight={400}
                        >
                          {message.text}
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            color="var(--Text-Light-Grey, #647491)"
                            fontFamily="Outfit, sans-serif"
                            fontSize="0.625rem"
                            fontWeight={400}
                            pt={1}
                          >
                            {dayjs(message.createdAt).format(
                              'DD MMM YYYY hh:mm A'
                            )}
                          </Typography>
                          <img
                            src={whtsappMessageIcon}
                            style={{
                              height: '1.25rem',
                              width: '1.25rem',
                              margin: '0.3rem'
                            }}
                            alt=""
                          />
                        </Box>
                      </Box>
                    )}
                  </Stack>
                ))
                : 'No Messages Available'
              : 'Loading ...'}
          </Box>

          <Box borderTop={2.5} borderColor="#317AE2" bottom={0} bgcolor="white">
            <Stack p={"0px 8px 0px 8px"} spacing={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box style={{
                  cursor: 'pointer',
                  marginLeft: -20,
                  height: '100%',
                  alignSelf: 'flex-end'
                }}>
                  <Button
                    onClick={handleImageUpload}
                  >
                    <img src={Attachment} alt="" />
                  </Button>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none', border: 'none' }}
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                </Box>
                <textarea
                  ref={textareaRef}
                  value={sendMessage}
                  className={styles.replytextArea}
                  onChange={(e) => {
                    setSendMessage(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = `${Math.min(
                        textareaRef.current.scrollHeight,
                        window.innerHeight * 0.1
                      )}px`;
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a Message"
                />
                <Box
                  className={sendMessage ? styles.sendButtonActive : styles.sendButton}
                  onClick={handleSendMessage}
                >
                  <Typography className={sendMessage ? styles.sendButtonTextActive : styles.sendButtonText}>
                    Send
                  </Typography>
                </Box>
                {!whtsappExpanded && (
                  <img
                    src={expandIcon}
                    alt=""
                    style={{ width: '1rem', marginLeft: 10, cursor: 'pointer', alignSelf: 'flex-end', marginBottom: '0.5rem' }}
                    onClick={() => setWhtsappExpanded(true)}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default MessagingWidget;
