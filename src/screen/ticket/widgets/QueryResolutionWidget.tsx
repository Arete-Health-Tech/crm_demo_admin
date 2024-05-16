import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';
import useUserStore from '../../../store/userStore';
import { ReactComponent as NoResultFoundSVG } from '../../../assets/images/no-result-found.svg';
import {
  collection,
  onSnapshot,
  DocumentData,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { database } from '../../../utils/firebase';
import CreateQueryModal from './CreateQueryModal';
import QueryFetched from './QueryFetched';
import QueryRoom from './QueryRoom';
import { useParams } from 'react-router-dom';
import query_resolution from '../../../assets/query_resolution.svg';
import arrowLeft from '../../../assets/arrowLeft.svg';
import expandIcon from '../../../assets/expandIcon.svg';
import attachFile from '../../../assets/Attachment.svg';
import CreateQueryModalV2 from './CreateQueryV2/CreateQueryModalV2';
import styles from './Qurey.module.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import dayjs from 'dayjs';
import useServiceStore from '../../../store/serviceStore';
import { iDepartment } from '../../../types/store/service';


type Props = {};

const QueryResolutionWidget = (props: Props) => {
  const [fetchedQueries, setFetchedQueries] = useState<DocumentData[]>();
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [departmentId, setDepartmentId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { departments } = useServiceStore();

  const departmentSetter = (departmentId: string) => {
    return departments.find(
      (department: iDepartment) => department._id === departmentId
    )?.name;
  };

  const { ticketID } = useParams();

  const { user } = useUserStore();

  useEffect(() => {
    setRoomId(null);
    const collectionRef = collection(database, 'queries');
    const q = query(
      collectionRef,
      orderBy('createdAt', 'desc'),
      where('agentId', '==', user?._id),
      where('ticketId', '==', ticketID)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const queries: DocumentData[] = [];
      snapshot.forEach((doc) => {
        queries.push({ ...doc.data(), id: doc.id });
      });
      setFetchedQueries(queries);
    });
    return () => unsub();
  }, [ticketID]);

  return (
    <Box p={1} height="95%" bgcolor="white">
      {!roomId && (
        <Stack position="relative" height="100%">
          <Box height="45vh">
            {fetchedQueries ? (
              (fetchedQueries.length > 0 && roomId == null) ? (
                fetchedQueries?.map((item: any, index: number) => {
                  return (
                    <Box display={'flex'}>
                      <img
                        src={query_resolution}
                        alt=""
                        style={{
                          borderRadius: '0.5rem',
                          width: '2rem',
                          height: '2rem',
                          padding: '0.25rem',
                          background: '#FFF3D9'
                        }}
                      />
                      <QueryFetched
                        onClick={() => {
                          setRoomId(item.id);
                          setRoomName(item.subject);
                          setDepartmentId(item.departmentId)
                          setCreatedAt(item.createdAt)
                        }}
                        id={item.id}
                        subject={item.subject}
                        departmentId={item.departmentId}
                        createdAt={item.createdAt}
                      />
                    </Box>
                  );
                })
              ) : (
                <Stack
                  height="45vh"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <NoResultFoundSVG />
                  <Typography color="gray" variant="caption" mt={1}>
                    No Queries available.
                  </Typography>
                </Stack>
              )
            ) : (
              <Typography>Loading... </Typography>
            )}
          </Box>
          {/* <CreateQueryModal /> */}
          <CreateQueryModalV2 />
        </Stack>
      )}
      {roomId && (
        // <QueryRoom
        //   onRoomClose={() => {
        //     setRoomId(null);
        //     setRoomName('');
        //   }}
        //   roomId={roomId}
        //   roomName={roomName}
        // />
        <Box>
          <Box
            height="45vh"
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            <Box className={styles.ClickedQueryHeader}>
              <div className='d-flex'>
                <img
                  src={arrowLeft}
                  alt=""
                  onClick={() => { setRoomId(null); setRoomName('') }}
                />
                <div className={styles.roomName}>
                  {roomName}
                </div>
              </div>
              <div>
                <IconButton
                  aria-label="more"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                // onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  // onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '15ch',
                      borderRadius: 20
                    }
                  }}
                >
                  <MenuItem
                    // onClick={handleClose}
                    style={{ color: '#080F1A', fontFamily: 'Outfit,san-serif' }}
                  // onClickCapture={() => (
                  //   setIsNoteEdited(true),
                  //   setNotesModal(true),
                  //   setNote(notesClickedData.text)
                  // )}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    // onClick={() => {
                    //   setDeleteModal(true);
                    //   setOpen(false);
                    // }}
                    style={{ color: '#F94839', fontFamily: 'Outfit,san-serif' }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            </Box>
            <Box className={styles.ClickedNoteText}>
              <Box display={'flex'}>
                <img
                  src={query_resolution}
                  alt=""
                  style={{
                    borderRadius: '0.5rem',
                    width: '2rem',
                    height: '2rem',
                    padding: '0.25rem',
                    background: '#FFF3D9'
                  }}
                />
                <Stack
                  spacing={0.5}
                  direction="column"
                  marginLeft={"1rem"}
                  p={1}
                  borderRadius={'0.5rem'}
                  width={"100%"}
                  bgcolor="#f1f5f7"
                >
                  <Stack>
                    {departmentId && (
                      <Typography className={styles.doc_dep}>{departmentSetter(departmentId)}</Typography>
                    )}
                  </Stack>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography className={styles.date}>
                      {dayjs(createdAt).format(
                        'DD MMM YYYY hh:mm A'
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
          <Box
            height="15vh"
            bottom={2}
            borderTop={2.5}
            borderColor="#317AE2"
            bgcolor="white"
          >
            <Box display={'flex'} width="100%">
              <textarea className={styles.queryReplyInput} placeholder='write a message'/>
              <Box
                marginTop={1}
                paddingRight={2}
              >
                <img src={expandIcon} alt="" />
              </Box>
            </Box>
            <Box
              className={styles.queryReplyAttachSend}
            // onClick={() => setNotesModal(true)}
            >
              <img src={attachFile} alt="" />
              <Box className={styles.sendButton}>Send</Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QueryResolutionWidget;
