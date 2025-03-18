import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentList = ({ students, fetchStudents, handleDelete, toggleStatus }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Student List</h1>

      <Link
        to="/add-student"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Student
      </Link>

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
          {students?.length > 0 ? (
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
                    onClick={() => toggleStatus(student._id, student.status)}
                    className={`px-3 py-1 rounded ${
                      student.status === "Active" ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {student.status}
                  </button>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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

export default StudentList;
