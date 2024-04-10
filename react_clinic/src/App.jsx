import './App.css';
import { Route, Routes } from 'react-router-dom';
import Clinic from './pages/Clinic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Board from './components/dashboard/Board.jsx';
import Patient from './components/dashboard/Patient.jsx';
import Detail from './components/dashboard/Detail.jsx';
import Appointment from './components/dashboard/Appointment.jsx';
import Personal from './components/dashboard/personal/Personal.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Clinic />} />
        <Route path='/dashboard/' element={<Dashboard />}>
          <Route path='' element={<Board />} />
          <Route path='patient/*' element={<Patient />} />
          <Route path='patient/detail/:id' element={<Detail value={"Paciente"} />} />
          <Route path='appointment/*' element={<Appointment />} />
          <Route path='appointment/:slug/:id' element={<Appointment />} />
          <Route path='personal/*' element={<Personal />} />
          <Route path='personal/detail/:id' element={<Detail value={"Personal"}/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;