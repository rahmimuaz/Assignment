import React from "react";
import { Link } from "react-router-dom";

const StudentList = ({ students, fetchStudents, handleDelete, toggleStatus }) => {
  return (
    <div>
      <h1>Student List</h1>

      <Link to="/add-student">
        Add Student
      </Link>

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
          {students?.length > 0 ? (
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
                    onClick={() => toggleStatus(student._id, student.status)}
                  >
                    {student.status}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(student._id)}>
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

export default StudentList;
