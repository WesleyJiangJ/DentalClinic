import './App.css';
import { Route, Routes } from 'react-router-dom';
import Clinic from './pages/Clinic.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Clinic />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;