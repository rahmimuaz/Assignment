import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/students/list");
      setStudents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching students", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (studentId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await axios.put(`http://localhost:5001/api/students/change-status`, { 
        studentId: studentId, 
        status: newStatus 
      });
      fetchStudents();
    } catch (error) {
      console.error("Error toggling student status", error);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.post(`http://localhost:5001/api/students/remove`, { id: studentId });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  const handleEdit = (studentId) => {
    navigate(`/students/edit/${studentId}`, { state: { studentId } });
  };


  const handleLogout = () => {

    localStorage.removeItem('authToken'); 
    navigate('/'); 
  };


  const handleAddStudent = () => {
    navigate("/students/add");
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Student List</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={handleAddStudent}
      >
        Add Student
      </button>
      <button
        className="btn btn-danger mb-4 ms-2"
        onClick={handleLogout}
      >
        Logout
      </button>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Age</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  {student.image ? (
                    <img
                      src={`http://localhost:5001/images/${student.image}`}
                      alt="student"
                      style={{ maxHeight: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>
                  <button
                    className={`btn ${
                      student.status === 'Active' ? 'btn-darkgreen' : 'btn-gray'
                    }`}
                    onClick={() => handleStatusToggle(student._id, student.status)}
                  >
                    {student.status}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-darkblue me-2"
                    onClick={() => handleEdit(student._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-darkred"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListStudents;
