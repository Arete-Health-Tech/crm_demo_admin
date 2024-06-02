import React from 'react'
import { Route, Routes } from 'react-router-dom';

import QueryResolution from '../../screen/queryResolution/QueryResolution';
import NavQuery from '../../screen/queryResolution/NavQuery';
import QueryDashBoard from '../../screen/queryResolution/QueryDashBoard';



function Query() {
  return (
    <>
      <NavQuery>
        <Routes>
        <Route path="/" element={<QueryResolution />} />
        {/* <Route path="/queryResolution/:ticketID" element={<QueryResolution />} /> */}
        </Routes>
      </NavQuery>
    </>
  );
}

export default Query;