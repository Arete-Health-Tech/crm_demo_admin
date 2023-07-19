import React from 'react';

import { useState } from 'react';
import TicketCard from '../../screen/ticket/widgets/TicketCard';
import { Box, Pagination } from '@mui/material';

const ITEMS_PER_PAGE = 20;

function PaginationTicket({ tickets }) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Box
        position="relative"
        p={1}
        height={'95vh'}
    
        sx={{
          mt:"30px",
          overflowY: 'scroll',     
          '&::-webkit-scrollbar ': {
            //  display: 'flex',

            
          }
        }}
      >
        {/* {currentItems.map((item: any) => (
          <TicketCard key={item._id} patientData={item} />
        ))} */}

        <Pagination
          sx={{
            display: 'flex',
            position: 'fixed',
            marginTop:'100',
            bottom: 0,
            width: '23%',
            backgroundColor: 'whitesmoke',
            padding: '1',
            borderTop: `1px solid black`
          }}
          count={Math.ceil(tickets.length / ITEMS_PER_PAGE)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
}

export default PaginationTicket;
