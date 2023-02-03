import {
  FemaleOutlined,
  MaleOutlined,
  SearchOutlined,
  TransgenderOutlined
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchConsumerHandler } from '../../../api/consumer/consumerHandler';
import useConsumerStore from '../../../store/consumerStore';
import BackHeader from '../widgets/BackHeader';

const Search = () => {
  const [search, setSearch] = useState('');
  const { searchResults } = useConsumerStore();

  return (
    <Box>
      {/* <BackHeader title="Search Patient" /> */}
      <Stack
        spacing={2}
        borderRadius="0rem 0rem 1rem 1rem"
        p={1}
        bgcolor="primary.main"
        height={'17vh'}
        mb={2}
      >
        <Stack>
          <Typography color="white" variant="h6">
            Search Regsitered Patients
          </Typography>
        </Stack>
        <FormControl fullWidth variant="standard">
          <OutlinedInput
            size="small"
            sx={{ bgcolor: 'white', outline: 'none' }}
            value={search}
            placeholder="Search Patient"
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => searchConsumerHandler(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchConsumerHandler(search);
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => searchConsumerHandler(search)}
                  edge="end"
                >
                  <SearchOutlined />
                </IconButton>
              </InputAdornment>
            }
            fullWidth
          />
        </FormControl>
      </Stack>
      <Box p={1}>
        {searchResults.map((item) => {
          return (
            <Paper sx={{ my: 1, p: 1, bgcolor: 'lightgray' }} key={item._id}>
              <Link to={`/consumer/${item._id}`}>
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    UHID {item.uid}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {item.firstName[0].toLocaleUpperCase()}
                      {item?.lastName[0].toLocaleUpperCase()}
                    </Avatar>
                    <Stack>
                      <Typography
                        fontSize="1.1rem"
                        textTransform="capitalize"
                        variant="body1"
                        fontWeight={500}
                      >
                        {item.firstName +
                          ' ' +
                          (item.lastName ? item.lastName : '')}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Typography color="text.secondary">
                          {item.gender === 'M' ? (
                            <MaleOutlined />
                          ) : item.gender === 'F' ? (
                            <FemaleOutlined />
                          ) : item.gender === 'O' ? (
                            <TransgenderOutlined />
                          ) : (
                            'Not Specified'
                          )}
                        </Typography>
                        <Typography variant="body2">
                          {dayjs(item.dob).toNow(true)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Typography variant="caption">{item.email}</Typography>
                </Box>
              </Link>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default Search;
