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
      fetchStudents();  // Refresh the list after status change
    } catch (error) {
      console.error("Error toggling student status", error);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.post(`http://localhost:5001/api/students/remove`, { id: studentId });
      fetchStudents();  // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  const handleEdit = (studentId) => {
    navigate(`/students/edit/${studentId}`, { state: { studentId } });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Student List</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id} className="border">
                <td className="border p-2">
                  {student.image ? (
                    <img
                      src={`http://localhost:5001/images/${student.image}`}
                      alt="student"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.age}</td>
                <td className="border p-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      student.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                    onClick={() => handleStatusToggle(student._id, student.status)}
                  >
                    {student.status}
                  </button>
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(student._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
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
