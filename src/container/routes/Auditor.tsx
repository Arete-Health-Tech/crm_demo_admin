import React from 'react'
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import NavAudit from '../../screen/audit/NavAudit';
import Audit from '../../screen/audit/Audit';
import AuditDashboard from '../../screen/audit/AuditDashboard';


function Auditor() {
  return (
    <>
      <NavAudit>
        <Routes>
          <Route path="/" element={<AuditDashboard />}></Route>
             <Route path="/auditDetails" element={<Audit />}></Route>
        </Routes>
      </NavAudit>
    </>
  );
}

export default Auditor;