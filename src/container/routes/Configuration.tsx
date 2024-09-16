import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ConfigurationBar from '../../screen/configuration/ConfigurationBar';
import AgentConfig from '../../screen/configuration/userManagement/AgentConfig';
import CordinatorConfig from '../../screen/configuration/userManagement/CordinatorConfig';
import DoctorConfig from '../../screen/configuration/userManagement/DoctorConfig';
import SpocsConfig from '../../screen/configuration/userManagement/SpocsConfig';
import DepartmentMaster from '../../screen/configuration/dataMaster/DepartmentMaster';
import WardMaster from '../../screen/configuration/dataMaster/WardMaster';
import ServiceMaster from '../../screen/configuration/dataMaster/ServiceMaster';
import UnitMaster from '../../screen/configuration/dataMaster/UnitMaster';

const Configuration = () => {
    return (
        <ConfigurationBar>
            <Routes>
                <Route path='agents' element={<AgentConfig />} />
                <Route path="cordinators" element={<CordinatorConfig />} />
                <Route path="spocs" element={<SpocsConfig />} />
                <Route path="doctors" element={<DoctorConfig />} />
                <Route path="departmentsmaster" element={<DepartmentMaster />} />
                <Route path="wards" element={<WardMaster />} />
                <Route path="services" element={<ServiceMaster />} />
                <Route path="units" element={<UnitMaster />} />
            </Routes>
        </ConfigurationBar>
    );
};

export default Configuration;
