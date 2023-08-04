import { Box, Chip, Stack, TextField, Typography } from '@mui/material';
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

type Props = { setTicketUpdateFlag: any };

const NotesWidget = (props: Props) => {
  const { filterTickets, searchByName, pageNumber } = useTicketStore();
  const TextInput = {
    border: 0,
    width: '100%',
    padding: '1rem',
    'input:focus': {
      outline: 'none'
    }
  };
  const { ticketID } = useParams();

  const handleAddNewNote = async () => {
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
  };

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      await getAllNotesHandler(ticketID as string);
      setLoading(false);
    };
    fetchNotes();
  }, [ticketID]);

  const { notes } = useTicketStore();
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && note.trim() !== '') {
      handleAddNewNote();
    }
  };

  return (
    <Box height="95%" position="relative" bgcolor="white" p={1}>
      {loading ? (
        <Box height="90%">Loading... </Box>
      ) : notes.length > 0 ? (
        <Box
          height="90%"
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              display: 'none'
            }
          }}
        >
          {notes.map((note: iNote) => {
            return (
              <Box key={note._id}>
                <Stack
                  my={1}
                  borderRadius={1}
                  bgcolor="#F1F5F7"
                  p={1}
                  direction="column"
                  spacing={1}
                >
                  <StickyNote2Outlined />
                  <Typography variant="caption">{note.text}</Typography>
                  <Chip
                    sx={{ width: '25%' }}
                    size="small"
                    label={dayjs(note.createdAt).format('DD MMM YYYY hh:mm A')}
                  />
                </Stack>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Stack
          height="90%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <NoResultFoundSVG />
          <Typography color="gray" variant="caption" mt={1}>
            No notes available.
          </Typography>
        </Stack>
      )}

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
            value={note}
            fullWidth
            id="note"
            autoFocus
            onChange={(e) => setNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write Your Note "
            InputProps={{
              disableUnderline: true
            }}
          />
          <Box
            width="25%"
            sx={{ cursor: 'pointer' }}
            display="flex"
            justifyContent="space-evenly"
            onClick={handleAddNewNote}
            style={{ color: note ? 'blue' : 'gray' }}
          >
            <Typography color={note ? 'blue' : 'gray'}>Add Note</Typography>
            <Send htmlColor={note ? 'blue' : 'gray'} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
export default NotesWidget;
