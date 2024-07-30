import {
  Avatar,
  Box,
  Chip,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
import useServiceStore from '../../../store/serviceStore';
import { database } from '../../../utils/firebase';
import NotSelected from '../../../assets/images/notSelected.png';
import NotAvailable from '../../../assets/images/notAvailable.png';
import { QuestionAnswerOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

type Props = {};

const QueryResolution = (props: Props) => {
  const { departments } = useServiceStore();
  const [fetchedQueries, setFetchedQueries] = useState<DocumentData[]>();
  const [selectedDept, setSelectedDept] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      getDepartmentsHandler();
    })();
  }, []);

  useEffect(() => {
    const collectionRef = collection(database, 'queries');
    const q = query(
      collectionRef,
      where('departmentId', '==', selectedDept),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const queries: DocumentData[] = [];
      snapshot.forEach((doc) => {
        queries.push({ ...doc.data(), id: doc.id });
      });
      //   alert(selectedDept);
      setFetchedQueries(queries);
    });
    return () => unsub();
  }, [selectedDept]);

  return (
    <Box>
      <Box p={2} bgcolor="primary.main" borderRadius="0rem 0rem 1rem 1rem">
        <Typography color="white" variant="subtitle1" fontWeight={500} mb={2}>
          Select Your Department to get the Queries from Remote Agent
        </Typography>
        <FormControl size="small" fullWidth sx={{ my: 2 }}>
          <Typography variant="caption" color="white ">
            Select Department
          </Typography>
          <Select
            sx={{
              textTransform: 'capitalize',
              fontSize: '0.8rem',
              bgcolor: 'white'
            }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((department) => (
              <MenuItem
                sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}
                value={department._id}
              >
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedDept.length < 1 ? (
        <Stack display="flex" justifyContent="center" alignItems="center">
          <img src={NotSelected} alt="No Department Selected" width="50%" />
          <Typography variant="body2" fontWeight={500} color="GrayText">
            No Department Selected
          </Typography>
        </Stack>
      ) : (
        <Box p={1}>
          {fetchedQueries ? (
            fetchedQueries?.length > 0 ? (
              <List
                sx={{
                  width: '100%'
                }}
              >
                {fetchedQueries?.map((query) => (
                  <ListItem
                    onClick={() => navigate(`/query-room/${query.id}`)}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'lightgray',
                      bgcolor: '#f3f3f3'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <QuestionAnswerOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={500}>
                        {query.subject}
                      </Typography>
                      <Typography color="GrayText" variant="caption">
                        {dayjs(query.createdAt.seconds * 1000).format(
                          'DD MMM YYYY , hh:mm A'
                        )}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Stack display="flex" justifyContent="center" alignItems="center">
                <img
                  src={NotAvailable}
                  alt="No Department Selected"
                  width="50%"
                />
                <Typography variant="body2" fontWeight={500} color="GrayText">
                  No Queries Available
                </Typography>
              </Stack>
            )
          ) : (
            'Loading....'
          )}
        </Box>
      )}
    </Box>
  );
};

export default QueryResolution;
