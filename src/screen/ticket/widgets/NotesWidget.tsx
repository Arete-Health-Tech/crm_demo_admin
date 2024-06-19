import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createNotesHandler,
  getAllNotesHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import useTicketStore from '../../../store/ticketStore';
import { ReactComponent as NoResultFoundSVG } from '../../../assets/images/no-result-found.svg';
import dayjs from 'dayjs';
import { iNote } from '../../../types/store/ticket';
import { Send, StickyNote2Outlined } from '@mui/icons-material';
import { UNDEFINED } from '../../../constantUtils/constant';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import expandIcon from '../../../assets/expandIcon.svg';
import CloseModalIcon from '../../../assets/CloseModalIcon.svg';
import notesAttachmentIcon from '../../../assets/notesAttachmentIcon.svg';
import NotesIcon from '../../../assets/NotesIcon.svg';
// import avatar1 from '../../../assets/avatar1.svg';
import arrowright from '../../../assets/arrowright.svg';
import arrowLeft from '../../../assets/arrowLeft.svg';
import styles from './Notes.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactHtmlParser from 'html-react-parser';
import { Avatar } from '@mui/material';
import useUserStore from '../../../store/userStore';
import { deleteNotes, updateNotes } from '../../../api/ticket/ticket';
import { toast } from 'react-toastify';

type Props = { setTicketUpdateFlag: any };

