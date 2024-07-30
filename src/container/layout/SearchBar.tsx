import { Box, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import TicketCard from '../../screen/ticket/widgets/TicketCard';

function SearchBar(props: any) {
  const { searchTerm, setSearchTerm } = props;

  // const [searchData, setSearchData] = useState('');
  // const [filteredTickets, setFilteredTickets] = useState([]);

  // useEffect(() => {
  //   const fetchFilteredTickets = async () => {
  //     const response = await axios.get('http://localhost:3000/tickets', {
  //       params: { firstName: searchTerm }
  //     });
  //     setFilteredTickets(response.data);
  //     setSearchData(response.data);
  //   };

  //   if (searchTerm) {
  //     fetchFilteredTickets();
  //   } else {
  //     setFilteredTickets([]);
  //   }
  // }, [searchTerm]);
  const handleSearchTermChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      {/* <Box
        position="relative"
        p={1}
        height={'87vh'}
        sx={{
          overflowY: 'scroll',
          '&::-webkit-scrollbar ': {
            // display: 'none'
          }
        }}
      >
        {filteredTickets?.map((item: any) => (
          <TicketCard key={item._id} patientData={item} />
        ))}
      </Box> */}
    </div>
  );
}

export default SearchBar;
