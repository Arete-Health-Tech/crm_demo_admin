import React from 'react'
import { Route, Routes } from 'react-router-dom';
import QueryResolutionLayout from '../../screen/queryResolution/QueryResolutionLayout';
import NavQuery from '../../screen/queryResolution/Navbar/NavQuery';



function Query() {
  return (
    <>
      <NavQuery>
        <Routes>
          <Route path="/" element={<QueryResolutionLayout />} />
          {/* <Route path="/queryResolution/:ticketID" element={<QueryResolution />} /> */}
        </Routes>
      </NavQuery>
    </>
  );
}

export default Query;