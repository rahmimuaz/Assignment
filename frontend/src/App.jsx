import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPopup from './components/LoginPopup/LoginPopup';
import { StoreContext } from './context/StoreContext';
import Login from './components/Login/Login';
import 'bootstrap/dist/css/bootstrap.css';
import AddStudent from "./pages/StudentManagement/AddStudent";  // Import AddStudent
import ListStudents from "./pages/StudentManagement/ListStudents";  // Import ListStudents
import EditStudent from './pages/StudentManagement/EditStudent';
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
        <Route path='/students/add' element={<AddStudent />} />  {/* Add Student page */}
        <Route path='/students/list' element={<ListStudents />} />  {/* List Students page */}
        <Route path="/students/edit/:studentId" element={<EditStudent />} />
        <Route path='/login' element={<LoginPopup setShowLogin={setShowLogin} />} />
      </Routes>
    </div>
  );
};

export default App;
