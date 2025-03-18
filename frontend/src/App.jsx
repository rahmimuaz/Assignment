import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { StoreContext } from './context/StoreContext';
import Login from './components/Login/Login';
import 'bootstrap/dist/css/bootstrap.css';
import AddStudent from "./pages/StudentManagement/AddStudent";
import ListStudents from "./pages/StudentManagement/ListStudents";
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
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/students/add' element={<AddStudent />} />
        <Route path='/students/list' element={<ListStudents />} />
        <Route path="/students/edit/:studentId" element={<EditStudent />} />
      </Routes>
    </div>
  );
};

export default App;
