import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext.jsx'
import { useUserGroup } from './hooks/useUserGroup.jsx';
import DashboardContext from './contexts/DashboardContext.js';
import Clinic from './pages/Clinic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Board from './components/dashboard/Board.jsx';
import Patient from './components/dashboard/Patient.jsx';
import Detail from './components/dashboard/Detail.jsx';
import Appointment from './components/dashboard/Appointment.jsx';
import Budget from './components/dashboard/Budget.jsx';
import BudgetModal from './components/dashboard/BudgetModal.jsx';
import Payment from './components/dashboard/Payment.jsx';
import PaymentModal from './components/dashboard/PaymentModal.jsx';
import Personal from './components/dashboard/Personal.jsx';
import Settings from './components/dashboard/Settings.jsx';
import SettingsModal from './components/dashboard/SettingsModal.jsx';
import Odontogram from './components/dashboard/Odontogram.jsx';
import {Reports} from './components/dashboard/reports/Reports.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

function App() {
  const { setUserGroup, setUserID } = useUser();
  const { userGroup, isLoading } = useUserGroup();
  const location = useLocation();
  const dashboardData = {
    titles: {
      dashboard: 'Dashboard',
      patient: 'Pacientes',
      appointment: "Citas",
      budget: "Presupuestos",
      payment: "Pagos",
      personal: "Personal",
      reports: "Reportes",
      settings: "Ajustes",
    },
  };

  React.useEffect(() => {
    if (location.pathname.includes('dashboard')) {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserGroup(decodedToken.groups);
        setUserID(decodedToken.id);
      }
    }
  }, [location.pathname.includes('dashboard')]);

  return (
    <>
      <DashboardContext.Provider value={dashboardData}>
        <Routes>
          <Route path='/' element={<Clinic />} />
          <Route path='/dashboard/' element={<Dashboard />}>
            <Route path='' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Board /> : <Navigate to={'/denied'} replace />} />
            <Route path='patient/*' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Patient /> : <Navigate to={'/denied'} replace />} />
            <Route path='patient/detail/:id' element={<Detail value={"Paciente"} />} />
            <Route path='patient/odontogram/:id' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Odontogram /> : <Navigate to={'/denied'} replace />} />
            <Route path='appointment/*' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Appointment /> : <Navigate to={'/denied'} replace />} />
            <Route path='appointment/:slug/:id' element={<Appointment />} />
            <Route path='budget/*' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Budget /> : <Navigate to={'/denied'} replace />}>
              <Route path='detail/:id' element={<BudgetModal />} />
            </Route>
            <Route path='payment/*' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Payment /> : <Navigate to={'/denied'} replace />}>
              <Route path='detail/:id' element={<PaymentModal />} />
            </Route>
            <Route path='personal/*' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Personal /> : <Navigate to={'/denied'} replace />} />
            <Route path='personal/detail/:id' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Detail value={"Personal"} /> : <Navigate to={'/denied'} replace />} />
            <Route path='reports/' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Reports /> : <Navigate to={'/denied'} replace />} />
            <Route path='settings/' element={(!isLoading && userGroup.includes("PersonalGroup")) ? <Settings /> : <Navigate to={'/denied'} replace />}>
              <Route path='modal/:id' element={<SettingsModal />} />
            </Route>
          </Route>
          <Route path='/denied' element={<AccessDenied />} />
        </Routes>
      </DashboardContext.Provider>
    </>
  );
}

export default App;