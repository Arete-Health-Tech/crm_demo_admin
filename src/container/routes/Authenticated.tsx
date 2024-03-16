import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../screen/dashboard/Dashboard';
import Department from '../../screen/department/Department';
import Doctor from '../../screen/doctor/Doctor';
import DashboardLayout from '../layout/DashboardLayout';
import DepartmentLayout from '../layout/DepartmentLayout';
import TicketLayout from '../layout/TicketLayout';
import Services from '../../screen/services/Services';
import Wards from '../../screen/wards/Wards';
import SingleTicketDetails from '../../screen/ticket/SingleTicketDetails';
import Tags from '../../screen/tags/Tags';
import Stage from '../../screen/stage/Stage';
import Script from '../../screen/script/Script';
import Flow from '../../screen/flow/Flow';
import NodeConnector from '../../screen/flow/widgets/NodeConnector';
import NodeReplies from '../../screen/flow/NodeReplies';
import NodeList from '../../screen/flow/NodeList';
import Dump from '../../screen/script/Dump';

type Props = {};

const Authenticated = (props: Props) => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="department" element={<DepartmentLayout />}>
          <Route index element={<Department />} />
          <Route path="doctors" element={<Doctor />} />
          <Route path="wards" element={<Wards />} />
        </Route>
        <Route path="services" element={<Services />} />
        <Route path="scripts" element={<Script />} />
        <Route path="tags" element={<Tags />} />
        <Route path="stages" element={<Stage />} />
        <Route path="flow" element={<Flow />}>
          <Route path="connector" element={<NodeConnector />} />
          <Route path="node-replies" element={<NodeReplies />} />
          <Route path="node-lists" element={<NodeList />} />
        </Route>
      </Route>
      <Route path="ticket" element={<TicketLayout />}>
        <Route path=":ticketID" element={<SingleTicketDetails />} />
      </Route>
      <Route path="tickets" element={<TicketLayout />}/>
      <Route path="dump" element={<Dump />} />
    </Routes>
  );
};

export default Authenticated;
