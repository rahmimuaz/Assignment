import React, { useState ,useContext,useEffect} from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import LoginPopup from './components/LoginPopup/LoginPopup'; 
import { StoreContext } from './context/StoreContext';
import Login from './components/Login/Login'
import 'bootstrap/dist/css/bootstrap.css';
import StudentManagement from "./pages/StudentManagement/StudentManagement";

const App = () => {
  const [showLogin, setShowLogin] = useState(false); 
  const { token, setToken } = useContext(StoreContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        setToken(storedToken);
    }
}, [setToken]);

  return (
    <div className='app'>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/students' element={<StudentManagement />} />
        <Route path='/login' element={<LoginPopup setShowLogin={setShowLogin} />} />
      </Routes>
    </div>
  );
};

export default App;