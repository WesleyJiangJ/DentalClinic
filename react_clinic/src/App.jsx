import './App.css';
import { Route, Routes } from 'react-router-dom';
import DashboardContext from './components/dashboard/DashboardContext.js';
import Clinic from './pages/Clinic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Board from './components/dashboard/Board.jsx';
import Patient from './components/dashboard/Patient.jsx';
import Detail from './components/dashboard/Detail.jsx';
import Appointment from './components/dashboard/Appointment.jsx';
import Payments from './components/dashboard/Payments.jsx';
import PaymentModal from './components/dashboard/PaymentModal.jsx';
import Personal from './components/dashboard/Personal.jsx';
import Settings from './components/dashboard/Settings.jsx';
import TreatmentModal from './components/dashboard/TreatmentModal.jsx';

function App() {
  const dashboardData = {
    titles: {
      dashboard: 'Dashboard',
      patient: 'Pacientes',
      appointment: "Citas",
      payments: "Pagos",
      personal: "Personal",
      settings: "Ajustes",
    },
  };
  return (
    <>
      <DashboardContext.Provider value={dashboardData}>
        <Routes>
          <Route path='/' element={<Clinic />} />
          <Route path='/dashboard/' element={<Dashboard />}>
            <Route path='' element={<Board />} />
            <Route path='patient/*' element={<Patient />} />
            <Route path='patient/detail/:id' element={<Detail value={"Paciente"} />} />
            <Route path='appointment/*' element={<Appointment />} />
            <Route path='appointment/:slug/:id' element={<Appointment />} />
            <Route path='payments/*' element={<Payments />}>
              <Route path='detail/:id' element={<PaymentModal />} />
            </Route>
            <Route path='personal/*' element={<Personal />} />
            <Route path='personal/detail/:id' element={<Detail value={"Personal"} />} />
            <Route path='settings/*' element={<Settings />}>
              <Route path='treatment/:id' element={<TreatmentModal />} />
            </Route>
          </Route>
        </Routes>
      </DashboardContext.Provider>
    </>
  );
}

export default App;