const NotesWidget = (props: Props) => {
  const { filterTickets, searchByName, pageNumber, isAuditor } = useTicketStore();
  const [notesModal, setNotesModal] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [notesClickedData, setNotesClickedData] = useState<iNote | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isNoteEdited, setIsNoteEdited] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { ticketID } = useParams();
  const { user, setUser } = useUserStore();

  console.log({ notesClickedData })

  const handleAddNewNote = async () => {
    if (note !== '<p><br></p>') {
      const data: iNote = {
        text: note,
        ticket: ticketID!
      };
      await createNotesHandler(data);
      setTimeout(() => {
        (async () => {
          const result = await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
          );
          props.setTicketUpdateFlag(result);
        })();
      }, 1000);

      setNote('');
      setNotesModal(false);
    }
  };
  const handleNoteEdited = async () => {
    if (note !== '<p><br></p>') {
      const updatedNoteData = {
        note: note,
        ticketId: notesClickedData?._id,
        // noteId: notesClickedData?._id
      };
      await updateNotes(updatedNoteData);
      setTimeout(() => {
        (async () => {
          const result = await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
          );
          setNotesClickedData(null)
          await getAllNotesHandler(ticketID as string);
          props.setTicketUpdateFlag(result);
        })();
      }, 1000);

      setNote('');
      setNotesModal(false);
    }
  };
  const handleNoteDelete = async () => {
    if (!notesClickedData?._id) {
      console.error('No note ID found');
      return;
    }

    const noteId = { ticketId: notesClickedData._id };
    try {
      await deleteNotes(noteId);
      setDeleteModal(false)
    } catch (error) {
      toast.error("something went wrong Please try again later")
    }
    setTimeout(() => {
      (async () => {
        const result = await getTicketHandler(
          searchByName,
          pageNumber,
          'false',
          filterTickets
        );
        setNotesClickedData(null)
        await getAllNotesHandler(ticketID as string);
        props.setTicketUpdateFlag(result);
      })();
    }, 1000);

    setNote('');
    setNotesModal(false);
  }
  console.log(note);

  useEffect(() => {
    const fetchNotes = async () => {
      await getAllNotesHandler(ticketID as string);
      setLoading(false);
    };
    fetchNotes();
  }, [ticketID]);

  const { notes } = useTicketStore();
  // Handles opening the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Necessary for positioning
    setOpen(true);
  };

  // Handles closing the menu
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box height="95%" position="relative" bgcolor="white" p={1}>
        {loading ? (
          <Box height="36vh">Loading... </Box>
        ) : notes.length > 0 && notesClickedData === null ? (
          <Box
            height={isAuditor ? "56vh" : "36vh"}
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            {notes.map((note: iNote) => {
              return (
                <Box
                  key={note._id}
                  display={'flex'}
                  padding={'0rem 1rem 0rem 1rem'}
                  height={'14vh'}
                >
                  <Box className={styles.noteIcon}>
                    <img src={NotesIcon} alt="" />
                  </Box>
                  <Box className={styles.notestextArea}>
                    <Box className={styles.notestext}>
                      <span>{ReactHtmlParser(note.text)}</span>
                      <img
                        src={arrowright}
                        alt=""
                        onClick={() => setNotesClickedData(note)}
                      />
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Box className={styles.notesDate}>
                        {dayjs(note.createdAt).format('DD MMM YYYY hh:mm A')}
                      </Box>
                      <Box
                        className={styles.notesImage}
                        height={'1.25rem'}
                        width={'1.25rem'}
                      >
                        <Avatar sx={{
                          fontSize: '8px', bgcolor: 'orange',
                          height: '1rem',
                          width: '1rem',
                          margin: '0.3rem',
                          marginTop: '8px'
                        }}>
                          {user?.firstName[0]?.toUpperCase()}
                          {user?.lastName[0]?.toUpperCase()}
                        </Avatar>
                        {/* <img src={avatar1} alt="" /> */}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : notesClickedData === null ? (
          <Stack
            height="36vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <NoResultFoundSVG />
            <Typography color="gray" variant="caption" mt={1}>
              No notes available.
            </Typography>
          </Stack>
        ) : (
          <Box
            height={"36vh"}
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            <Box className={styles.ClickedNoteHeader}>
              <img
                src={arrowLeft}
                alt=""
                onClick={() => setNotesClickedData(null)}
              />
              {!isAuditor && <div>
                <IconButton
                  aria-label="more"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '15ch',
                      borderRadius: 20
                    }
                  }}
                >
                  <MenuItem
                    onClick={handleClose}
                    style={{ color: '#080F1A', fontFamily: 'Outfit,san-serif' }}
                    onClickCapture={() => (
                      setIsNoteEdited(true),
                      setNotesModal(true),
                      setNote(notesClickedData.text)
                    )}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDeleteModal(true);
                      setOpen(false);
                    }}
                    style={{ color: '#F94839', fontFamily: 'Outfit,san-serif' }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </div>}
            </Box>
            <Box className={styles.ClickedNoteText}>
              <Box className={styles.insideNoteText}>{ReactHtmlParser(notesClickedData.text)}</Box>
              <Box className={styles.notesDate}>
                {dayjs(notesClickedData.createdAt).format(
                  'DD MMM YYYY hh:mm A'
                )}
              </Box>
            </Box>
          </Box>
        )}

        {!isAuditor && <Box
          height="15vh"
          bottom={2}
          borderTop={2.5}
          borderColor="#317AE2"
          bgcolor="white"
        >
          <Box
            display={'flex'}
            justifyContent={'end'}
            marginTop={1}
            paddingRight={2}
          >
            <img src={expandIcon} alt="" />
          </Box>
          <Box
            display={'flex'}
            justifyContent={'center'}
            color={'#647491'}
            fontFamily={'Outfit, sans-serif'}
            fontSize={'1rem'}
            fontWeight={400}
          >
            This a guided text will be added
          </Box>
          <Box
            className={styles.initiateCallButton}
            onClick={() => setNotesModal(true)}
          >
            <span>Create a note</span>
          </Box>
        </Box>}
      </Box>

      {/* MODAL for create note and edit note */}

      <Modal
        open={notesModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.openedModal}>
          <Stack
            className={styles.reminder_modal_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack>Notes</Stack>
            <Stack
              className={styles.modal_close}
              onClick={() => (setNotesModal(false), setNote(''))}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
          <Stack height={'43vh'}>
            <ReactQuill
              theme="snow"
              value={note}
              onChange={(content) => setNote(content)}
              className={styles.noteBox}
              style={{ height: '35vh' }}
            />
          </Stack>
          <Box className={styles.AttachmentFooter}>
            <Box>
              <img src={notesAttachmentIcon} alt="" />
            </Box>
            <Box className={styles.AttachmentText}>Add Attachments</Box>
          </Box>
          <Box className={styles.NotesFooter}>
            <Box
              className={styles.Cancel}
              onClick={() => (setNote(''), setNotesModal(false))}
            >
              Cancel
            </Box>
            <Box
              className={
                note !== '<p><br></p>'
                  ? styles.createNoteActive
                  : styles.createNote
              }
              onClick={isNoteEdited ? handleNoteEdited : handleAddNewNote}
            >
              {isNoteEdited ? 'Save Changes' : 'Create Note'}
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* MODAL for Delete the notes */}

      <Modal
        open={deleteModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.deleteOpenedModal}>
          <Stack
            className={styles.delete_reminder_modal_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack>Delete Note</Stack>
            <Stack
              className={styles.modal_close}
              onClick={() => setDeleteModal(false)}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
          <Box className={styles.deleteNoteText}>
            Are you sure want to delete this permanently, this action is irreversible.
          </Box>
          <Box className={styles.DeleteNotesFooter}>
            <Box
              className={styles.Cancel}
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Box>
            <Box
              className={styles.DeleteNoteButton}
              onClick={handleNoteDelete}
            >
              Delete
            </Box>
          </Box>
        </Box>
      </Modal>

    </>
  );
};
export default NotesWidget;
