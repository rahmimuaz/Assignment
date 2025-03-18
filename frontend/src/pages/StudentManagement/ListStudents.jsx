import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListStudents = () => {
  const [students, setStudents] = useState([]);
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

  return (
    <div>
      <h1>Student List</h1>
      <table>
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
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>
                  {student.image ? (
                    <img
                      src={`http://localhost:5001/images/${student.image}`}
                      alt="student"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>
                  <button
                    onClick={() => handleStatusToggle(student._id, student.status)}
                  >
                    {student.status}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(student._id)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListStudents;
