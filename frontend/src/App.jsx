import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.jsx'
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
import Reports from './components/dashboard/Reports.jsx';

function App() {
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
  return (
    <>
      <UserProvider>
        <DashboardContext.Provider value={dashboardData}>
          <Routes>
            <Route path='/' element={<Clinic />} />
            <Route path='/dashboard/' element={<Dashboard />}>
              <Route path='' element={<Board />} />
              <Route path='patient/*' element={<Patient />} />
              <Route path='patient/detail/:id' element={<Detail value={"Paciente"} />} />
              <Route path='patient/odontogram/:id' element={<Odontogram />} />
              <Route path='appointment/*' element={<Appointment />} />
              <Route path='appointment/:slug/:id' element={<Appointment />} />
              <Route path='budget/*' element={<Budget />}>
                <Route path='detail/:id' element={<BudgetModal />} />
              </Route>
              <Route path='payment/*' element={<Payment />}>
                <Route path='detail/:id' element={<PaymentModal />} />
              </Route>
              <Route path='personal/*' element={<Personal />} />
              <Route path='personal/detail/:id' element={<Detail value={"Personal"} />} />
              <Route path='reports/' element={<Reports />} />
              <Route path='settings/*' element={<Settings />}>
                <Route path='modal/:id' element={<SettingsModal />} />
              </Route>
            </Route>
          </Routes>
        </DashboardContext.Provider>
      </UserProvider>
    </>
  );
}

export default App;