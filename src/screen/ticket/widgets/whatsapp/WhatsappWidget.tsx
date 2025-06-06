/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Send } from '@mui/icons-material';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
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
import { apiClient, socket } from '../../../../api/apiClient';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import whtsappMessageIcon from '../../../../assets/avatar1.svg';
import Attachment from '../../../../assets/Attachment.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import collapseIcon from '../../../../assets/collapseIcon.svg';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';
import NotFoundIcon from '../../../../assets/NotFoundTask.svg';
import { Avatar } from '@mui/material';
import { io } from 'socket.io-client';
import { markAsRead } from '../../../../api/flow/flow';
import {
  getAllWhtsappCountHandler,
  getTicketHandler,
  getAllAuditTicketHandler,
  getTicketFilterHandler,
  getTicketHandlerSearch
} from '../../../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../../../constantUtils/constant';
import {
  hasChanges,
  initialFiltersNew,
  oldInitialFilters
} from '../../../../constants/commomFunctions';
import { toast } from 'react-toastify';
type Props = { ticketId: string | undefined };

const MessagingWidget = (props: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ticketID } = useParams();
  const { user } = useUserStore();
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setWhtsappExpanded,
    whtsappExpanded,
    isAuditor,
    pageNumber,
    allWhtsappCount,
    searchByName,
    filteredLocation
  } = useTicketStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState(null);
  const [id, setId] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [sendMessage, setSendMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const { user, setUser } = useUserStore();

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

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

  const handleMarkAsRead = async (ticketID: string | undefined) => {
    await markAsRead(ticketID);
    await getAllWhtsappCountHandler();
    if (isAuditor) {
      await getAllAuditTicketHandler(
        searchByName,
        pageNumber,
        'false',
        newFilter
      );
    } else {
      // await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
      try {
        if (
          hasChanges(newFilter, initialFiltersNew) &&
          !filteredLocation &&
          (searchByName === '' || searchByName === UNDEFINED)
        ) {
          await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            oldInitialFilters
          );
        } else if (
          hasChanges(newFilter, initialFiltersNew) &&
          !filteredLocation &&
          (searchByName !== '' || searchByName !== UNDEFINED)
        ) {
          await getTicketHandlerSearch(
            searchByName,
            pageNumber,
            'false',
            newFilter
          );
        } else {
          await getTicketFilterHandler(
            searchByName,
            pageNumber,
            'false',
            newFilter
          );
        }
      } catch (error) {
        console.log(error);
        // setDownloadDisable(false);
      }
    }
  };

  //This function call the api to get all the ticket id with their whtsapp message count
  const getAllWhtsappMsgCount = async () => {
    await getAllWhtsappCountHandler();
    if (isAuditor) {
      await getAllAuditTicketHandler(
        searchByName,
        pageNumber,
        'false',
        newFilter
      );
    } else {
      // await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
      try {
        if (
          hasChanges(newFilter, initialFiltersNew) &&
          !filteredLocation &&
          (searchByName === '' || searchByName === UNDEFINED)
        ) {
          await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            oldInitialFilters
          );
        } else if (
          hasChanges(newFilter, initialFiltersNew) &&
          !filteredLocation &&
          (searchByName !== '' || searchByName !== UNDEFINED)
        ) {
          await getTicketHandlerSearch(
            searchByName,
            pageNumber,
            'false',
            newFilter
          );
        } else {
          await getTicketFilterHandler(
            searchByName,
            pageNumber,
            'false',
            newFilter
          );
        }
      } catch (error) {
        console.log(error);
        // setDownloadDisable(false);
      }
    }
  };
  useEffect(() => {
    // Check if socket is connected
    if (!socket.connected) {
      socket.connect();
    }
    // Listen for the 'newMessage' event
    socket.on('newMessage', async (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      getAllWhtsappMsgCount();
      handleMarkAsRead(props.ticketId);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('newMessage'); // Remove the event listener
      socket.disconnect();
    };
  }, [ticketID]);

  useEffect(() => {
    handleMarkAsRead(ticketID);
  }, [ticketID]);

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

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && sendMessage.trim() !== '') {
      setIsDisabled(true);
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    setIsDisabled(true);
    await sendTextMessage(sendMessage, consumerId, ticketID as string);
    setSendMessage('');
    setIsDisabled(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();

    // Append each Blob to the FormData object
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
    } catch (error) {
      // Handle any API errors
      console.error('API Error:', error);
    }
  };
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
          height={
            whtsappExpanded
              ? '80vh'
              : isAuditor
              ? '58vh'
              : localStorage.getItem('ticketType') !== 'Follow-Up'
              ? '55vh'
              : '76vh'
          }
          position="relative"
          bgcolor="white"
          sx={{ borderBottomLeftRadius: '18px' }}
        >
          <Box
            ref={containerRef}
            height={
              whtsappExpanded
                ? '70vh'
                : isAuditor
                ? '58vh'
                : localStorage.getItem('ticketType') !== 'Follow-Up'
                ? '40vh'
                : '66vh'
            }
            sx={{
              backgroundImage: `url(${bgWhatsapp})`,
              overflowY: 'auto'
            }}
            className={styles.whtsappMessageBox}
          >
            {messages ? (
              messages.length > 0 ? (
                messages.map((message, index) => (
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
                        mx={1}
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
                          <Avatar
                            sx={{
                              fontSize: '8px',
                              bgcolor: 'orange',
                              height: '1rem',
                              width: '1rem',
                              margin: '0.3rem',
                              marginTop: '8px'
                            }}
                          >
                            {user?.firstName[0]?.toUpperCase()}
                            {user?.lastName[0]?.toUpperCase()}
                          </Avatar>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                ))
              ) : (
                <>
                  {/* No Messages Available */}
                  <Box
                    className="NotFound-Page"
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                  >
                    <Stack
                      sx={{
                        alignItems: 'center',
                        textAlign: 'center'
                        // marginTop: '30px'
                      }}
                    >
                      <img
                        width={'200px'}
                        height={'200px'}
                        src={NotFoundIcon}
                      />
                    </Stack>
                    <Box
                      textAlign={'center'}
                      sx={{
                        font: 'bold',
                        fontSize: '24px',
                        fontFamily: 'Outfit,sans-serif'
                      }}
                    >
                      No Message Available
                    </Box>
                  </Box>
                </>
              )
            ) : (
              <Box className="NotFound-Page">
                <CircularProgress />
              </Box>
            )}
          </Box>

          {!isAuditor && (
            <Box
              borderTop={2.5}
              borderColor="#317AE2"
              bottom={0}
              bgcolor="white"
              sx={{ height: '10vh', borderBottomLeftRadius: '18px' }}
            >
              <Stack p={'0px 8px 0px 8px'} spacing={4}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    style={{
                      cursor: 'pointer',
                      marginLeft: -20,
                      height: '100%',
                      alignSelf: 'flex-end'
                    }}
                  >
                    <Button onClick={handleImageUpload}>
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
                    onKeyPress={(e) => {
                      if (!isDisabled) {
                        handleKeyPress(e);
                      }
                    }}
                    placeholder="Enter a Message"
                  />
                  <Box
                    className={
                      sendMessage ? styles.sendButtonActive : styles.sendButton
                    }
                    onClick={() => {
                      if (!isDisabled) {
                        handleSendMessage();
                      }
                    }}
                  >
                    <Typography
                      sx={{ cursor: 'pointer' }}
                      className={
                        sendMessage
                          ? styles.sendButtonTextActive
                          : styles.sendButtonText
                      }
                    >
                      Send
                    </Typography>
                  </Box>
                  {!whtsappExpanded && (
                    <img
                      src={expandIcon}
                      alt=""
                      style={{
                        width: '1rem',
                        marginLeft: 10,
                        cursor: 'pointer',
                        alignSelf: 'flex-end',
                        marginBottom: '0.5rem'
                      }}
                      onClick={() => setWhtsappExpanded(true)}
                    />
                  )}
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MessagingWidget;
