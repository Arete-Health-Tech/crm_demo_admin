import React from 'react'
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import NavAudit from '../../screen/audit/NavAudit';
import Audit from '../../screen/audit/Audit';
import AuditDashboard from '../../screen/audit/AuditDashboard';
import AuditSinglePageDetail from '../../screen/audit/AuditSinglePage/AuditSinglePageDetail';


function Auditor() {
  return (
    <>
      <NavAudit>
        <Routes>
          <Route path="/" element={<AuditDashboard />}></Route>
          <Route path="/auditDetails" element={<Audit />}></Route>
          <Route path="/auditSingleTicketDetail/:ticketID" element={<AuditSinglePageDetail />} />
        </Routes>
      </NavAudit>
    </>
  );
}

export default Auditor;