import './App.css';
import { Route, Routes } from 'react-router-dom';
import Clinic from './pages/Clinic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Board from './components/dashboard/Board.jsx';
import Patient from './components/dashboard/Patient.jsx';
import PatientDetail from './components/dashboard/PatientDetail.jsx';
import Appointment from './components/dashboard/Appointment.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Clinic />} />
        <Route path='/dashboard/' element={<Dashboard />}>
          <Route path='' element={<Board />} />
          <Route path='patient/*' element={<Patient />} />
          <Route path='patient/detail' element={<PatientDetail />} />
          <Route path='appointment/*' element={<Appointment />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;